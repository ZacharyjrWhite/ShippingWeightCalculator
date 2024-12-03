import buildSearchableInput from './dropdown.js';
import exportTableToCSV from './export_csv.js';
import sendQuoteRequest from './send_request.js';
import COUNTRY_CODES from './country_codes.js';


document.addEventListener('DOMContentLoaded', () => {
    buildSearchableInput();

    const exportButton = document.querySelector('.csvDownload');
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }

    const countryInput = document.getElementById('country');
    const refreshButton = document.getElementById('refreshBtn');

    // Set dropdown to first value on page load
    if (COUNTRY_CODES.length > 0) {
        countryInput.value = COUNTRY_CODES[0].label; // Set the input to the first country's label
        sendQuoteRequest(); // Send initial API request with the first value
    }

    // Send request on dropdown change
    countryInput.addEventListener('change', sendQuoteRequest);

    // Resend request on refresh button click
    refreshButton.addEventListener('click', sendQuoteRequest);
});