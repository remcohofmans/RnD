import { useEffect, useState } from 'react';

const API_KEY = 'AIzaSyBFR-QFJG4IC8k55TtTE7ClBzMyXWYUJTo'; // Your API key

let distanceMatrixService;

const calculateDistance = (origin, destination) => {
    return new Promise((resolve, reject) => {
        if (!distanceMatrixService) {
            reject(new Error('Distance Matrix Service not initialized'));
            return;
        }

        distanceMatrixService.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: 'DRIVING', // You can change this to WALKING, BICYCLING, TRANSIT
                unitSystem: window.google.maps.UnitSystem.METRIC,
            },
            (response, status) => {
                if (status === 'OK') {
                    const results = response.rows[0].elements[0];
                    const distance = results.distance.text;  // Just return the distance
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
            distanceMatrixService = new window.google.maps.DistanceMatrixService();
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
            script.async = true;
            script.onload = () => {
                distanceMatrixService = new window.google.maps.DistanceMatrixService();
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load Google Maps script'));
            document.head.appendChild(script);
        }
    });
};

const useDistanceMatrixService = () => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        initializeDistanceMatrixService().then(() => {
            setIsInitialized(true);
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    return isInitialized;
};

export { useDistanceMatrixService, calculateDistance };