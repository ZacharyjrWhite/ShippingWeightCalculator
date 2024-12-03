import COUNTRY_CODES from './country_codes.js';

async function sendQuoteRequest() {
    const countryInput = document.getElementById('country');
    const countryCode = COUNTRY_CODES.find(
        country => country.label === countryInput.value
    )?.value;

    if (!countryCode) {
        console.error('Invalid country code or no country selected.');
        alert('Please select a valid country.');
        return;
    }

    const url = "https://erp.ecommopsdev.com/nxt/quotePreview/data";
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "origin": "https://erp.ecommopsdev.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://erp.ecommopsdev.com/nxt/quotePreview/page?clientMid=7d59185c-b629-4885-a5bc-df1296789d86",
        "sec-ch-ua": `"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"`,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": `"Windows"`,
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
    };
    const payload = {
        countryCode,
        clientMid: "7d59185c-b629-4885-a5bc-df1296789d86",
        pageNum: 1,
        pageSize: 2000
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log("Response Data:", data);

        // Populate the shippingLine dropdown
        populateShippingLineDropdown(data.columns);

        alert("Request Successful! Shipping Line dropdown updated.");
    } catch (error) {
        console.error("Error sending request:", error);
        alert("Request failed. Check console for details.");
    }
}

function populateShippingLineDropdown(columns) {
    const shippingLineSelect = document.getElementById('shippingLine');
    if (!shippingLineSelect) {
        console.error("Shipping Line dropdown (#shippingLine) not found in the DOM.");
        return;
    }

    // Clear existing options
    shippingLineSelect.innerHTML = '';

    // Add new options from API response
    columns.forEach(column => {
        const option = document.createElement('option');
        option.textContent = column.title; // Set the visible text
        option.value = column.field; // Set the underlying value
        shippingLineSelect.appendChild(option);
    });
}

export default sendQuoteRequest;
