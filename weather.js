/**
 * Task 4 - Asynchronous Processing & API State Control Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const statusAnnouncer = document.getElementById('status-announcer');
    const errorDisplay = document.getElementById('error-display');
    const weatherDisplay = document.getElementById('weather-display');

    // UI Nodes targets for complex JSON mappings
    const locationOutput = document.getElementById('location-output');
    const conditionOutput = document.getElementById('condition-output');
    const tempOutput = document.getElementById('temp-output');
    const humidityOutput = document.getElementById('humidity-output');
    const windOutput = document.getElementById('wind-output');

    // Form submission processing pipeline
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = cityInput.value.trim();
        if (!city) return;

        await fetchWeatherData(city);
    });

    /**
     * Executes network fetch calls to the REST endpoint using async/await
     * @param {string} targetLocation
     */
    async function fetchWeatherData(targetLocation) {
        // Clear layout boundaries before processing states
        hideInterfaceElements();
        statusAnnouncer.textContent = `Initiating transaction for location data mapping: ${targetLocation}...`;

        // Encode query strings safely to handle locations with white spaces
        const endpoint = `https://wttr.in/${encodeURIComponent(targetLocation)}?format=j1`;

        try {
            const response = await fetch(endpoint);

            // Verify HTTP status flags explicitly (Catches 404, 500, etc.)
            if (!response.ok) {
                throw new Error(`Server returned communication failure flag: ${response.status}`);
            }

            // Await parsing complex JSON dataset responses
            const dataset = await response.json();
            
            // Execute validation checks on nested payload components
            if (!dataset.current_condition || dataset.current_condition.length === 0) {
                throw new Error("Target location structure not matched by remote registry indices.");
            }

            // Send clean payload over to UI mutators
            updateDisplayUI(dataset, targetLocation);

        } catch (networkError) {
            // Process error state bounds gracefully
            console.error("Asynchronous Request Intercept Failure:", networkError);
            displayErrorFeedback(networkError.message || "Network execution exception encountered.");
        }
    }

    /**
     * Parses nested target object pathways inside the payload structure
     * @param {Object} data 
     * @param {string} fallbackName
     */
    function updateDisplayUI(data, fallbackName) {
        // Destructure complex nested fields out from API response
        const currentData = data.current_condition[0];
        const areaData = data.nearest_area ? data.nearest_area[0] : null;

        // Extract localized properties smoothly
        const temperature = currentData.temp_C;
        const humidity = currentData.humidity;
        const windSpeed = currentData.windspeedKmph;
        const description = currentData.weatherDesc && currentData.weatherDesc[0] 
            ? currentData.weatherDesc[0].value 
            : "Unknown Status Pattern";

        // Calculate name outputs using geographic payload mappings if available
        let locationName = fallbackName;
        if (areaData && areaData.areaName && areaData.areaName[0]) {
            const cityValue = areaData.areaName[0].value;
            const countryValue = areaData.country && areaData.country[0] ? areaData.country[0].value : "";
            locationName = countryValue ? `${cityValue}, ${countryValue}` : cityValue;
        }

        // Apply mutations directly into current UI text contents safely
        locationOutput.textContent = locationName;
        conditionOutput.textContent = description;
        tempOutput.textContent = `${temperature}°C`;
        humidityOutput.textContent = `${humidity}%`;
        windOutput.textContent = `${windSpeed} km/h`;

        // Render targets visible to user focus routes
        weatherDisplay.classList.remove('hidden');
        statusAnnouncer.textContent = `Weather statistics updated successfully for location: ${locationName}`;
    }

    function displayErrorFeedback(errorMessage) {
        let structuralMessage = errorMessage;
        
        // Translate system failure signatures into readable diagnostic hints
        if (errorMessage.includes("Failed to fetch")) {
            structuralMessage = "Unable to reach the remote weather API. Check your internet connection configuration.";
        } else if (errorMessage.includes("registry indices")) {
            structuralMessage = "The city location you searched could not be found. Check your spelling and try again.";
        }

        errorDisplay.textContent = `Request Exception: ${structuralMessage}`;
        errorDisplay.classList.remove('hidden');
        statusAnnouncer.textContent = `Error encountered: ${structuralMessage}`;
    }

    function hideInterfaceElements() {
        errorDisplay.classList.add('hidden');
        weatherDisplay.classList.add('hidden');
    }
});