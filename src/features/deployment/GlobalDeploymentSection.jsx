import {useEffect, useRef, useState} from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import "../../index.css";

import {ArrowUpRight, Globe2, MapPin, Users, ChevronDown} from "lucide-react";

import {websiteApi} from "../website/api/websiteApi";

import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

import {createDestinationFeature, createFeatureCollection, createRouteCoordinates} from "./deploymentMap";

maplibregl.setWorkerUrl(workerUrl);

const MANILA = [120.9842, 14.5995];

const isWebGL2Supported = () => {
    let canvas;

    try {
        canvas = document.createElement("canvas");

        const context = canvas.getContext("webgl2");

        if (!context || context.isContextLost()) {
            return false;
        }

        // Release the test context so it does not consume resources.
        context.getExtension("WEBGL_lose_context")?.loseContext();

        return true;
    } catch {
        return false;
    } finally {
        canvas = null;
    }
};

const GlobalDeploymentSection = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);

    const [deployment, setDeployment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mapSupported, setMapSupported] = useState(null);
    const [mapFailed, setMapFailed] = useState(false);
    const [showAllDestinations, setShowAllDestinations] = useState(false);

    // Fetch public aggregate deployment data.
    useEffect(() => {
        let cancelled = false;

        const loadDeploymentMap = async () => {
            try {
                const response = await websiteApi.deploymentMap();

                if (cancelled) return;

                setDeployment(response?.data ?? response);
                setError("");
            } catch (err) {
                if (cancelled) return;

                console.error(
                    "Failed to load deployment map:",
                    err.response?.status,
                    err.response?.data ?? err.message
                );

                setDeployment(null);
                setError("Unable to load deployment data.");
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadDeploymentMap();

        return () => {
            cancelled = true;
        };
    }, []);

    // Check WebGL2 availability independently of the API request.
    useEffect(() => {
        setMapSupported(isWebGL2Supported());
    }, []);

    // Initialize MapLibre only when data and WebGL2 are available.
    useEffect(() => {
        if (loading || error || !deployment || mapSupported !== true || mapFailed || !mapContainerRef.current) {
            return;
        }

        let map;
        let animationFrame;
        let disposed = false;

        const countries = deployment.countries ?? [];

        const destinations = countries.filter((country) => {
            const longitude = Number(country.longitude);
            const latitude = Number(country.latitude);

            return (
                Number.isFinite(longitude) &&
                Number.isFinite(latitude) &&
                longitude >= -180 &&
                longitude <= 180 &&
                latitude >= -90 &&
                latitude <= 90
            );
        });

        const routes = destinations.map((country) => ({
            country,
            coordinates: createRouteCoordinates(country),
        }));

        const handleMapError = (event) => {
            const mapError = event?.error;

            console.error("MapLibre error:", mapError ?? event);

            // Handle GPU initialization/context failures.
            const message = String(mapError?.message ?? mapError ?? "");

            const isGraphicsFailure = /webgl|gpu|context lost|initializ|painter/i.test(message);

            if (isGraphicsFailure && !disposed) {
                setMapFailed(true);
            }
        };

        try {
            map = new maplibregl.Map({
                container: mapContainerRef.current,
                style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
                center: [15, 20],
                zoom: 0.65,
                minZoom: 0.4,
                maxZoom: 7,
                attributionControl: true,
                renderWorldCopies: false,
            });

            mapRef.current = map;
        } catch (err) {
            console.error("Map initialization failed:", err);
            setMapFailed(true);

            return () => {
                disposed = true;
            };
        }

        map.on("error", handleMapError);

        try {
            map.addControl(
                new maplibregl.NavigationControl({
                    showCompass: false,
                }),
                "top-right"
            );
        } catch (err) {
            console.error("Failed to add map controls:", err);
        }

        map.on("load", () => {
            if (disposed || mapRef.current !== map) return;

            try {
                const routeFeatures = routes.map(({country, coordinates}) => ({
                    type: "Feature",
                    geometry: {
                        type: "LineString",
                        coordinates,
                    },
                    properties: {
                        country: country.country,
                    },
                }));

                map.addSource("deployment-routes", {
                    type: "geojson",
                    data: createFeatureCollection(routeFeatures),
                });

                map.addSource("deployment-destinations", {
                    type: "geojson",
                    data: createFeatureCollection(destinations.map(createDestinationFeature)),
                });

                map.addSource("deployment-origin", {
                    type: "geojson",
                    data: createFeatureCollection([
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: MANILA,
                            },
                            properties: {
                                name: "Manila, Philippines",
                            },
                        },
                    ]),
                });

                map.addSource("deployment-travelers", {
                    type: "geojson",
                    data: createFeatureCollection([]),
                });

                // Outer route glow.
                map.addLayer({
                    id: "deployment-routes-glow",
                    type: "line",
                    source: "deployment-routes",
                    layout: {
                        "line-cap": "round",
                        "line-join": "round",
                    },
                    paint: {
                        "line-color": "#38BDF8",
                        "line-width": 7,
                        "line-opacity": 0.16,
                        "line-blur": 3,
                    },
                });

                // Main route line.
                map.addLayer({
                    id: "deployment-routes-core",
                    type: "line",
                    source: "deployment-routes",
                    layout: {
                        "line-cap": "round",
                        "line-join": "round",
                    },
                    paint: {
                        "line-color": "#7DD3FC",
                        "line-width": 1.5,
                        "line-opacity": 0.85,
                    },
                });

                // Destination markers.
                map.addLayer({
                    id: "deployment-destination-points",
                    type: "circle",
                    source: "deployment-destinations",
                    paint: {
                        "circle-radius": ["interpolate", ["linear"], ["zoom"], 0.5, 4, 3, 7],
                        "circle-color": "#C5D7E6",
                        "circle-stroke-color": "#38BDF8",
                        "circle-stroke-width": 2,
                        "circle-opacity": 1,
                    },
                });

                // Manila origin glow.
                map.addLayer({
                    id: "deployment-origin-glow",
                    type: "circle",
                    source: "deployment-origin",
                    paint: {
                        "circle-radius": 15,
                        "circle-color": "#FBBF24",
                        "circle-opacity": 0.18,
                        "circle-blur": 0.7,
                    },
                });

                // Manila origin marker.
                map.addLayer({
                    id: "deployment-origin-point",
                    type: "circle",
                    source: "deployment-origin",
                    paint: {
                        "circle-radius": 6,
                        "circle-color": "#FBBF24",
                        "circle-stroke-color": "#FFFFFF",
                        "circle-stroke-width": 2,
                    },
                });

                // Animated travelers glow.
                map.addLayer({
                    id: "deployment-travelers-glow",
                    type: "circle",
                    source: "deployment-travelers",
                    paint: {
                        "circle-radius": 7,
                        "circle-color": "#38BDF8",
                        "circle-opacity": 0.25,
                        "circle-blur": 0.8,
                    },
                });

                // Animated travelers core.
                map.addLayer({
                    id: "deployment-travelers-core",
                    type: "circle",
                    source: "deployment-travelers",
                    paint: {
                        "circle-radius": 2.5,
                        "circle-color": "#FFFFFF",
                        "circle-opacity": 1,
                    },
                });

                // Animate light points along each route.
                const startedAt = performance.now();

                const animateRoutes = (now) => {
                    if (disposed || mapRef.current !== map || mapFailed) {
                        return;
                    }

                    if (!map.isStyleLoaded()) {
                        animationFrame = requestAnimationFrame(animateRoutes);
                        return;
                    }

                    const elapsed = now - startedAt;

                    const travelers = routes
                    .filter(({coordinates}) => coordinates?.length > 1)
                    .map(({country, coordinates}, index) => {
                        const duration = 4500 + index * 350;
                        const progress = (elapsed % duration) / duration;

                        const pointIndex = Math.min(
                            Math.floor(progress * (coordinates.length - 1)),
                            coordinates.length - 1
                        );

                        return {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: coordinates[pointIndex],
                            },
                            properties: {
                                country: country.country,
                            },
                        };
                    });

                    const source = map.getSource("deployment-travelers");

                    if (source) {
                        source.setData(createFeatureCollection(travelers));
                    }

                    animationFrame = requestAnimationFrame(animateRoutes);
                };

                animationFrame = requestAnimationFrame(animateRoutes);

                // Country popup.
                map.on("click", "deployment-destination-points", (event) => {
                    const feature = event.features?.[0];

                    if (!feature) return;

                    const properties = feature.properties ?? {};
                    const popupContent = document.createElement("div");

                    popupContent.className = "deployment-popup";

                    const title = document.createElement("strong");

                    title.textContent = properties.country ?? "";

                    const count = document.createElement("p");

                    count.textContent = `${Number(properties.applicants ?? 0).toLocaleString()} deployed applicants`;

                    popupContent.append(title, count);

                    let positions = [];

                    try {
                        positions = JSON.parse(properties.positions || "[]");
                    } catch {
                        positions = [];
                    }

                    if (positions.length) {
                        const listTitle = document.createElement("p");

                        listTitle.textContent = "Job categories";

                        popupContent.appendChild(listTitle);

                        positions.slice(0, 4).forEach((position) => {
                            const item = document.createElement("p");

                            item.textContent = `${position.title} (${position.applicants})`;

                            popupContent.appendChild(item);
                        });
                    }

                    new maplibregl.Popup({
                        closeButton: true,
                        maxWidth: "260px",
                    })
                    .setLngLat(feature.geometry.coordinates)
                    .setDOMContent(popupContent)
                    .addTo(map);
                });

                map.on("mouseenter", "deployment-destination-points", () => {
                    map.getCanvas().style.cursor = "pointer";
                });

                map.on("mouseleave", "deployment-destination-points", () => {
                    map.getCanvas().style.cursor = "";
                });
            } catch (err) {
                console.error("Failed to render deployment map layers:", err);

                setMapFailed(true);
            }
        });

        return () => {
            disposed = true;
            cancelAnimationFrame(animationFrame);

            if (mapRef.current === map) {
                mapRef.current = null;
            }

            try {
                map.remove();
            } catch (err) {
                console.warn("Map cleanup warning:", err);
            }
        };
    }, [deployment, loading, error, mapSupported, mapFailed]);

    // Navigate to a country when the map is available.
    const focusCountry = (country) => {
        const map = mapRef.current;

        if (!map || mapFailed || !mapSupported) return;

        const longitude = Number(country.longitude);
        const latitude = Number(country.latitude);

        if (!Number.isFinite(longitude) || !Number.isFinite(latitude)) {
            return;
        }

        try {
            map.flyTo({
                center: [longitude, latitude],
                zoom: 3,
                speed: 0.8,
                essential: true,
            });
        } catch (err) {
            console.error("Unable to focus destination:", err);
        }
    };

    const showMapFallback = mapSupported === false || mapFailed;

    return (
        <section className="bg-gray-50 px-5 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 max-w-3xl">
                    <Text size="sm" weight="semibold" className="mb-2 uppercase tracking-[0.15em] text-[#062B4A]">
                        Our Global Reach
                    </Text>

                    <Heading as="h1" className="mb-3">
                        From the Philippines to the World
                    </Heading>

                    <Text size="base" className="mt-3 max-w-2xl text-gray-600">
                        Connecting Filipino talent with international opportunities and employers around the globe.
                    </Text>
                </div>

                <div className="w-full overflow-hidden rounded-xl border border-[#062B4A]/15 bg-[#062B4A] p-0">
                    <div className="grid w-full min-w-0 grid-cols-1 items-start lg:grid-cols-[minmax(0,1fr)_300px]">
                        {/* Map and fallback */}
                        <div className="relative h-full min-w-0">
                            <div className="relative min-h-[360px] h-full w-full">
                                {mapSupported === true && !mapFailed && !error && (
                                    <div
                                        ref={mapContainerRef}
                                        className="absolute inset-0 h-full w-full"
                                        aria-label="Interactive global deployment map"
                                        role="region"
                                    />
                                )}

                                {showMapFallback && !loading && !error && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#062B4A] px-6 py-10 text-center">
                                        <Globe2 size={44} className="mb-4 text-[#C5D7E6]" />

                                        <Heading as="h3" className="text-white">
                                            Our Global Reach
                                        </Heading>

                                        <Text size="sm" className="mt-3 max-w-md text-white/70">
                                            Our deployment destinations remain available below, even when the
                                            interactive map cannot be displayed on this device.
                                        </Text>

                                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                                            {(deployment?.countries ?? []).slice(0, 5).map((country) => (
                                                <span
                                                    key={country.country}
                                                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white"
                                                >
                                                    {country.country}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {mapSupported === null && !error && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#062B4A]">
                                        <Text size="sm" className="text-white">
                                            Preparing global deployments...
                                        </Text>
                                    </div>
                                )}

                                {loading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-[#062B4A]">
                                        <Text size="sm" className="text-white">
                                            Loading global deployments...
                                        </Text>
                                    </div>
                                )}

                                {error && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#062B4A] px-4 text-center">
                                        <Globe2 size={30} className="text-[#C5D7E6]" />

                                        <Text className="text-white">{error}</Text>

                                        <Text size="sm" className="text-white/60">
                                            Please check the deployment API connection.
                                        </Text>
                                    </div>
                                )}

                                {!loading && !error && !showMapFallback && deployment?.total_countries === 0 && (
                                    <div className="absolute inset-x-3 top-3 rounded-lg bg-[#062B4A]/95 p-3">
                                        <Text size="sm" className="text-white">
                                            Deployment destinations will appear here once qualifying records are
                                            available.
                                        </Text>
                                    </div>
                                )}

                                {mapSupported === true && !mapFailed && !loading && !error && (
                                    <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-2">
                                        <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#062B4A]/90 px-2.5 py-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />

                                            <Text size="xs" className="text-white">
                                                Manila, Philippines
                                            </Text>
                                        </div>

                                        <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-[#062B4A]/90 px-2.5 py-1.5">
                                            <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />

                                            <Text size="xs" className="text-white">
                                                Deployed destinations
                                            </Text>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Deployment statistics and destination list */}
                        <aside className="flex min-w-0 flex-col border-t border-white/10 bg-[#062B4A] p-3 text-white sm:p-4 lg:border-l lg:border-t-0">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#C5D7E6]">
                                    <Globe2 size={21} />
                                </div>

                                <div className="min-w-0">
                                    <Text as="h3" weight="bold" className="text-white">
                                        Global Deployments
                                    </Text>

                                    <Text size="sm" className="text-white/60">
                                        Our international reach
                                    </Text>
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                                    <div className="mb-1.5 flex items-center gap-2 text-[#C5D7E6]">
                                        <Users size={17} />

                                        <Text size="sm">Deployed Applicants</Text>
                                    </div>

                                    <Text as="p" size="2xl" weight="bold" className="text-white">
                                        {loading ? "—" : Number(deployment?.total_deployed ?? 0).toLocaleString()}
                                    </Text>
                                </div>

                                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                                    <div className="mb-1.5 flex items-center gap-2 text-[#C5D7E6]">
                                        <MapPin size={17} />

                                        <Text size="sm">Destination Countries</Text>
                                    </div>

                                    <Text as="p" size="2xl" weight="bold" className="text-white">
                                        {loading ? "—" : Number(deployment?.total_countries ?? 0).toLocaleString()}
                                    </Text>
                                </div>
                            </div>

                            <div className="my-4 border-t border-white/10" />

                            <div className="min-w-0">
                                <div className="mb-2.5 flex items-center justify-between gap-2">
                                    <Text as="h4" size="sm" weight="semibold" className="text-white/80">
                                        Deployment destinations
                                    </Text>

                                    {!loading && !error && deployment?.countries?.length > 0 && (
                                        <Text size="xs" className="shrink-0 text-white/40">
                                            {deployment.countries.length} countries
                                        </Text>
                                    )}
                                </div>

                                <div className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                                    {loading ? (
                                        <Text size="sm" className="p-3 text-white/60">
                                            Fetching countries...
                                        </Text>
                                    ) : error ? (
                                        <Text size="sm" className="p-3 text-white/60">
                                            Destination list unavailable.
                                        </Text>
                                    ) : !deployment?.countries?.length ? (
                                        <Text size="sm" className="p-3 text-white/60">
                                            No deployment destinations yet.
                                        </Text>
                                    ) : (
                                        <>
                                            <ul
                                                className={`divide-y divide-white/10 ${
                                                    showAllDestinations ? "max-h-[320px] overflow-y-auto" : ""
                                                }`}
                                            >
                                                {deployment.countries
                                                .slice(0, showAllDestinations ? deployment.countries.length : 3)
                                                .map((country) => (
                                                    <li key={country.country}>
                                                        <button
                                                            type="button"
                                                            onClick={() => focusCountry(country)}
                                                            disabled={!mapSupported || mapFailed}
                                                            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C5D7E6] disabled:cursor-default"
                                                        >
                                                            <Text size="sm" className="min-w-0 truncate text-white">
                                                                {country.country}
                                                            </Text>

                                                            <span className="flex shrink-0 items-center gap-1.5 text-[#C5D7E6]">
                                                                <Text size="sm">
                                                                    {Number(country.applicants ?? 0).toLocaleString()}
                                                                </Text>

                                                                <ArrowUpRight size={15} />
                                                            </span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>

                                            {deployment.countries.length > 3 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setShowAllDestinations((current) => !current)}
                                                    aria-expanded={showAllDestinations}
                                                    className="flex w-full items-center justify-center gap-2 border-t border-white/10 px-3 py-2.5 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#C5D7E6]"
                                                >
                                                    <Text size="sm" weight="medium" className="text-[#C5D7E6]">
                                                        {showAllDestinations
                                                            ? "Show less"
                                                            : `View all ${deployment.countries.length} destinations`}
                                                    </Text>

                                                    <ChevronDown
                                                        size={16}
                                                        className={`transition-transform duration-200 ${
                                                            showAllDestinations ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <Text size="xs" className="mt-3 leading-4 text-white/45">
                                Statistics reflect qualifying deployment records returned by our system.
                            </Text>
                        </aside>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default GlobalDeploymentSection;
