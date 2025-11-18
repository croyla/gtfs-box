// GTFS data sources
const SOURCES = [
    {
        label: 'Bengaluru Airport Buses [KIA] (Bengaluru, India)',
        gtfsUrl: 'https://backend.bengawalk.com/kia/gtfs.zip',
        vehiclePositionUrl: 'https://backend.bengawalk.com/kia/gtfs-rt.proto',
        color: '00C8FF',
        zoom: 10,
        center: [77.61, 12.95],
        bearing: 0,
        pitch: 60
    },
    {
        label: 'Bay Area Rapid Transit [BART] (San Francisco Bay Area, CA, USA)',
        gtfsUrl: 'https://www.bart.gov/dev/schedules/google_transit.zip',
        vehiclePositionUrl: 'https://api.bart.gov/gtfsrt/tripupdate.aspx',
        color: '0099CC',
        zoom: 10,
        center: [-122.27, 37.80],
        bearing: 0,
        pitch: 60
    }
];

let map;
let vehicles = new Map();
let updateInterval;

// Initialize MapLibre map
function initializeMap() {
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.match(/[^\d\.\-]*([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)/);

    // Get initial source or use first one
    const sourceIndex = urlParams.get('index') ? parseInt(urlParams.get('index')) : 0;
    const source = SOURCES[sourceIndex] || SOURCES[0];

    // Get initial view from URL or source
    const zoom = hash && hash[1] ? parseFloat(hash[1]) : source.zoom;
    const lat = hash && hash[2] ? parseFloat(hash[2]) : source.center[1];
    const lng = hash && hash[3] ? parseFloat(hash[3]) : source.center[0];
    const bearing = hash && hash[4] ? parseFloat(hash[4]) : source.bearing;
    const pitch = hash && hash[5] ? parseFloat(hash[5]) : source.pitch;

    map = new maplibregl.Map({
        container: 'map',
        style: 'assets/style.json',
        center: [lng, lat],
        zoom: zoom,
        bearing: bearing,
        pitch: pitch,
        hash: true
    });

    map.on('load', () => {
        // Add 3D building layer
        if (!map.getLayer('3d-building')) {
            map.addLayer({
                'id': '3d-building',
                'source': 'openmaptiles',
                'source-layer': 'building',
                'filter': ['!=', ['get', 'underground'], 'true'],
                'type': 'fill-extrusion',
                'minzoom': 15,
                'paint': {
                    'fill-extrusion-color': [
                        'case',
                        ['has', 'render_height'],
                        'hsl(47, 13%, 75%)',
                        'hsl(47, 13%, 65%)'
                    ],
                    'fill-extrusion-height': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['coalesce', ['get', 'render_height'], 5]
                    ],
                    'fill-extrusion-base': [
                        'interpolate', ['linear'], ['zoom'],
                        15, 0,
                        15.05, ['coalesce', ['get', 'render_min_height'], 0]
                    ],
                    'fill-extrusion-opacity': 0.7
                }
            });
        }

        // Add vehicle layer
        map.addSource('vehicles', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: []
            }
        });

        map.addLayer({
            id: 'vehicles-layer',
            type: 'circle',
            source: 'vehicles',
            paint: {
                'circle-radius': 6,
                'circle-color': ['get', 'color'],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
            }
        });

        // Add vehicle labels
        map.addLayer({
            id: 'vehicles-labels',
            type: 'symbol',
            source: 'vehicles',
            layout: {
                'text-field': ['get', 'label'],
                'text-size': 10,
                'text-offset': [0, 1.5],
                'text-anchor': 'top'
            },
            paint: {
                'text-color': '#000000',
                'text-halo-color': '#ffffff',
                'text-halo-width': 1
            }
        });

        // Load initial source
        loadGTFSSource(source);

        // Update vehicles every 10 seconds
        updateInterval = setInterval(() => {
            if (window.currentSource) {
                updateVehicles(window.currentSource);
            }
        }, 10000);
    });

    // Popup for vehicle info
    map.on('click', 'vehicles-layer', (e) => {
        const props = e.features[0].properties;
        new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <strong>Vehicle ${props.label}</strong><br>
                ${props.route ? `Route: ${props.route}<br>` : ''}
                ${props.speed ? `Speed: ${Math.round(props.speed)} km/h<br>` : ''}
                Updated: ${new Date(props.timestamp * 1000).toLocaleTimeString()}
            `)
            .addTo(map);
    });

    map.on('mouseenter', 'vehicles-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'vehicles-layer', () => {
        map.getCanvas().style.cursor = '';
    });
}

// Load GTFS source
function loadGTFSSource(source) {
    window.currentSource = source;

    // Update color element
    const colorInput = document.getElementById('color');
    if (colorInput) {
        colorInput.value = '#' + source.color;
    }

    // Update URL inputs
    document.getElementById('gtfs-url').value = source.gtfsUrl || '';
    document.getElementById('gtfs-vp-url').value = source.vehiclePositionUrl || '';

    // Clear existing vehicles
    vehicles.clear();
    updateVehiclesLayer();

    // Start fetching vehicle positions
    updateVehicles(source);
}

// Load GTFS-RT protobuf schema
let gtfsrtProto = null;

async function loadGTFSRTProto() {
    if (gtfsrtProto) return gtfsrtProto;

    try {
        const root = await protobuf.load('https://raw.githubusercontent.com/google/transit/master/gtfs-realtime/proto/gtfs-realtime.proto');
        gtfsrtProto = root.lookupType('transit_realtime.FeedMessage');
        return gtfsrtProto;
    } catch (error) {
        console.error('Error loading GTFS-RT proto:', error);
        // Fallback: define minimal schema inline
        const root = protobuf.Root.fromJSON({
            nested: {
                transit_realtime: {
                    nested: {
                        FeedMessage: {
                            fields: {
                                header: { type: 'FeedHeader', id: 1 },
                                entity: { rule: 'repeated', type: 'FeedEntity', id: 2 }
                            }
                        },
                        FeedHeader: {
                            fields: {
                                gtfsRealtimeVersion: { type: 'string', id: 1 },
                                incrementality: { type: 'Incrementality', id: 2 },
                                timestamp: { type: 'uint64', id: 3 }
                            }
                        },
                        Incrementality: {
                            values: {
                                FULL_DATASET: 0,
                                DIFFERENTIAL: 1
                            }
                        },
                        FeedEntity: {
                            fields: {
                                id: { type: 'string', id: 1, rule: 'required' },
                                isDeleted: { type: 'bool', id: 2 },
                                tripUpdate: { type: 'TripUpdate', id: 3 },
                                vehicle: { type: 'VehiclePosition', id: 4 },
                                alert: { type: 'Alert', id: 5 }
                            }
                        },
                        TripUpdate: {
                            fields: {
                                trip: { type: 'TripDescriptor', id: 1, rule: 'required' },
                                vehicle: { type: 'VehicleDescriptor', id: 3 },
                                stopTimeUpdate: { rule: 'repeated', type: 'StopTimeUpdate', id: 2 },
                                timestamp: { type: 'uint64', id: 4 },
                                delay: { type: 'int32', id: 5 }
                            }
                        },
                        StopTimeUpdate: {
                            fields: {
                                stopSequence: { type: 'uint32', id: 1 },
                                stopId: { type: 'string', id: 4 },
                                arrival: { type: 'StopTimeEvent', id: 2 },
                                departure: { type: 'StopTimeEvent', id: 3 },
                                scheduleRelationship: { type: 'ScheduleRelationship', id: 5 }
                            },
                            nested: {
                                ScheduleRelationship: {
                                    values: {
                                        SCHEDULED: 0,
                                        SKIPPED: 1,
                                        NO_DATA: 2
                                    }
                                }
                            }
                        },
                        StopTimeEvent: {
                            fields: {
                                delay: { type: 'int32', id: 1 },
                                time: { type: 'int64', id: 2 },
                                uncertainty: { type: 'int32', id: 3 }
                            }
                        },
                        VehiclePosition: {
                            fields: {
                                trip: { type: 'TripDescriptor', id: 1 },
                                vehicle: { type: 'VehicleDescriptor', id: 8 },
                                position: { type: 'Position', id: 2 },
                                currentStopSequence: { type: 'uint32', id: 3 },
                                stopId: { type: 'string', id: 7 },
                                currentStatus: { type: 'VehicleStopStatus', id: 4 },
                                timestamp: { type: 'uint64', id: 5 },
                                congestionLevel: { type: 'CongestionLevel', id: 6 },
                                occupancyStatus: { type: 'OccupancyStatus', id: 9 }
                            }
                        },
                        Alert: {
                            fields: {
                                activePeriod: { rule: 'repeated', type: 'TimeRange', id: 1 },
                                informedEntity: { rule: 'repeated', type: 'EntitySelector', id: 5 },
                                cause: { type: 'Cause', id: 6 },
                                effect: { type: 'Effect', id: 7 },
                                url: { type: 'TranslatedString', id: 8 },
                                headerText: { type: 'TranslatedString', id: 10 },
                                descriptionText: { type: 'TranslatedString', id: 11 }
                            }
                        },
                        TimeRange: {
                            fields: {
                                start: { type: 'uint64', id: 1 },
                                end: { type: 'uint64', id: 2 }
                            }
                        },
                        EntitySelector: {
                            fields: {
                                agencyId: { type: 'string', id: 1 },
                                routeId: { type: 'string', id: 2 },
                                routeType: { type: 'int32', id: 3 },
                                trip: { type: 'TripDescriptor', id: 4 },
                                stopId: { type: 'string', id: 5 }
                            }
                        },
                        TranslatedString: {
                            fields: {
                                translation: { rule: 'repeated', type: 'Translation', id: 1 }
                            },
                            nested: {
                                Translation: {
                                    fields: {
                                        text: { type: 'string', id: 1, rule: 'required' },
                                        language: { type: 'string', id: 2 }
                                    }
                                }
                            }
                        },
                        TripDescriptor: {
                            fields: {
                                tripId: { type: 'string', id: 1 },
                                routeId: { type: 'string', id: 5 },
                                directionId: { type: 'uint32', id: 6 },
                                startTime: { type: 'string', id: 2 },
                                startDate: { type: 'string', id: 3 },
                                scheduleRelationship: { type: 'ScheduleRelationship', id: 4 }
                            },
                            nested: {
                                ScheduleRelationship: {
                                    values: {
                                        SCHEDULED: 0,
                                        ADDED: 1,
                                        UNSCHEDULED: 2,
                                        CANCELED: 3
                                    }
                                }
                            }
                        },
                        VehicleDescriptor: {
                            fields: {
                                id: { type: 'string', id: 1 },
                                label: { type: 'string', id: 2 },
                                licensePlate: { type: 'string', id: 3 }
                            }
                        },
                        Position: {
                            fields: {
                                latitude: { type: 'float', id: 1, rule: 'required' },
                                longitude: { type: 'float', id: 2, rule: 'required' },
                                bearing: { type: 'float', id: 3 },
                                odometer: { type: 'double', id: 4 },
                                speed: { type: 'float', id: 5 }
                            }
                        },
                        VehicleStopStatus: {
                            values: {
                                INCOMING_AT: 0,
                                STOPPED_AT: 1,
                                IN_TRANSIT_TO: 2
                            }
                        },
                        CongestionLevel: {
                            values: {
                                UNKNOWN_CONGESTION_LEVEL: 0,
                                RUNNING_SMOOTHLY: 1,
                                STOP_AND_GO: 2,
                                CONGESTION: 3,
                                SEVERE_CONGESTION: 4
                            }
                        },
                        OccupancyStatus: {
                            values: {
                                EMPTY: 0,
                                MANY_SEATS_AVAILABLE: 1,
                                FEW_SEATS_AVAILABLE: 2,
                                STANDING_ROOM_ONLY: 3,
                                CRUSHED_STANDING_ROOM_ONLY: 4,
                                FULL: 5,
                                NOT_ACCEPTING_PASSENGERS: 6
                            }
                        },
                        Cause: {
                            values: {
                                UNKNOWN_CAUSE: 1,
                                OTHER_CAUSE: 2,
                                TECHNICAL_PROBLEM: 3,
                                STRIKE: 4,
                                DEMONSTRATION: 5,
                                ACCIDENT: 6,
                                HOLIDAY: 7,
                                WEATHER: 8,
                                MAINTENANCE: 9,
                                CONSTRUCTION: 10,
                                POLICE_ACTIVITY: 11,
                                MEDICAL_EMERGENCY: 12
                            }
                        },
                        Effect: {
                            values: {
                                NO_SERVICE: 1,
                                REDUCED_SERVICE: 2,
                                SIGNIFICANT_DELAYS: 3,
                                DETOUR: 4,
                                ADDITIONAL_SERVICE: 5,
                                MODIFIED_SERVICE: 6,
                                OTHER_EFFECT: 7,
                                UNKNOWN_EFFECT: 8,
                                STOP_MOVED: 9
                            }
                        }
                    }
                }
            }
        });
        gtfsrtProto = root.lookupType('transit_realtime.FeedMessage');
        return gtfsrtProto;
    }
}

// Update vehicles from GTFS-RT feed
async function updateVehicles(source) {
    if (!source.vehiclePositionUrl) return;

    try {
        const FeedMessage = await loadGTFSRTProto();
        const response = await fetch(source.vehiclePositionUrl);
        const buffer = await response.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        const message = FeedMessage.decode(uint8Array);
        const feedTimestamp = message.header?.timestamp || Date.now() / 1000;

        // Update vehicles map
        if (message.entity) {
            message.entity.forEach(entity => {
                if (entity.vehicle && entity.vehicle.position) {
                    const pos = entity.vehicle.position;
                    const vehicleId = entity.id;

                    vehicles.set(vehicleId, {
                        id: vehicleId,
                        lat: pos.latitude,
                        lon: pos.longitude,
                        bearing: pos.bearing || 0,
                        speed: pos.speed || 0,
                        label: entity.vehicle.vehicle?.label || entity.vehicle.vehicle?.id || vehicleId,
                        route: entity.vehicle.trip?.routeId || '',
                        timestamp: entity.vehicle.timestamp || feedTimestamp,
                        color: '#' + source.color
                    });
                }
            });
        }

        updateVehiclesLayer();

    } catch (error) {
        console.error('Error fetching vehicle positions:', error);
    }
}

// Update vehicles layer with current data
function updateVehiclesLayer() {
    if (!map || !map.getSource('vehicles')) return;

    const features = Array.from(vehicles.values()).map(vehicle => ({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [vehicle.lon, vehicle.lat]
        },
        properties: {
            id: vehicle.id,
            label: vehicle.label,
            route: vehicle.route,
            bearing: vehicle.bearing,
            speed: vehicle.speed,
            timestamp: vehicle.timestamp,
            color: vehicle.color
        }
    }));

    map.getSource('vehicles').setData({
        type: 'FeatureCollection',
        features: features
    });
}

// UI handlers
function initializeUI() {
    const select = document.getElementById('select');

    // Populate source selector
    SOURCES.forEach((source, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = source.label;
        select.appendChild(option);
    });

    // Handle source change
    select.addEventListener('change', (e) => {
        const source = SOURCES[e.target.value];
        loadGTFSSource(source);

        // Update URL
        const url = new URL(window.location);
        url.searchParams.set('index', e.target.value);
        window.history.pushState({}, '', url);

        // Fly to source location
        map.flyTo({
            center: source.center,
            zoom: source.zoom,
            bearing: source.bearing,
            pitch: source.pitch
        });
    });

    // Handle load button
    document.getElementById('load').addEventListener('click', () => {
        const gtfsUrl = document.getElementById('gtfs-url').value;
        const vpUrl = document.getElementById('gtfs-vp-url').value;
        const color = document.getElementById('color').value.replace('#', '');

        if (vpUrl) {
            loadGTFSSource({
                gtfsUrl: gtfsUrl,
                vehiclePositionUrl: vpUrl,
                color: color,
                zoom: map.getZoom(),
                center: [map.getCenter().lng, map.getCenter().lat],
                bearing: map.getBearing(),
                pitch: map.getPitch()
            });
        }
    });

    // Handle location button
    document.getElementById('location').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                map.flyTo({
                    center: [position.coords.longitude, position.coords.latitude],
                    zoom: 14
                });
            });
        }
    });

    // Handle GitHub button
    document.getElementById('github').addEventListener('click', () => {
        window.open('https://github.com/nagix/gtfs-box', '_blank');
    });

    // Handle toggle button
    document.getElementById('toggle').addEventListener('click', () => {
        const container = document.getElementById('config-container');
        const toggle = document.getElementById('toggle');
        if (container.classList.contains('expanded')) {
            container.classList.remove('expanded');
            toggle.classList.remove('fa-angle-up');
            toggle.classList.add('fa-angle-down');
        } else {
            container.classList.add('expanded');
            toggle.classList.remove('fa-angle-down');
            toggle.classList.add('fa-angle-up');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeUI();
    initializeMap();
});
