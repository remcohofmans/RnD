import { useEffect, useState } from 'react';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;


let distanceMatrixService;

const calculateDistance = (origin, destination) => {
    return new Promise((resolve, reject) => {
        if (!distanceMatrixService) {
            reject(new Error('Distance Matrix Service not initialized'));
            return;
        }

        // https://developers.google.com/maps/documentation/javascript/distancematrix
        distanceMatrixService.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING', 
                unitSystem: window.google.maps.UnitSystem.METRIC,
            },
            (response, status) => {
                if (status === 'OK') {
                    const results = response.rows[0].elements[0];
                    const distance = results.distance.text;  
                    resolve(distance);
                } else {
                    reject(new Error('Error fetching distance matrix: ' + status));
                }
            }
        );
    });
};

// Initialize the service once the script is loaded
const initializeDistanceMatrixService = () => {
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            console.log('Google Maps loaded, initializing Distance Matrix Service...');
            distanceMatrixService = new window.google.maps.DistanceMatrixService();
            resolve();
        } else {
            console.log('Google Maps not loaded, attempting to load script...');
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => {
                console.log('Google Maps script loaded');
                distanceMatrixService = new window.google.maps.DistanceMatrixService();
                resolve();
            };
            script.onerror = (err) => {
                console.error('Failed to load Google Maps script:', err);
                reject(new Error('Failed to load Google Maps script'));
            };
            document.head.appendChild(script);
        }
    });
};

const useDistanceMatrixService = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Load the script and initialize the service when the component mounts
        initializeDistanceMatrixService()
            .then(() => {
                setIsInitialized(true);
            })
            .catch((error) => {
                console.error('Error initializing Google Maps:', error);
            });
    }, []);

    return isInitialized;
};

export { useDistanceMatrixService, calculateDistance };
