/**
 * CareTrack Frontend Telemetry & Monitoring Application
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        parentName: '',
        parentPhone: '',
        caregiverPhone: '',
        map: null,
        marker: null,
        // Default simulated location coordinates
        currentCoords: [37.2707, -76.7075], 
        isRadioActive: true
    };

    // --- DOM Elements ---
    const onboardingSection = document.getElementById('onboarding-section');
    const dashboardSection = document.getElementById('dashboard-section');
    const onboardingForm = document.getElementById('onboarding-form');
    
    const displayParentName = document.getElementById('display-parent-name');
    const displayPhoneNumber = document.getElementById('display-phone-number');
    const radioStatus = document.getElementById('radio-status');
    const radioAlertBanner = document.getElementById('radio-alert-banner');
    const statusBadge = document.getElementById('status-badge');
    
    const recenterBtn = document.getElementById('recenter-btn');
    const callParentBtn = document.getElementById('call-parent-btn');
    const dispatchHelpBtn = document.getElementById('dispatch-help-btn');

    // --- 1. Form Submission & Profile Setup ---
    onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Capture user input
        state.parentName = document.getElementById('parent-name').value;
        state.parentPhone = document.getElementById('parent-phone').value;
        state.caregiverPhone = document.getElementById('caregiver-phone').value;

        // Transition Views
        onboardingSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');

        // Populate Dashboard Profile Info
        displayParentName.textContent = state.parentName;
        displayPhoneNumber.textContent = state.parentPhone;

        // Initialize Map
        initMap(state.currentCoords);

        // Start Radio/Telemetry Simulation
        startTelemetrySimulation();
    });

    // --- 2. Map Initialization (Leaflet.js) ---
    function initMap(coords) {
        if (state.map) return; // Prevent re-initialization

        // Create Map View
        state.map = L.map('map-container').setView(coords, 16);

        // Load OpenStreetMap Tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(state.map);

        // Custom Icon for Parent Location
        const personIcon = L.divIcon({
            className: 'custom-map-pin',
            html: `<div style="background-color: #1a56db; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        // Add Marker
        state.marker = L.marker(coords, { icon: personIcon }).addTo(state.map)
            .bindPopup(`<b>${state.parentName}</b><br>Live Telemetry Beacon`)
            .openPopup();
    }

    // --- 3. Interactive Controls ---
    recenterBtn.addEventListener('click', () => {
        if (state.map) {
            state.map.panTo(state.currentCoords);
        }
    });

    callParentBtn.addEventListener('click', () => {
        if (state.parentPhone) {
            window.location.href = `tel:${state.parentPhone}`;
        } else {
            alert('No phone number registered.');
        }
    });

    dispatchHelpBtn.addEventListener('click', () => {
        const confirmDispatch = confirm(`Are you sure you want to trigger emergency assistance for ${state.parentName}? Current coordinates will be sent to local emergency contacts.`);
        if (confirmDispatch) {
            alert(`Emergency dispatch signal sent. Coordinate Broadcast: ${state.currentCoords.join(', ')}`);
        }
    });

    // --- 4. Simulated Radio Telemetry (Simulating iPhone Radio Off Scenario) ---
    function startTelemetrySimulation() {
        // Toggle device radio status every 12 seconds to simulate connectivity drops
        setInterval(() => {
            state.isRadioActive = !state.isRadioActive;

            if (!state.isRadioActive) {
                // Radio Disconnected state
                radioStatus.textContent = 'Disconnected (Radio Off)';
                radioStatus.className = 'value status-alert';
                radioAlertBanner.classList.remove('hidden');
                statusBadge.textContent = 'Alert';
                statusBadge.className = 'badge badge-warning';
            } else {
                // Radio Connected state
                radioStatus.textContent = 'Connected (4G LTE)';
                radioStatus.className = 'value status-ok';
                radioAlertBanner.classList.add('hidden');
                statusBadge.textContent = 'Active';
                statusBadge.className = 'badge badge-active';

                // Simulate slight movement drift (walking outdoors)
                state.currentCoords[0] += 0.0001;
                state.currentCoords[1] += 0.0001;
                
                if (state.map && state.marker) {
                    state.marker.setLatLng(state.currentCoords);
                }
            }
        }, 12000);
    }
});