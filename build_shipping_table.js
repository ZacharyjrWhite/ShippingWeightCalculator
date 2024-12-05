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

    let previousWeightPounds = 0; // Starting weight in pounds
    let previousWeightGrams = 0; // Start from 0g to ensure 0-50g is handled
    let currentBracketRecords = [];

    // Handle the 0–50g bucket explicitly
    let highestRate = 0;
    while (sortedData.length > 0 && sortedData[0].weight <= 50) {
        const record = sortedData.shift();
        const rate = parseFloat(record[selectedKey]) || 0;
        highestRate = Math.max(highestRate, rate);
    }

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
        ? ` (${previousWeightGrams.toFixed(2)} g to ${(previousWeightGrams + 50).toFixed(2)} g)`
        : '';

    // Create table row for 0–50g
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${previousWeightPounds.toFixed(4)} lbs${gramsDisplay}</td>
        <td>${(50 / 453.592).toFixed(4)} lbs</td>
        <td>$${rate.toFixed(2)}</td>
        <td>$${highestRate.toFixed(2)}</td>
        <td>$${Number(rate - highestRate).toFixed(2)}</td>
    `;
    tableBody.appendChild(row);

    // Update for the next bracket
    previousWeightPounds = 50 / 453.592; // Move to 50g in pounds
    previousWeightGrams = 50;

    // Process remaining data in brackets
    while (previousWeightGrams <= Math.max(...data.map(d => d.weight), previousWeightGrams)) {
        highestRate = 0;
        while (
            currentBracketRecords.length === 0 ||
            (sortedData.length > 0 && sortedData[0].weight <= previousWeightGrams + weightInterval)
        ) {
            const record = sortedData.shift();
            if (!record) break;

            const rate = parseFloat(record[selectedKey]) || 0;
            highestRate = Math.max(highestRate, rate);
        }

        rate = highestRate + upChargeInput;

        // Apply rounding if the roundUp checkbox is checked
        if (roundUpCheckbox.checked) {
            const decimalPart = rate - Math.floor(rate); // Get the fractional part
            if (decimalPart <= 0.49) {
                rate = Math.floor(rate) + 0.49; // Round up to .49
            } else {
                rate = Math.floor(rate) + 0.99; // Round up to .99
            }
        }

        const gramsDisplay = showGramsCheckbox.checked
            ? ` (${previousWeightGrams.toFixed(2)} g to ${(previousWeightGrams + weightInterval).toFixed(2)} g)`
            : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${previousWeightPounds.toFixed(4)} lbs${gramsDisplay}</td>
            <td>${(previousWeightPounds + intervalInPounds).toFixed(4)} lbs</td>
            <td>$${rate.toFixed(2)}</td>
            <td>$${highestRate.toFixed(2)}</td>
            <td>$${Number(rate - highestRate).toFixed(2)}</td>
        `;

        tableBody.appendChild(row);

        // Update for the next bracket
        previousWeightGrams += weightInterval;
        previousWeightPounds += intervalInPounds;
    }
}

export default buildShippingDataTable;
