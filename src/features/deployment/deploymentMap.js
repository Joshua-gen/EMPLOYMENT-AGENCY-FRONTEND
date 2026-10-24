const MANILA = [120.9842, 14.5995];

export const createRouteCoordinates = (destination, steps = 60) => {
    const endLng = Number(destination.longitude);
    const endLat = Number(destination.latitude);

    const [startLng, startLat] = MANILA;

    // Shortest longitude path, including destinations across the dateline.
    let deltaLng = endLng - startLng;

    if (deltaLng > 180) deltaLng -= 360;
    if (deltaLng < -180) deltaLng += 360;

    const distance = Math.hypot(deltaLng, endLat - startLat);
    const arcHeight = Math.min(distance * 0.16, 18);

    return Array.from({length: steps + 1}, (_, index) => {
        const t = index / steps;

        return [startLng + deltaLng * t, startLat + (endLat - startLat) * t + Math.sin(Math.PI * t) * arcHeight];
    });
};

export const createFeatureCollection = (features) => ({
    type: "FeatureCollection",
    features,
});

export const createDestinationFeature = (country) => ({
    type: "Feature",
    geometry: {
        type: "Point",
        coordinates: [Number(country.longitude), Number(country.latitude)],
    },
    properties: {
        country: country.country,
        applicants: country.applicants,
        positions: JSON.stringify(country.positions ?? []),
    },
});
