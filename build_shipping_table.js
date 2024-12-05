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
    let currentBracketRecords = [];

    for (const record of sortedData) {
        const weightInGrams = record.weight;
        const weightInPounds = weightInGrams / 453.592;

        // Check if the record is within the current weight bracket
        if (weightInGrams <= previousWeightGrams + weightInterval) {
            currentBracketRecords.push(record);
        } else {
            // Process the current bracket
            if (currentBracketRecords.length > 0) {
                const highestRecord = currentBracketRecords[currentBracketRecords.length - 1];
                const highestRate = parseFloat(highestRecord[selectedKey]) || 0;
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

                // Update for the next bracket
                previousWeightPounds += intervalInPounds + 0.0001; // Increment pounds
                previousWeightGrams += weightInterval; // Increment grams
                currentBracketRecords = [record]; // Start a new bracket
            }
        }
    }

    // Handle the last bracket if any records remain
    if (currentBracketRecords.length > 0) {
        const highestRecord = currentBracketRecords[currentBracketRecords.length - 1];
        const highestRate = parseFloat(highestRecord[selectedKey]) || 0;
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
    }
}

export default buildShippingDataTable;
