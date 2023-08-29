const apiKey = 'pk.eyJ1Ijoib2FreWRvYWt5MTIzIiwiYSI6ImNsbHE4YmxmbzAxcmIzZnBoa3FqejRhbDcifQ.1Q8k7W65Bt7jtZtJnQzFxQ';

const mymap = L.map('map').setView([-33.8688, 151.2093], 6);

document.addEventListener('DOMContentLoaded', function () {
    // Your code here
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/satellite-streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: apiKey
}).addTo(mymap);

// Read and process CSV data
Papa.parse('database.csv', {
    download: true,
    header: true,
    complete: function(results) {
        const incidents = results.data;

        const iconOptions = {
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        };

        const markers = [];

        incidents.forEach(incident => {
            const { latitude, longitude, VictimInjury, IncidentYear, Day, Month, State, Location, SharkType, SharkLength, Provoked, SharkCount, VictimActivity, InjuryLocation, InjurySeverity, VictimGender, VictimAge } = incident;

            let iconUrl;
            if (VictimInjury === 'Fatal') {
                iconUrl = 'fatal.svg';
            } else if (VictimInjury === 'Injured') {
                iconUrl = 'injured.svg';
            } else {
                iconUrl = 'uninjured.svg';
            }

            const customIcon = L.icon({
                iconUrl: iconUrl,
                ...iconOptions,
                
            });

            const marker = L.marker([parseFloat(latitude), parseFloat(longitude)], { icon: customIcon }).addTo(mymap);
            
            // Construct the popup content with available data points
            const popupContent = `
                <h4>Status: ${VictimInjury || ''}${Day && Month && IncidentYear ? ` - ${Day}/${Month}/${IncidentYear}</h4>` : ''}
                ${Location ? `<p>Location: ${Location}, ${State}</p>` : ''}
                ${SharkType ? `<p>Shark Type: ${SharkType}</p>` : ''}
                ${SharkLength ? `<p>Shark Length: ${SharkLength}</p>` : ''}
                ${Provoked ? `<p>Provocation: ${Provoked}</p>` : ''}
                ${SharkCount ? `<p>Shark Count: ${SharkCount}</p>` : ''}
                ${VictimActivity ? `<p>Victim Activity: ${VictimActivity}</p>` : ''}
                ${InjuryLocation ? `<p>Injury Location: ${InjuryLocation}</p>` : ''}
                ${InjurySeverity ? `<p>Injury Severity: ${InjurySeverity}</p>` : ''}
                ${VictimGender ? `<p>Victim Details: ${VictimGender}${VictimAge ? ', ' + VictimAge : ''}</p>` : ''}
            `;

            marker.bindPopup(popupContent).on('mouseover', function () {
                marker.openPopup();
            });
            

            marker.VictimInjury = VictimInjury; // Store the VictimInjury type in the marker

            markers.push(marker); // Store the marker in the array
        });

 // Select the checkboxes
 const FatalCheckbox = document.getElementById('FatalCheckbox');
 const InjuredCheckbox = document.getElementById('InjuredCheckbox');
 const UninjuredCheckbox = document.getElementById('UninjuredCheckbox');

// Function to update marker visibility based on checkbox states
function updateMarkersVisibility() {
    markers.forEach(marker => {
        const isVisible = (marker.VictimInjury === 'Fatal' && FatalCheckbox.checked) ||
                          (marker.VictimInjury === 'Injured' && InjuredCheckbox.checked) ||
                          (marker.VictimInjury === 'Uninjured' && UninjuredCheckbox.checked);

        // Adjust opacity to make markers visually invisible, and set pointer events to 'none' to prevent interaction
        marker.setOpacity(isVisible ? 1 : 0);
        marker.getElement().style.pointerEvents = isVisible ? 'auto' : 'none';
        console.log(`Marker: ${marker.VictimInjury}, IsVisible: ${isVisible}`);
    });
}


 // Event listeners for checkbox changes
 FatalCheckbox.addEventListener('change', updateMarkersVisibility);
 InjuredCheckbox.addEventListener('change', updateMarkersVisibility);
 UninjuredCheckbox.addEventListener('change', updateMarkersVisibility);

 // Initially update marker visibility based on checkbox states
 updateMarkersVisibility();

    }
});
