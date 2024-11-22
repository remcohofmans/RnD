import { useEffect, useState } from 'react';

// Replace this with your actual Google Maps API Key
const API_KEY = 'AIzaSyBFR-QFJG4IC8k55TtTE7ClBzMyXWYUJTo';

let distanceMatrixService = null; // To store the Distance Matrix Service instance

/**
 * Function to calculate the distance between an origin and a destination
 * @param {string} origin - Starting location (e.g., "New York, NY")
 * @param {string} destination - Destination location (e.g., "Los Angeles, CA")
 * @returns {Promise<string>} - Resolves to the distance as a string (e.g., "3945 km")
 */
const calculateDistance = (origin, destination) => {
    return new Promise((resolve, reject) => {
        if (!distanceMatrixService) {
            reject(new Error('Distance Matrix Service not initialized.'));
            return;
        }

        distanceMatrixService.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING', // Options: DRIVING, WALKING, BICYCLING, TRANSIT
                unitSystem: window.google.maps.UnitSystem.METRIC, // Options: METRIC, IMPERIAL
            },
            (response, status) => {
                if (status === 'OK') {
                    const result = response.rows[0]?.elements[0];
                    if (result.status === 'OK') {
                        resolve(result.distance.text); // Return the distance as text
                    } else {
                        reject(new Error(`Unable to calculate distance: ${result.status}`));
                    }
                } else {
                    reject(new Error(`Distance Matrix API error: ${status}`));
                }
            }
        );
    });
};

/**
 * Function to initialize the Distance Matrix Service
 * @returns {Promise<void>}
 */
const initializeDistanceMatrixService = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            distanceMatrixService = new window.google.maps.DistanceMatrixService();
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&callback=initGoogleMaps`;
            script.async = true;
            script.onerror = () => reject(new Error('Failed to load Google Maps script.'));
            document.head.appendChild(script);

            window.initGoogleMaps = () => {
                distanceMatrixService = new window.google.maps.DistanceMatrixService();
                resolve();
            };
        }
    });
};

/**
 * React hook to initialize the Distance Matrix Service
 * @returns {boolean} - Whether the service is initialized
 */
const useDistanceMatrixService = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        initializeDistanceMatrixService()
            .then(() => setIsInitialized(true))
            .catch((error) => {
                console.error('Error initializing Google Maps service:', error);
            });
    }, []);

    return isInitialized;
};

export { useDistanceMatrixService, calculateDistance };
