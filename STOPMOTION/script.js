/**
 * STOP MOTION STUDIO PRO - Logic Controller
 */

class StopMotionDB {
    constructor() {
        this.dbName = 'StopMotionPro';
        this.dbVersion = 1;
        this.db = null;
    }

    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('frames')) {
                    db.createObjectStore('frames', { keyPath: 'id' });
                }
            };
        });
    }

    async saveFrame(frame) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('frames', 'readwrite');
            const store = tx.objectStore('frames');
            store.put(frame);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async getAllFrames() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('frames', 'readonly');
            const store = tx.objectStore('frames');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteFrame(id) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('frames', 'readwrite');
            const store = tx.objectStore('frames');
            store.delete(id);
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }

    async clearAll() {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('frames', 'readwrite');
            const store = tx.objectStore('frames');
            store.clear();
            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
        });
    }
}

class StopMotionStudio {
    constructor() {
        this.db = new StopMotionDB();
        this.stream = null;
        this.frames = []; 
        this.frameImages = new Map(); // Cache for Image objects to prevent flickers
        this.activeFrameIndex = -1;
        this.isPlaying = false;
        this.playbackInterval = null;
        this.fps = 12;
        this.onionOpacity = 0.5;
        this.onionDepth = 1;
        this.constraints = {
            width: 1280,
            height: 720
        };

        // DOM Elements
        this.video = document.getElementById('cameraPreview');
        this.onionCanvas = document.getElementById('onionCanvas');
        this.onionCtx = this.onionCanvas.getContext('2d');
        this.cameraSelector = document.getElementById('cameraSelector');
        this.timeline = document.getElementById('timeline');
        this.resolutionSelector = document.getElementById('resolution');
        
        this.init();
    }

    async init() {
        console.log('Initializing Stop Motion Studio...');
        await this.db.open();
        this.setupEventListeners();
        await this.migrateFromLocalStorage();
        await this.loadProject();
        await this.setupCameras();
        this.updateStats();
    }

    async migrateFromLocalStorage() {
        const legacyData = localStorage.getItem('stopmotion_project');
        if (legacyData) {
            try {
                const parsed = JSON.parse(legacyData);
                if (parsed.frames && parsed.frames.length > 0) {
                    console.log('Migrating legacy data to IndexedDB...');
                    for (const frame of parsed.frames) {
                        await this.db.saveFrame(frame);
                    }
                }
                localStorage.removeItem('stopmotion_project');
            } catch (err) {
                console.error('Migration error:', err);
            }
        }
    }

