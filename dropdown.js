import { COUNTRY_CODES } from './country_codes.js';

function buildSearchableInput() {
    const countryInput = document.getElementById('country');
    const countryList = document.getElementById('countryList');

    if (!countryInput || !countryList) {
        console.error("Elements with ID 'country' or 'countryList' not found in the DOM.");
        return;
    }

    // Function to populate the dropdown with all countries initially
    function populateDropdown() {
        countryList.innerHTML = '';
        COUNTRY_CODES.forEach(country => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action bg-dark text-light';
            li.textContent = country.label;
            li.dataset.value = country.value;

            li.addEventListener('click', () => {
                countryInput.value = country.label;
                countryList.classList.add('d-none');
            });

            countryList.appendChild(li);
        });
        countryList.classList.remove('d-none');
    }

    // Function to update dropdown based on search input
    function updateDropdown(searchTerm) {
        countryList.innerHTML = '';
        countryList.classList.add('d-none');

        if (searchTerm.trim() === '') {
            populateDropdown();
            return;
        }

        const filteredCountries = COUNTRY_CODES.filter(country =>
            country.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filteredCountries.forEach(country => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action bg-dark text-light';
            li.textContent = country.label;
            li.dataset.value = country.value;

            li.addEventListener('click', () => {
                countryInput.value = country.label;
                countryList.classList.add('d-none');
            });

            countryList.appendChild(li);
        });

        if (filteredCountries.length > 0) {
            countryList.classList.remove('d-none');
        }
    }

    // Populate dropdown with all countries on focus
    countryInput.addEventListener('focus', () => {
        populateDropdown();
    });

    // Update dropdown as user types
    countryInput.addEventListener('input', (e) => {
        updateDropdown(e.target.value);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!countryInput.contains(e.target) && !countryList.contains(e.target)) {
            countryList.classList.add('d-none');
        }
    });
}

export default buildSearchableInput;