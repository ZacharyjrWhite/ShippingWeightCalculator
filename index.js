import buildSearchableInput from './dropdown.js';
import exportTableToCSV from './export_csv.js';

document.addEventListener('DOMContentLoaded', () => {
    buildSearchableInput();

    const exportButton = document.querySelector('.btn-primary');
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }
});