    setupEventListeners() {
        // Camera selection
        this.cameraSelector.onchange = (e) => this.startCamera(e.target.value);
        this.resolutionSelector.onchange = () => this.updateResolution();

        // Capture
        document.getElementById('btn-capture').onclick = () => this.captureFrame();
        
        window.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            // Capture shortcuts (Space, Enter, and most keys)
            if (e.code === 'Space' || e.code === 'Enter' || e.code === 'NumpadEnter' || 
               (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey)) {
                
                if (e.code === 'Space') e.preventDefault();
                this.captureFrame();
            }

            // Playback shortcut
            if (e.code === 'KeyP') {
                this.togglePlayback();
            }

            // Navigation
            if (e.code === 'ArrowLeft') this.prevFrame();
            if (e.code === 'ArrowRight') this.nextFrame();
        });

        // Navigation Buttons
        document.getElementById('btn-prev').onclick = () => this.prevFrame();
        document.getElementById('btn-next').onclick = () => this.nextFrame();

        // Project Buttons
        document.getElementById('btn-project-new').onclick = () => this.clearProject();
        document.getElementById('btn-project-save').onclick = () => {
            // Confirmation as the saving is real-time
            const btn = document.getElementById('btn-project-save');
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-check"></i>';
            btn.style.color = '#4cd964';
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.style.color = '';
            }, 2000);
            console.log('Project state already synced with IndexedDB.');
        };

        // Sliders
        document.getElementById('brightness').oninput = (e) => this.updateFilter('brightness', e.target.value);
        document.getElementById('contrast').oninput = (e) => this.updateFilter('contrast', e.target.value);
        document.getElementById('saturation').oninput = (e) => this.updateFilter('saturation', e.target.value);
        
        document.getElementById('onionOpacity').oninput = (e) => {
            this.onionOpacity = e.target.value / 100;
            document.getElementById('val-onion-opacity').innerText = e.target.value + '%';
            this.renderOnionSkin();
        };

        document.getElementById('onionDepth').onchange = (e) => {
            this.onionDepth = parseInt(e.target.value);
            this.renderOnionSkin();
        };

        // Playback
        document.getElementById('btn-play').onclick = () => this.togglePlayback();
        document.getElementById('playbackFPS').oninput = (e) => {
            this.fps = parseInt(e.target.value);
            document.querySelector('.fps-control .val').innerText = this.fps + ' FPS';
            document.getElementById('hud-fps-val').innerText = this.fps;
            if (this.isPlaying) {
                this.stopPlayback();
                this.startPlayback();
            }
        };

        // Timeline Actions
        document.getElementById('btn-timeline-clear').onclick = () => this.clearProject();

        // Export Modal
        const modal = document.getElementById('export-modal');
        document.getElementById('btn-export-options').onclick = () => modal.classList.add('active');
        document.querySelector('.btn-close-modal').onclick = () => modal.classList.remove('active');
        window.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };

        document.getElementById('export-zip').onclick = () => this.exportZIP();
        document.getElementById('export-video').onclick = () => this.exportVideo();
    }

    async setupCameras() {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(d => d.kind === 'videoinput');
            
            this.cameraSelector.innerHTML = '';
            videoDevices.forEach((device, i) => {
                const opt = document.createElement('option');
                opt.value = device.deviceId;
                opt.text = device.label || `Caméra ${i + 1}`;
                this.cameraSelector.appendChild(opt);
            });

            if (videoDevices.length > 0) {
                await this.startCamera(videoDevices[0].deviceId);
                this.detectMaxResolution();
            }
        } catch (err) {
            console.error('Erreur accès caméras:', err);
        }
    }

    detectMaxResolution() {
        if (!this.stream) return;
        const track = this.stream.getVideoTracks()[0];
        if (track && track.getCapabilities) {
            const caps = track.getCapabilities();
            if (caps.width && caps.height) {
                const maxW = caps.width.max;
                const maxH = caps.height.max;
                
                if (!Array.from(this.resolutionSelector.options).some(o => o.value === 'max')) {
                    const opt = document.createElement('option');
                    opt.value = 'max';
                    opt.text = `Résolution Native (${maxW}x${maxH})`;
                    this.resolutionSelector.insertBefore(opt, this.resolutionSelector.firstChild);
                }
            }
        }
    }

    async startCamera(deviceId) {
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
        }

        const constraints = {
            video: {
                deviceId: deviceId ? { exact: deviceId } : undefined,
                width: { ideal: this.constraints.width },
                height: { ideal: this.constraints.height }
            }
        };

        if (this.resolutionSelector.value === 'max') {
            constraints.video.width = { ideal: 9999 };
            constraints.video.height = { ideal: 9999 };
        }

        try {
            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.video.srcObject = this.stream;
            
            this.video.onloadedmetadata = () => {
                this.onionCanvas.width = this.video.videoWidth;
                this.onionCanvas.height = this.video.videoHeight;
                this.renderOnionSkin();
            };
        } catch (err) {
            console.error('Erreur démarrage caméra:', err);
        }
    }

    updateResolution() {
        if (this.resolutionSelector.value === 'max') {
            this.constraints.width = 9999;
            this.constraints.height = 9999;
        } else {
            const [w, h] = this.resolutionSelector.value.split('x').map(Number);
            this.constraints.width = w;
            this.constraints.height = h;
        }
        this.startCamera(this.cameraSelector.value);
    }

    updateFilter(type, value) {
        const valElem = document.getElementById(`val-${type}`);
        if(valElem) valElem.innerText = value + '%';
        
        const b = document.getElementById('brightness').value / 100;
        const c = document.getElementById('contrast').value / 100;
        const s = document.getElementById('saturation').value / 100;
        this.video.style.filter = `brightness(${b}) contrast(${c}) saturate(${s})`;
    }

    async captureFrame() {
        if (!this.video.videoWidth) return;

        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        const b = document.getElementById('brightness').value / 100;
        const c = document.getElementById('contrast').value / 100;
        const s = document.getElementById('saturation').value / 100;
        ctx.filter = `brightness(${b}) contrast(${c}) saturate(${s})`;
        
        ctx.drawImage(this.video, 0, 0);
        
        const dataUrl = canvas.toDataURL('image/png');
        const frame = {
            id: Date.now(),
            dataUrl: dataUrl
        };

        // Cache the Image object immediately
        const img = new Image();
        img.src = dataUrl;
        this.frameImages.set(frame.id, img);

        this.frames.push(frame);
        this.activeFrameIndex = this.frames.length - 1;
        
        await this.db.saveFrame(frame);
        this.renderTimeline();
        this.renderOnionSkin();
        this.updateStats();

        // Flash effect
        this.video.style.opacity = '0.5';
        setTimeout(() => this.video.style.opacity = '1', 50);
    }

    renderOnionSkin() {
        if (this.isPlaying) return;
        this.onionCtx.clearRect(0, 0, this.onionCanvas.width, this.onionCanvas.height);
        
        if (this.onionDepth === 0 || this.frames.length === 0) return;

        // Use the frame closest to the current end for onion skin
        const startIndex = Math.max(0, this.frames.length - this.onionDepth);
        
        for (let i = startIndex; i < this.frames.length; i++) {
            const frame = this.frames[i];
            const img = this.frameImages.get(frame.id);
            
            if (img && img.complete) {
                const depthPos = (i - startIndex + 1) / this.onionDepth;
                this.onionCtx.globalAlpha = this.onionOpacity * depthPos;
                this.onionCtx.drawImage(img, 0, 0, this.onionCanvas.width, this.onionCanvas.height);
            } else if (img) {
                // If not loaded yet, wait and re-render
                img.onload = () => this.renderOnionSkin();
            }
        }
    }

    renderTimeline() {
        this.timeline.innerHTML = '';
        this.frames.forEach((frame, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item' + (index === this.activeFrameIndex ? ' active' : '');
            item.innerHTML = `
                <img src="${frame.dataUrl}">
                <div class="idx">${index + 1}</div>
                <button class="btn-del" title="Supprimer"><i class="fa-solid fa-trash-can"></i></button>
            `;

            item.onclick = (e) => {
                if (e.target.closest('.btn-del')) {
                    this.deleteFrame(index);
                } else {
                    this.activeFrameIndex = index;
                    this.renderTimeline();
                }
            };

            this.timeline.appendChild(item);
        });

        if (this.activeFrameIndex !== -1) {
            const activeElem = this.timeline.children[this.activeFrameIndex];
            if (activeElem) activeElem.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        } else {
            this.timeline.scrollLeft = this.timeline.scrollWidth;
        }
    }

    async deleteFrame(index) {
        const frame = this.frames[index];
        if (frame) {
            await this.db.deleteFrame(frame.id);
            this.frameImages.delete(frame.id);
            this.frames.splice(index, 1);
            this.activeFrameIndex = Math.min(this.activeFrameIndex, this.frames.length - 1);
            this.renderTimeline();
            this.renderOnionSkin();
            this.updateStats();
        }
    }

    async clearProject() {
        if (confirm('Voulez-vous vraiment supprimer toutes les images ?')) {
            await this.db.clearAll();
            this.frameImages.clear();
            this.frames = [];
            this.activeFrameIndex = -1;
            this.renderTimeline();
            this.renderOnionSkin();
            this.updateStats();
        }
    }

    updateStats() {
        const countElem = document.getElementById('total-frames');
        if (countElem) countElem.innerText = this.frames.length;
    }

    prevFrame() {
        if (this.frames.length === 0) return;
        this.activeFrameIndex = Math.max(0, this.activeFrameIndex - 1);
        this.renderTimeline();
    }

    nextFrame() {
        if (this.frames.length === 0) return;
        this.activeFrameIndex = Math.min(this.frames.length - 1, this.activeFrameIndex + 1);
        this.renderTimeline();
    }

    // Playback Logic
    togglePlayback() {
        if (this.isPlaying) this.stopPlayback();
        else this.startPlayback();
    }

    async startPlayback() {
        if (this.frames.length < 2) return;
        this.isPlaying = true;
        document.getElementById('btn-play').innerHTML = '<i class="fa-solid fa-pause"></i>';
        this.video.style.visibility = 'hidden';
        this.onionCanvas.style.visibility = 'visible';

        let currentIndex = 0;
        const play = () => {
            if (!this.isPlaying) return;
            
            const frame = this.frames[currentIndex];
            const img = this.frameImages.get(frame.id);
            
            if (img) {
                this.onionCtx.clearRect(0, 0, this.onionCanvas.width, this.onionCanvas.height);
                this.onionCtx.globalAlpha = 1.0;
                this.onionCtx.drawImage(img, 0, 0, this.onionCanvas.width, this.onionCanvas.height);
            }
            
            currentIndex = (currentIndex + 1) % this.frames.length;
            this.playbackInterval = setTimeout(play, 1000 / this.fps);
        };

        play();
    }

    stopPlayback() {
        this.isPlaying = false;
        clearTimeout(this.playbackInterval);
        document.getElementById('btn-play').innerHTML = '<i class="fa-solid fa-play"></i>';
        this.video.style.visibility = 'visible';
        this.onionCanvas.style.visibility = 'visible';
        this.renderOnionSkin();
    }

    // Persistence
    async loadProject() {
        this.frames = await this.db.getAllFrames();
        this.frames.sort((a,b) => a.id - b.id);
        
        // Cache images in background
        for (const frame of this.frames) {
            const img = new Image();
            img.src = frame.dataUrl;
            this.frameImages.set(frame.id, img);
        }
        
        this.activeFrameIndex = this.frames.length - 1;
        this.renderTimeline();
        this.renderOnionSkin();
    }

    // Export Logic
    exportZIP() {
        if (this.frames.length === 0) return alert('Aucune image à exporter.');
        const zip = new JSZip();
        this.frames.forEach((f, i) => {
            const b64 = f.dataUrl.split(',')[1];
            zip.file(`frame_${String(i+1).padStart(4, '0')}.png`, b64, {base64: true});
        });
        zip.generateAsync({type: 'blob'}).then(content => {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = 'stopmotion_project.zip';
            a.click();
        });
    }

    async exportVideo() {
        if (this.frames.length === 0) return alert('Aucune image à exporter.');
        
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth || this.constraints.width;
        canvas.height = this.video.videoHeight || this.constraints.height;
        const ctx = canvas.getContext('2d');
        
        const chunks = [];
        const stream = canvas.captureStream(this.fps);
        const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
        
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'stopmotion_export.webm';
            a.click();
            document.getElementById('export-modal').classList.remove('active');
        };

        recorder.start();

        for(let i=0; i < this.frames.length; i++) {
            await new Promise(resolve => {
                const img = this.frameImages.get(this.frames[i].id);
                if (img && img.complete) {
                    ctx.clearRect(0,0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    setTimeout(resolve, 1000 / this.fps);
                } else if (img) {
                    img.onload = () => {
                        ctx.clearRect(0,0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        setTimeout(resolve, 1000 / this.fps);
                    };
                } else {
                    resolve();
                }
            });
        }

        recorder.stop();
    }
}

// Start Application
window.onload = () => {
    window.studio = new StopMotionStudio();
};
