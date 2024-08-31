function filterFiles() {
    const nameFilter = document.getElementById('name-filter').value;
    const dateFilter = document.getElementById('date-filter').value.replace(/-/g, '');

    const fileList = document.getElementById('file-list');
    const files = Array.from(fileList.getElementsByTagName('li'));

    files.forEach(file => {
        const fileName = file.getAttribute('data-fullname');
        const fileDate = file.getAttribute('data-date');

        let show = true;

        if (nameFilter && fileName !== nameFilter) {
            show = false;
        }

        if (dateFilter && fileDate !== dateFilter) {
            show = false;
        }

        if (show) {
            file.style.display = '';
        } else {
            file.style.display = 'none';
        }
    });
}
