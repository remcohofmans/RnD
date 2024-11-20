import React, { useEffect, useState } from 'react';
import { LoadScript, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];

// Created a google api on my ggogle
//source: https://developers.google.com/maps/documentation/javascript/distancematrix


const DistanceCalculator = ({ origin, destination }) => {
    const apiKey = 'AIzaSyBFR-QFJG4IC8k55TtTE7ClBzMyXWYUJTo'; 
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey,
        libraries,
    });

    useEffect(() => {
        if (isLoaded) {
            const service = new window.google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [origin],
                    destinations: [destination],
                    travelMode: 'DRIVING',  
                    unitSystem: window.google.maps.UnitSystem.METRIC,
                    avoidHighways: false,
                    avoidTolls: false,
                },
                (response, status) => {
                    if (status === 'OK') {
                        const results = response.rows[0].elements[0];
                        const distance = results.distance.text;
                        const duration = results.duration.text;
                        console.log(`Distance from ${origin} to ${destination} is ${distance} and it takes ${duration}.`);
                    } else {
                        console.error('Error:', status);
                    }
                }
            );
        }
    }, [isLoaded, origin, destination]);

    return (
        <div>
            {isLoaded ? (
                <div>
                    <h1>Distance Calculator</h1>
                    <p>Calculating distance between {origin} and {destination}...</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default DistanceCalculator;
