function buildShippingDataTable(data, weightInterval) {
    const tableBody = document.querySelector('.shipping_data tbody');
    const shippingLineDropdown = document.getElementById('shippingLine');

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

    let previousWeight = 0; // Starting weight in pounds
    for (const record of sortedData) {
        const weightInPounds = record.weight / 453.592; // Convert grams to pounds

        // Calculate the range
        const from = previousWeight.toFixed(4);
        const to = (previousWeight + intervalInPounds).toFixed(4);

        // Get the rate dynamically based on the selected shipping line key
        const rate = record[selectedKey] ? `$${record[selectedKey].toFixed(2)}` : 'N/A';

        // Create table row
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${from} lbs</td>
            <td>${to} lbs</td>
            <td>${rate}</td>
        `;

        // Append row to the table body
        tableBody.appendChild(row);

        // Update the previous weight for the next range
        previousWeight += intervalInPounds;
    }
}

export default buildShippingDataTable;
