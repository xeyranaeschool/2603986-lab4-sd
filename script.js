document.getElementById('search-btn').addEventListener('click', async () => {
    const countryName = document.getElementById('country-input').value.trim();
    if (!countryName) return;

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found!');
        
        const data = await response.json();
        const country = data[0];

        displayCountryInfo(country);
        
        if (country.borders) {
            displayBorderingCountries(country.borders);
        } else {
            document.getElementById('bordering-countries').innerHTML = 'No bordering countries.';
        }
    } catch (error) {
        showError(error.message);
    }
});

function displayCountryInfo(country) {
    const countryInfo = document.getElementById('country-info');
    countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p>Capital: ${country.capital?.[0] || 'N/A'}</p>
        <p>Population: ${country.population.toLocaleString()}</p>
        <p>Region: ${country.region}</p>
        <p>Flag:</p>
        <img src="${country.flags.png}" alt="${country.name.common} Flag" width="100">
    `;
}

async function displayBorderingCountries(borders) {
    const borderingSection = document.getElementById('bordering-countries');
    borderingSection.innerHTML = '<h3>Bordering Countries:</h3>';

    for (const code of borders) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
            const data = await response.json();
            const neighbor = data[0];
            
            const neighborDiv = document.createElement('div');
            neighborDiv.className = 'country-card';
            neighborDiv.innerHTML = `
                <p>${neighbor.name.common}</p>
                <img src="${neighbor.flags.png}" alt="${neighbor.name.common} Flag" width="50">
            `;
            borderingSection.appendChild(neighborDiv);
        } catch (error) {
            console.error('Error fetching neighboring country:', error);
        }
    }
}

function showError(message) {
    const countryInfo = document.getElementById('country-info');
    countryInfo.innerHTML = `<p class="error">${message}</p>`;
    document.getElementById('bordering-countries').innerHTML = '';
}