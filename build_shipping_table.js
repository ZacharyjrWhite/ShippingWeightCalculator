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
    let previousWeightGrams = 0; // Starting weight in grams
    for (const record of sortedData) {
        const weightInPounds = record.weight / 453.592; // Convert grams to pounds

        // Calculate the range
        const fromPounds = previousWeightPounds.toFixed(4);
        const toPounds = (previousWeightPounds + intervalInPounds).toFixed(4);

        const fromGrams = previousWeightGrams.toFixed(2);
        const toGrams = (previousWeightGrams + weightInterval).toFixed(2);

        // Get the rate dynamically based on the selected shipping line key
        const upChargeInput = parseFloat(document.getElementById('profitAddition').value.replace('$', '')) || 0;
        const baseRate = parseFloat(record[selectedKey]) || 0;
        let rate = baseRate + upChargeInput;

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
            ? ` (${fromGrams} g to ${toGrams} g)`
            : '';

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${fromPounds} ${gramsDisplay}</td>
            <td>${toPounds} </td>
            <td>${rate.toFixed(2)}</td>
            <td>${baseRate.toFixed(2)}</td>
            <td>${Number(rate - baseRate).toFixed(2)}</td>
        `;

        // Append row to the table body
        tableBody.appendChild(row);

        // Update the previous weight for the next range
        previousWeightPounds += intervalInPounds + 0.0001; // Increment pounds
        previousWeightGrams += weightInterval; // Increment grams
    }
}

export default buildShippingDataTable;
