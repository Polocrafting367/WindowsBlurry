const timeline = document.getElementById('viewerTimeline');

const savedPhotos = JSON.parse(localStorage.getItem('savedPhotos')) || [];

savedPhotos.forEach((photo) => {
    const img = document.createElement('img');
    img.src = photo;
    timeline.appendChild(img);
});
