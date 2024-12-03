import buildSearchableInput from './dropdown.js';
import exportTableToCSV from './export_csv.js';
import sendQuoteRequest from './send_request.js';


document.addEventListener('DOMContentLoaded', () => {
    buildSearchableInput();

    const exportButton = document.querySelector('.btn-primary');
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }

    const countryInput = document.getElementById('country');
    const refreshButton = document.getElementById('refreshBtn');

    // Send request on dropdown change
    countryInput.addEventListener('change', sendQuoteRequest);

    // Resend request on refresh button click
    refreshButton.addEventListener('click', sendQuoteRequest);
});