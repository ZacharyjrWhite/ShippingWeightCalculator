function buildShippingDataTable(data, weightInterval) {
    const tableBody = document.querySelector('.shipping_data tbody');
    const shippingLineDropdown = document.getElementById('shippingLine');
    const roundUpCheckbox = document.getElementById('roundUp');
    const showGramsCheckbox = document.getElementById('showGrams');

    if (!tableBody) {
        console.error("Shipping data table body not found.");
        return;
    }

    if (!shippingLineDropdown) {
        console.error("Shipping Line dropdown (#shippingLine) not found.");
        return;
    }

    // Get the selected key from the #shippingLine dropdown
    const selectedKey = shippingLineDropdown.value;

    // Clear existing table rows
    tableBody.innerHTML = '';

    // Convert weightInterval from grams to pounds
    const intervalInPounds = weightInterval / 453.592; // 1 lb = 453.592 grams

    // Sort data by weight (just in case the response isn't sorted)
    const sortedData = data.sort((a, b) => a.weight - b.weight);

    let previousWeightGrams = 0; // Start from 0g
    let previousWeightPounds = 0; // Start from 0 lbs
    let dataIndex = 0;

    // Process data in weight brackets
    const maxWeight = Math.max(...data.map(d => d.weight), 0); // Maximum weight in the data
    while (previousWeightGrams <= maxWeight || dataIndex < sortedData.length) {
        // Find the highest rate in the current bracket
        let highestRate = 0;
        let lastRecord = null; // Track the last record processed in this bracket
        while (
            dataIndex < sortedData.length &&
            sortedData[dataIndex].weight <= previousWeightGrams + weightInterval
        ) {
            const record = sortedData[dataIndex];
            const rate = parseFloat(record[selectedKey]) || 0;
            highestRate = Math.max(highestRate, rate);
            lastRecord = record; // Keep track of the last record
            dataIndex++;
        }

        // Calculate the final rate with the upcharge
        const upChargeInput = parseFloat(document.getElementById('profitAddition').value.replace('$', '')) || 0;
        let rate = highestRate + upChargeInput;

        // Get countryCode from the last record processed, or skip if no records in this bracket
        if (!lastRecord || !lastRecord.countryCode) {
            // Move to the next bracket if no valid record found
            previousWeightGrams += weightInterval;
            previousWeightPounds = previousWeightGrams / 453.592;
            continue;
        }
        
        let countryCode = lastRecord.countryCode;

        // Apply rounding if the roundUp checkbox is checked
        if (roundUpCheckbox.checked) {
            const decimalPart = rate - Math.floor(rate); // Get the fractional part
            if (decimalPart <= 0.49) {
                rate = Math.floor(rate) + 0.49; // Round up to .49
                highestRate = Math.floor(highestRate) + 0.49; // Round up to .49
            } else {
                rate = Math.floor(rate) + 0.99; // Round up to .99
                highestRate = Math.floor(highestRate) + 0.99; // Round up to .99
            }
        }

        // Determine whether to show grams based on the checkbox
        const gramsDisplay = showGramsCheckbox.checked
            ? ` (${previousWeightGrams.toFixed(2)} g to ${(previousWeightGrams + weightInterval).toFixed(2)} g)`
            : '';

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="display: none;">Standard Shipping</td>
            <td style="display: none;"></td>
            <td style="display: none;">Once your order ships it will be delivered within 7-15 business days. *Please note, delivery to certain regions may require 10-30 business days.</td>
            <td style="display: none;">${countryCode}</td>
            <td style="display: none;"></td>
            <td style="display: none;"></td>
            <td style="display: none;"></td>

            <td>${previousWeightPounds.toFixed(4)}</td>
            <td>${(previousWeightPounds + intervalInPounds).toFixed(4)}</td>

            <td style="display: none;"></td>
            <td style="display: none;"></td>
            <td style="display: none;"></td>
            <td style="display: none;"></td>

            <td>${highestRate.toFixed(2)}</td>

            <td style="display: none;"></td>
            <td style="display: none;"></td>
            <td style="display: none;">y</td>
            <td style="display: none;"></td>
        `;

        // Append row to the table body
        tableBody.appendChild(row);

        // Move to the next bracket
        previousWeightGrams += weightInterval; // Increment grams by weight interval
        previousWeightPounds = previousWeightGrams / 453.592; // Recalculate pounds
    }
}

export default buildShippingDataTable;
