import buildSearchableInput from './dropdown.js';
import exportTableToCSV from './export_csv.js';
import sendQuoteRequest from './send_request.js';
import buildShippingDataTable from './build_shipping_table.js';
import COUNTRY_CODES from './country_codes.js';

let globalApiResponseData = null; // Store API response globally

document.addEventListener('DOMContentLoaded', () => {
    buildSearchableInput();

    const exportButton = document.querySelector('.csvDownload');
    const countryInput = document.getElementById('country');
    const refreshButton = document.getElementById('refreshBtn');
    const weightIntervalDropdown = document.getElementById('weightInterval');

    // Set dropdown to first value on page load
    if (COUNTRY_CODES.length > 0) {
        countryInput.value = COUNTRY_CODES[0].label; // Set the input to the first country's label
        sendQuoteRequest().then(response => {
            globalApiResponseData = response?.data || [];
            const weightInterval = parseInt(weightIntervalDropdown.value, 10); // Get initial interval
            buildShippingDataTable(globalApiResponseData, weightInterval); // Build the initial table
        });
    }

    // Trigger table rebuild on weight interval change
    weightIntervalDropdown.addEventListener('change', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10); // Get new interval
            buildShippingDataTable(globalApiResponseData, weightInterval); // Rebuild table
        }
    });

    // Send request on dropdown change
    countryInput.addEventListener('change', () => {
        sendQuoteRequest().then(response => {
            globalApiResponseData = response?.data || [];
            const weightInterval = parseInt(weightIntervalDropdown.value, 10); // Get current interval
            buildShippingDataTable(globalApiResponseData, weightInterval); // Rebuild table
        });
    });

    // Resend request on refresh button click
    refreshButton.addEventListener('click', () => {
        sendQuoteRequest().then(response => {
            globalApiResponseData = response?.data || [];
            const weightInterval = parseInt(weightIntervalDropdown.value, 10); // Get current interval
            buildShippingDataTable(globalApiResponseData, weightInterval); // Rebuild table
        });
    });

    // Export table data to CSV
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }
});
