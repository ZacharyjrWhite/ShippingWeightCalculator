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
    while (previousWeightGrams <= Math.max(...data.map(d => d.weight), previousWeightGrams)) {
        // Find the highest rate in the current weight bracket
        let highestRate = 0;
        while (
            dataIndex < sortedData.length &&
            sortedData[dataIndex].weight <= previousWeightGrams + weightInterval
        ) {
            const record = sortedData[dataIndex];
            const rate = parseFloat(record[selectedKey]) || 0;
            highestRate = Math.max(highestRate, rate);
            dataIndex++;
        }

        // Calculate the final rate with the upcharge
        const upChargeInput = parseFloat(document.getElementById('profitAddition').value.replace('$', '')) || 0;
        let rate = highestRate + upChargeInput;

        // Apply rounding if the roundUp checkbox is checked
        if (roundUpCheckbox.checked) {
            const decimalPart = rate - Math.floor(rate); // Get the fractional part
            if (decimalPart <= 0.49) {
                rate = Math.floor(rate) + 0.49; // Round up to .49
            } else {
                rate = Math.floor(rate) + 0.99; // Round up to .99
            }
        }

        // Determine whether to show grams based on the checkbox
        const gramsDisplay = showGramsCheckbox.checked
            ? ` (${previousWeightGrams.toFixed(2)} g to ${(previousWeightGrams + weightInterval).toFixed(2)} g)`
            : '';

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${previousWeightPounds.toFixed(4)} lbs${gramsDisplay}</td>
            <td>${(previousWeightPounds + intervalInPounds).toFixed(4)} lbs</td>
            <td>$${rate.toFixed(2)}</td>
            <td>$${highestRate.toFixed(2)}</td>
            <td>$${Number(rate - highestRate).toFixed(2)}</td>
        `;

        // Append row to the table body
        tableBody.appendChild(row);

        // Increment weight range for the next bracket
        previousWeightGrams += weightInterval;
        previousWeightPounds = previousWeightGrams / 453.592;
    }
}

export default buildShippingDataTable;
