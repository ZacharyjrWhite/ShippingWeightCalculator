// Function to build a searchable input
function buildSearchableInput(countries) {
    const countryInput = document.getElementById('country');
    const countryList = document.getElementById('countryList');

    // Function to update dropdown based on input
    function updateDropdown(searchTerm) {
        // Clear previous options
        countryList.innerHTML = '';
        countryList.classList.add('d-none');

        if (searchTerm.trim() === '') return;

        const filteredCountries = countries.filter(country =>
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

    // Event listener for input
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