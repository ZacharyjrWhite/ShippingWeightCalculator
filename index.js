import buildSearchableInput from './dropdown.js';
import exportTableToCSV from './export_csv.js';
import sendQuoteRequest from './send_request.js';
import buildShippingDataTable from './build_shipping_table.js';
import COUNTRY_CODES from './country_codes.js';

let globalApiResponseData = null; // Store API response globally

document.addEventListener('DOMContentLoaded', async () => {
    buildSearchableInput();

    const exportButton = document.querySelector('.csvDownload');
    const countryInput = document.getElementById('country');
    const refreshButton = document.getElementById('refreshBtn');
    const weightIntervalDropdown = document.getElementById('weightInterval');
    const shippingLineDropdown = document.getElementById('shippingLine');
    const roundUpCheckbox = document.getElementById('roundUp');
    const profitAdditionInput = document.getElementById('profitAddition');

    // Helper function to fetch data and build table
    const fetchAndBuildTable = async () => {
        const response = await sendQuoteRequest();
        if (response) {
            globalApiResponseData = response.data || [];
            const weightInterval = parseInt(weightIntervalDropdown.value, 10); // Get current interval
            buildShippingDataTable(globalApiResponseData, weightInterval); // Build table
        } else {
            console.error('Failed to fetch data from the API.');
        }
    };

    // Set dropdown to first value on page load
    if (COUNTRY_CODES.length > 0) {
        countryInput.value = COUNTRY_CODES[0].label; // Set the input to the first country's label
        await fetchAndBuildTable(); // Fetch data and build table
    }

    // Recalculate table on weight interval change
    weightIntervalDropdown.addEventListener('change', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10);
            buildShippingDataTable(globalApiResponseData, weightInterval);
        }
    });

    // Recalculate table on shipping line change
    shippingLineDropdown.addEventListener('change', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10);
            buildShippingDataTable(globalApiResponseData, weightInterval);
        }
    });

    // Recalculate table on roundUp checkbox toggle
    roundUpCheckbox.addEventListener('change', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10);
            buildShippingDataTable(globalApiResponseData, weightInterval);
        }
    });

    // Recalculate table on profitAddition input change
    profitAdditionInput.addEventListener('input', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10);
            buildShippingDataTable(globalApiResponseData, weightInterval);
        }
    });

    const showGramsCheckbox = document.getElementById('showGrams');
    showGramsCheckbox.addEventListener('change', () => {
        if (globalApiResponseData) {
            const weightInterval = parseInt(weightIntervalDropdown.value, 10);
            buildShippingDataTable(globalApiResponseData, weightInterval);
        }
    });
    
    // Send request on country change
    countryInput.addEventListener('change', fetchAndBuildTable);

    // Resend request on refresh button click
    refreshButton.addEventListener('click', fetchAndBuildTable);

    // Export table data to CSV
    if (exportButton) {
        exportButton.addEventListener('click', exportTableToCSV);
    }
});
