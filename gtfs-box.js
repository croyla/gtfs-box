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
    label: '都営バス (東京)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/Toei/data/ToeiBus-GTFS.zip',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/ToeiBus',
    color: '9FC105',
    zoom: 14,
    center: [139.7670, 35.6814],
    bearing: 0,
    pitch: 60
}, {
    label: '横浜市営バス (横浜)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/YokohamaMunicipal/data/YokohamaMunicipal-Bus-GTFS.zip',
    vehiclePositionUrl: 'https://api.odpt.org/api/v4/gtfs/realtime/YokohamaMunicipalBus_vehicle',
    color: '1B1464',
    zoom: 14,
    center: [139.62234, 35.46576],
    bearing: 0,
    pitch: 60
}, {
    label: '京成バス千葉ウエスト塩浜営業所 (浦安)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/KeiseiTransitBus/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_KeiseiTransitBus_AllLines_vehicle',
    color: 'CC0000',
    zoom: 14,
    center: [139.89324, 35.6659],
    bearing: 0,
    pitch: 60
}, {
    label: '拓殖バス (帯広)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/HokkaidoTakushokuBus/Takusyoku_regular_line.zip?date=current',
    vehiclePositionUrl: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_HokkaidoTakushokuBus_Takusyoku_regular_line_vehicle',
    color: 'C73734',
    zoom: 14,
    center: [143.20355, 42.9182],
    bearing: 0,
    pitch: 60
}, {
    label: '函館市電 (函館)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/HakodateCity/Alllines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_HakodateCity_Alllines_vehicle',
    color: '204E9C',
    zoom: 14,
    center: [140.72784, 41.77222],
    bearing: 0,
    pitch: 60
}, {
    label: '青森市営バス (青森)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/AomoriCity/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_AomoriCity_AllLines_vehicle',
    color: '16CD96',
    zoom: 14,
    center: [140.73501, 40.82824],
    bearing: 0,
    pitch: 60
}, {
    label: '大利根交通バス (取手)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/OtoneKotsu/AllLines.zip?date=current',
    color: 'C62D27',
    zoom: 14,
    center: [140.06325, 35.89513],
    bearing: 0,
    pitch: 60
}, {
    label: '台東区コミュニティバス (台東区)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/TokyoTaitoCity/megurinCCBY40.zip?date=current',
    color: '851911',
    zoom: 14,
    center: [139.78132, 35.71378],
    bearing: 0,
    pitch: 60
}, {
    label: 'コミュニティバス（江戸バス） (中央区)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/TokyoChuoCity/Alldata.zip?date=current',
    color: 'BA363C',
    zoom: 14,
    center: [139.7717, 35.67076],
    bearing: 0,
    pitch: 60
}, {
    label: '千代田区地域福祉交通「風ぐるま」 (千代田区)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/HitachiAutomobileTransportation/Chiyoda_ALLLINES.zip?date=current',
    color: 'E0ACCB',
    zoom: 14,
    center: [139.75237, 35.69559],
    bearing: 0,
    pitch: 60
}, {
    label: '文京区コミュニティバス「Bーぐる」 (文京区)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/HitachiAutomobileTransportation/AllLines.zip?date=current',
    color: '346E5F',
    zoom: 14,
    center: [139.75189, 35.70788],
    bearing: 0,
    pitch: 60
}, {
    label: '北区コミュニティバス「Kバス」 (北区)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/HitachiAutomobileTransportation/KitaAllLines.zip?date=current',
    color: 'D75C95',
    zoom: 14,
    center: [139.73684, 35.75458],
    bearing: 0,
    pitch: 60
}, {
    label: '杉並区グリーンスローモビリティ (杉並区)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/TokyoSuginamiCity/GreenSlowMobility.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_TokyoSuginamiCity_GreenSlowMobility_vehicle',
    color: '347E42',
    zoom: 14,
    center: [139.61865, 35.7042],
    bearing: 0,
    pitch: 60
}, {
    label: '東京都国分寺市地域バスぶんバス (国分寺市)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/KokubunjiCity/kokubunji_city_bunbus.zip?date=current',
    color: '668E48',
    zoom: 14,
    center: [139.46925, 35.69658],
    bearing: 0,
    pitch: 60
}, {
    label: '国立市コミュニティバスくにっこ (国立市)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/KunitachiCity/kunitachi_city_kunikko.zip?date=current',
    color: '377723',
    zoom: 14,
    center: [139.44103, 35.68385],
    bearing: 0,
    pitch: 60
}, {
    label: 'ちょこバス (東大和市)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/HigashiyamatoCity/AllLines_CCBY4.zip?date=current',
    color: '2C4D92',
    zoom: 14,
    center: [139.42589, 35.74553],
    bearing: 0,
    pitch: 60
}, {
    label: '大島バス (伊豆大島)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/OshimaBus/AllLines.zip?date=current',
    color: 'F6D45C',
    zoom: 14,
    center: [139.35285, 34.75181],
    bearing: 0,
    pitch: 60
}, {
    label: '永井バス (前橋)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/NagaiTransportation/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_NagaiTransportation_AllLines_vehicle',
    color: '256445',
    zoom: 14,
    center: [139.07263, 36.38314],
    bearing: 0,
    pitch: 60
}, {
    label: '日本中央バス (前橋)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/NipponChuoBus/Maebashi_Area.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_NipponChuoBus_Maebashi_Area_vehicle',
    color: 'D1AC4B',
    zoom: 14,
    center: [139.07263, 36.38314],
    bearing: 0,
    pitch: 60
}, {
    label: '上信観光バス (高崎)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/JoshinKankoBus/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_JoshinKankoBus_AllLines_vehicle',
    color: 'C62D27',
    zoom: 14,
    center: [139.01161, 36.32221],
    bearing: 0,
    pitch: 60
}, {
    label: '関越交通バス (渋川)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/Kan_etsuTransportation/AllLines.zip?date=current',
    color: 'ED702D',
    zoom: 14,
    center: [139.00785, 36.49038],
    bearing: 0,
    pitch: 60
}, {
    label: '伊豆箱根バス (三島)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/IzuhakoneBus/IZHB.zip?date=current',
    vehiclePositionUrl: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_IzuhakoneBus_IZHB_vehicle',
    color: '275BA1',
    zoom: 14,
    center: [138.91193, 35.12577],
    bearing: 0,
    pitch: 60
}, {
    label: '秋葉バス (袋井)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/AkihaBusService/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_AkihaBusService_AllLines_vehicle',
    color: 'C65C5A',
    zoom: 14,
    center: [137.92604, 34.74094],
    bearing: 0,
    pitch: 60
}, {
    label: '京福バス (福井)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/KeifukuBus/keifuku_rosen.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_KeifukuBus_keifuku_rosen_vehicle',
    color: '75191C',
    zoom: 14,
    center: [136.22333, 36.06156],
    bearing: 0,
    pitch: 60
}, {
    label: '京都市営バス (京都)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/KyotoMunicipalTransportation/Kyoto_City_Bus_GTFS.zip?date=current',
    color: '1C5622',
    zoom: 14,
    center: [135.75861, 34.98666],
    bearing: 0,
    pitch: 60
}, {
    label: '小豆島オリーブバス (小豆島)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/ShodoshimaOliveBus/AllLines.zip?date=current',
    color: 'A1CE45',
    zoom: 14,
    center: [134.17208, 34.48901],
    bearing: 0,
    pitch: 60
}, {
    label: '宇野バス (岡山)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/UnoBus/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_UnoBus_AllLines_vehicle',
    color: '504A3D',
    zoom: 14,
    center: [133.91767, 34.66603],
    bearing: 0,
    pitch: 60
}, {
    label: '下津井バス (倉敷)',
    gtfsUrl: 'https://api.odpt.org/api/v4/files/odpt/Shimoden/Shimoden_BUS_GTFS_Realtime.zip?date=current',
    vehiclePositionUrl: 'https://api.odpt.org/api/v4/gtfs/realtime/odpt_Shimoden_Shimoden_BUS_GTFS_Realtime_vehicle',
    color: 'FF1004',
    zoom: 14,
    center: [133.76603, 34.60103],
    bearing: 0,
    pitch: 60
}, {
    label: '船鉄バス (宇部)',
    gtfsUrl: 'https://api-public.odpt.org/api/v4/files/odpt/SentetsuBus/AllLines.zip?date=current',
    vehiclePositionUrl: 'https://api-public.odpt.org/api/v4/gtfs/realtime/odpt_SentetsuBus_AllLines_vehicle',
    color: 'E83330',
    zoom: 14,
    center: [131.22167, 34.0027],
    bearing: 0,
    pitch: 60
}, {
    label: 'Tours Métropole Val de Loire (Tours, France)',
    gtfsUrl: 'https://data.tours-metropole.fr/api/datasets/1.0/horaires-temps-reel-gtfsrt-reseau-filbleu-tmvl/alternative_exports/filbleu_gtfszip/',
    color: '234D8C',
    zoom: 14,
    center: [0.69363, 47.39007],
    bearing: 0,
    pitch: 60
}, {
    label: 'Carris (Lisbon, Portugal)',
    gtfsUrl: 'https://gateway.carris.pt/gateway/gtfs/api/v2.8/GTFS',
    vehiclePositionUrl: 'https://gateway.carris.pt/gateway/gtfs/api/v2.8/GTFS/realtime/vehiclepositions',
    color: 'FFD301',
    zoom: 14,
    center: [-9.14172, 38.71549],
    bearing: 0,
    pitch: 60
}, {
    label: 'MRC du Haut-Saint-Laurent (Huntingdon, Canada)',
    gtfsUrl: 'https://gtfs-rt.infra-hubup.fr/mrchsl/current/revision/gtfs',
    vehiclePositionUrl: 'https://gtfs-rt.infra-hubup.fr/mrchsl/realtime',
    color: '1C94C6',
    zoom: 14,
    center: [-74.17316, 45.0872],
    bearing: 0,
    pitch: 60
}, {
    label: 'Tompkins Consolidated Area Transit (Ithaca, New York, USA)',
    gtfsUrl: 'https://realtimetcatbus.availtec.com/InfoPoint/GTFS-Zip.ashx',
    vehiclePositionUrl: 'https://realtimetcatbus.availtec.com/InfoPoint/GTFS-Realtime.ashx?&Type=VehiclePosition&serverid=0',
    color: '509FD3',
    zoom: 14,
    center: [-76.49709, 42.43962],
    bearing: 0,
    pitch: 60
}, {
    label: 'Altoona Metro Transit (Altoona, Pennsylvania, USA)',
    gtfsUrl: 'https://amtran.rideralerts.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://amtran.rideralerts.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '51B08B',
    zoom: 14,
    center: [-78.40189, 40.51472],
    bearing: 0,
    pitch: 60
}, {
    label: 'Indiana County Transit Authority (Indiana, Pennsylvania, USA)',
    gtfsUrl: 'https://indigobus.availtec.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://indigobus.availtec.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '94C01F',
    zoom: 14,
    center: [-79.15336, 40.62295],
    bearing: 0,
    pitch: 60
}, {
    label: 'Shenango Valley Shuttle Service (Sharon, Pennsylvania, USA)',
    gtfsUrl: 'https://svss.availtec.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://svss.availtec.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '050575',
    zoom: 14,
    center: [-80.50875, 41.23285],
    bearing: 0,
    pitch: 60
}, {
    label: 'Western Reserve Transit Authority (Youngstown, Ohio, USA)',
    gtfsUrl: 'https://myvalleystops.wrtaonline.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://myvalleystops.wrtaonline.com/infopoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '60B257',
    zoom: 14,
    center: [-80.64936, 41.10006],
    bearing: 0,
    pitch: 60
}, {
    label: 'Manatee County Area Transit (Bradenton, Florida, USA)',
    gtfsUrl: 'https://realtimemcat.availtec.com/InfoPoint/GTFS-Zip.ashx',
    vehiclePositionUrl: 'https://realtimemcat.availtec.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '8BC9CD',
    zoom: 14,
    center: [-82.57115, 27.49714],
    bearing: 0,
    pitch: 60
}, {
    label: 'Minnesota Valley Transit Authority (Burnsville, Minnesota, USA)',
    gtfsUrl: 'http://srv.mvta.com/InfoPoint/GTFS-Zip.ashx',
    vehiclePositionUrl: 'https://srv.mvta.com/infoPoint/GTFS-realtime.ashx?Type=VehiclePosition',
    color: '00553D',
    zoom: 14,
    center: [-93.28588, 44.74302],
    bearing: 0,
    pitch: 60
}, {
    label: 'North Central Regional Transit District (Santa Fe, New Mexico, USA)',
    gtfsUrl: 'https://bluebustracker.availtec.com/InfoPoint/GTFS-Zip.ashx',
    vehiclePositionUrl: 'https://bluebustracker.availtec.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '3170B5',
    zoom: 14,
    center: [-105.93851, 35.68743],
    bearing: 0,
    pitch: 60
}, {
    label: 'Link Transit (Wenatchee, Washington, USA)',
    gtfsUrl: 'https://link.rideralerts.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://link.rideralerts.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '2D3F8B',
    zoom: 14,
    center: [-120.31254, 47.42591],
    bearing: 0,
    pitch: 60
}, {
    label: 'Stanislaus Regional Transit (Modesto, California, USA)',
    gtfsUrl: 'https://stanrta.rideralerts.com/InfoPoint/gtfs-zip.ashx',
    vehiclePositionUrl: 'https://stanrta.rideralerts.com/InfoPoint/GTFS-Realtime.ashx?Type=VehiclePosition',
    color: '2B456F',
    zoom: 14,
    center: [-121.00104, 37.63909],
    bearing: 0,
    pitch: 60
}];

function numberOrDefault(value, defaultValue) {
    return isNaN(Number(value)) || isNaN(parseFloat(value)) ? defaultValue : +value;
}

class RouteControl {

    constructor(options) {
        const me = this;

        me._onSelect = options.onSelect;
        me._onChange = options.onChange;
    }

    getDefaultPosition() {
        return 'top-left';
    }

    onAdd(map) {
        const me = this;

        me._map = map;

        me._container = document.createElement('div');
        me._container.className = 'mapboxgl-ctrl ctrl-group';
        me._container.style.display = 'none';

        me._element = document.createElement('div');
        me._element.className = 'route-ctrl';
        me._container.appendChild(me._element);

        return me._container;
    }

    onRemove() {
        const me = this;

        me._container.parentNode.removeChild(me._container);
        delete me._container;
        delete me._map;
    }

    refresh(routes) {
        const me = this,
            container = me._container,
            element = me._element,
            height = () => container.classList.contains('expanded') ?
                `min(${routes.length * 29 + 48}px, calc(100dvh - ${container.getBoundingClientRect().top + 56}px))` :
                '';

        // Log route control refresh
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `Route control refresh started with ${routes.length} routes`);
        }

        if (routes.length === 0) {
            container.style.display = 'none';
            if (window.debugPanel) {
                window.debugPanel.log('DEBUG', 'Route control hidden (no routes)');
            }
            return;
        }

        container.style.display = 'block';

        // Log before DOM manipulation
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `📝 Starting innerHTML generation for ${routes.length} routes`);
        }
        const htmlGenStartTime = performance.now();

        element.innerHTML = [
            '<div class="route-header">',
            '<div>',
            `<div class="route-title">${routes[0].agency}</div>`,
            `<div id="route-all" class="route-item-all checked">Select All</div>`,
            '</div>',
            '<div>',
            '<div id="route-expand-button" class="route-expand-button"></div>',
            '</div>',
            '</div>',
            '<div class="route-body">',
            '<div class="route-content">',
            '<div class="route-list">',
            ...routes.map((route, i) => [
                `<div id="route-${i}" class="route-item checked">`,
                '<div class="route-item-label">',
                `<span class="route-label" style="color: ${route.textColor || '#333'}; background-color: ${route.color || '#fff'};">`,
                route.shortName || route.longName || '&nbsp;&nbsp;&nbsp;',
                '</span>',
                route.shortName && route.longName ? ` ${route.longName}` : '',
                '</div>',
                '</div>'
            ].join('')),
            '</div>',
            '</div>',
            '</div>'
        ].join('');

        const htmlGenDuration = performance.now() - htmlGenStartTime;
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `✅ innerHTML generated and assigned in ${htmlGenDuration.toFixed(2)}ms`);
            window.debugPanel.recordPerformance('Route Control innerHTML', htmlGenDuration);
        }

        container.style.height = height();

        // Log before event listener setup
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `🔗 Setting up ${routes.length + 1} event listeners`);
        }
        const eventSetupStartTime = performance.now();

        document.getElementById('route-expand-button').addEventListener('click', () => {
            container.classList.toggle('expanded');
            container.style.height = height();
        });
        document.getElementById('route-all').addEventListener('click', e => {
            if (e.target.classList.contains('checked')) {
                e.target.classList.remove('checked');
                for (let i = 0, ilen = routes.length; i < ilen; i++) {
                    document.getElementById(`route-${i}`).classList.remove('checked');
                }
                me._onChange(routes.map(({ref}) => ref), false);
            } else {
                e.target.classList.remove('partial');
                e.target.classList.add('checked');
                for (let i = 0, ilen = routes.length; i < ilen; i++) {
                    document.getElementById(`route-${i}`).classList.add('checked');
                }
                me._onChange(routes.map(({ref}) => ref), true);
            }
        });
        for (let i = 0, ilen = routes.length; i < ilen; i++) {
            const element = document.getElementById(`route-${i}`);

            element.addEventListener('click', e => {
                const checked = e.target.classList.toggle('checked');

                if (document.querySelector('.route-item.checked')) {
                    if (document.querySelector('.route-item:not(.checked)')) {
                        document.getElementById('route-all').classList.remove('checked');
                        document.getElementById('route-all').classList.add('partial');
                    } else {
                        document.getElementById('route-all').classList.remove('partial');
                        document.getElementById('route-all').classList.add('checked');
                    }
                } else {
                    document.getElementById('route-all').classList.remove('checked', 'partial');
                }
                me._onChange([routes[i].ref], checked);
            });
            element.addEventListener('mouseenter', () => {
                me._onSelect(routes[i].ref);
            });
            element.addEventListener('mouseleave', () => {
                me._onSelect();
            });
        }

        const eventSetupDuration = performance.now() - eventSetupStartTime;
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `✅ Event listeners setup complete in ${eventSetupDuration.toFixed(2)}ms`);
            window.debugPanel.recordPerformance('Route Control Event Setup', eventSetupDuration);
        }
    }

}

const matchLang = location.search.match(/lang=(.*?)(?:&|$)/),
    matchIndex = location.search.match(/index=(.*?)(?:&|$)/),
    matchGtfsUrl = location.search.match(/gtfsurl=(.*?)(?:&|$)/),
    matchVehiclePositionUrl = location.search.match(/gtfsvpurl=(.*?)(?:&|$)/),
    matchGtfsColor = location.search.match(/gtfscolor=(.*?)(?:&|$)/),
    matchHash = location.hash.match(/[^\d\.\-]*([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)\/?([\d\.\-]*)/),
    options = {
        container: 'map',
        // CRITICAL FIX: Explicitly disable Tokyo data loading
        // Without this, Mini Tokyo 3D loads 13MB+ of Tokyo transit data causing 733ms freeze
        dataUrl: '',  // Empty string to disable Tokyo data completely
        searchControl: false,
        modeControl: false,
        plugins: [mt3dPlateau({enabled: false})],
        style: 'assets/style.json'
    };
let initialIndex;

if (matchLang) {
    options.lang = decodeURIComponent(matchLang[1]);
}
if (matchIndex) {
    initialIndex = +decodeURIComponent(matchIndex[1]);
}
if (matchHash[1]) {
    options.zoom = +matchHash[1];
}
if (matchHash[2] && matchHash[3]) {
    options.center = [+matchHash[3], +matchHash[2]];
}
if (matchHash[4]) {
    options.bearing = +matchHash[4];
}
if (matchHash[5]) {
    options.pitch = +matchHash[5];
}
if (matchGtfsUrl && matchGtfsColor) {
    options.dataSources = [{
        gtfsUrl: decodeURIComponent(matchGtfsUrl[1]),
        vehiclePositionUrl: matchVehiclePositionUrl ? decodeURIComponent(matchVehiclePositionUrl[1]) : undefined,
        color: `#${decodeURIComponent(matchGtfsColor[1])}`
    }];
} else if (initialIndex === undefined) {
    initialIndex = 0;
}

// Auto-load first source if no URL parameters
if (!matchGtfsUrl && initialIndex === 0) {
    const firstSource = SOURCES[0];
    options.dataSources = [{
        gtfsUrl: firstSource.gtfsUrl,
        vehiclePositionUrl: firstSource.vehiclePositionUrl,
        color: `#${firstSource.color}`
    }];
    if (options.zoom === undefined) options.zoom = firstSource.zoom;
    if (options.center === undefined) options.center = firstSource.center;
    if (options.bearing === undefined) options.bearing = firstSource.bearing;
    if (options.pitch === undefined) options.pitch = firstSource.pitch;
}

const gtfsUrlElement = document.getElementById('gtfs-url'),
    vehiclePositionUrlElement = document.getElementById('gtfs-vp-url'),
    colorElement = document.getElementById('color'),
    zoomElement = document.getElementById('zoom'),
    latitudeElement = document.getElementById('latitude'),
    longitudeElement = document.getElementById('longitude'),
    bearingElement = document.getElementById('bearing'),
    pitchElement = document.getElementById('pitch');

function setValues(index, options) {
    if (index !== undefined) {
        const source = SOURCES[index];

        gtfsUrlElement.value = source.gtfsUrl;
        vehiclePositionUrlElement.value = source.vehiclePositionUrl || '';
        colorElement.value = `#${source.color}`;
        zoomElement.value = source.zoom;
        latitudeElement.value = source.center[1];
        longitudeElement.value = source.center[0];
        bearingElement.value = source.bearing;
        pitchElement.value = source.pitch;
        return;
    }
    gtfsUrlElement.value = options.dataSources[0].gtfsUrl;
    vehiclePositionUrlElement.value = options.dataSources[0].vehiclePositionUrl !== undefined ? options.dataSources[0].vehiclePositionUrl : '';
    colorElement.value = options.dataSources[0].color;
    zoomElement.value = options.zoom !== undefined ? options.zoom : '';
    latitudeElement.value = options.center[1] !== undefined ? options.center[1] : '';
    longitudeElement.value = options.center[0] !== undefined ? options.center[0] : '';
    bearingElement.value = options.bearing !== undefined ? options.bearing : '';
    pitchElement.value = options.pitch !== undefined ? options.pitch : '';
}

const selectElement = document.getElementById('select'),
    custom = initialIndex >= 0 ? '' : `<option value="" selected>Custom${options.dataSources[0].vehiclePositionUrl ? ' 🛜' : ''}</option>`;

selectElement.innerHTML = custom + SOURCES.map(
    (source, i) => `<option value="${i}"${i === initialIndex ? ' selected': ''}>${source.label}${source.vehiclePositionUrl ? ' 🛜' : ''}</option>`
).join('');
selectElement.addEventListener('input', e => {
    setValues(numberOrDefault(e.target.value, undefined), options);
});
setValues(initialIndex, options);

// Initialize debug logging
if (window.debugPanel) {
    window.debugPanel.log('INFO', 'Initializing GTFS Box map', {
        options: {
            container: options.container,
            dataUrl: options.dataUrl,  // Should be '' (empty) to disable Tokyo data loading
            lang: options.lang,
            zoom: options.zoom,
            center: options.center,
            bearing: options.bearing,
            pitch: options.pitch,
            dataSources: options.dataSources ? options.dataSources.length : 0
        }
    });

    window.debugPanel.log('INFO', '✅ Tokyo data loading disabled', {
        dataUrl: options.dataUrl,
        message: 'If you see minitokyo3d.com URLs in Network tab, the fix did not work'
    });
}

const map = new mt3d.Map(options);

// Log map creation (mt3d-maplibre-patch.js handles throttling)
if (window.debugPanel) {
    window.debugPanel.log('INFO', 'Map instance created');

    // Log what kind of map object we have
    window.debugPanel.log('INFO', 'Map object type', {
        hasGetMapboxMap: typeof map.getMapboxMap === 'function',
        hasGetMap: typeof map.getMap === 'function',
        mapConstructor: map.constructor.name,
        mapKeys: Object.keys(map).slice(0, 20) // First 20 properties
    });

    // Monitor all map events for debugging
    const monitoredEvents = [
        'load', 'error', 'data', 'dataloading', 'styledata',
        'sourcedataloading', 'styledataloading'
    ];

    monitoredEvents.forEach(eventName => {
        map.on(eventName, (e) => {
            const logData = {
                event: eventName,
                timestamp: new Date().toISOString()
            };

            // Add event-specific data
            if (e && typeof e === 'object') {
                if (e.sourceId) logData.sourceId = e.sourceId;
                if (e.isSourceLoaded !== undefined) logData.isSourceLoaded = e.isSourceLoaded;
                if (e.source) logData.source = e.source.id || 'unknown';
                if (e.tile) logData.tile = true;
            }

            // Log data-related events at INFO level, others at DEBUG
            const level = eventName.includes('data') || eventName.includes('error') ? 'INFO' : 'DEBUG';
            window.debugPanel.log(level, `Map event: ${eventName}`, logData);
        });
    });

    // Try to access the underlying MapLibre/Mapbox instance
    try {
        const underlyingMap = map.getMapboxMap ? map.getMapboxMap() : (map.getMap ? map.getMap() : null);
        if (underlyingMap) {
            window.debugPanel.log('INFO', 'Underlying map instance found', {
                version: underlyingMap.version,
                hasCustomLayers: underlyingMap.style && underlyingMap.style._layers ? Object.keys(underlyingMap.style._layers).length : 0
            });

            // CRITICAL: Protect event system from being wiped by MT3D
            const originalOff = underlyingMap.off;

            // Detect if event system gets destroyed
            const checkEventSystem = () => {
                if (!underlyingMap._listeners || Object.keys(underlyingMap._listeners).length === 0) {
                    window.debugPanel.log('ERROR', '💥 Event system was destroyed!', {
                        listenersExist: !!underlyingMap._listeners,
                        listenerCount: underlyingMap._listeners ? Object.keys(underlyingMap._listeners).length : 0
                    });
                    return false;
                }
                return true;
            };

            // Wrap .off() to detect if MT3D removes all handlers
            underlyingMap.off = function(type, layerIdOrListener, listener) {
                // If called with no arguments or just undefined, MT3D is trying to remove ALL handlers!
                if (arguments.length === 0 || (arguments.length === 1 && type === undefined)) {
                    window.debugPanel.log('ERROR', '💥 MT3D tried to call map.off() with no arguments (removes ALL handlers)!', {
                        stack: new Error().stack,
                        arguments: Array.from(arguments)
                    });
                    // Don't allow it - this breaks everything
                    return this;
                }

                // Log what's being removed
                window.debugPanel.log('DEBUG', `off() called for event: ${type}`, {
                    type,
                    hasListener: !!layerIdOrListener
                });

                // Otherwise allow normal off() calls
                return originalOff.apply(this, arguments);
            };

            // CRITICAL: Track zoom events to debug unresponsiveness
            let zoomEventCount = 0;
            let lastZoomTime = 0;
            let zoomInProgress = false;

            underlyingMap.on('zoomstart', (e) => {
                zoomInProgress = true;
                zoomEventCount = 0;
                lastZoomTime = performance.now();
                window.debugPanel.log('INFO', '🔍 ZOOM START', {
                    zoom: underlyingMap.getZoom(),
                    center: underlyingMap.getCenter(),
                    timestamp: new Date().toISOString()
                });

                // IMMEDIATELY check if scrollZoom is enabled (before async checks)
                window.debugPanel.log('INFO', '⚡ IMMEDIATE scrollZoom check', {
                    exists: !!underlyingMap.scrollZoom,
                    type: typeof underlyingMap.scrollZoom,
                    value: underlyingMap.scrollZoom,
                    isEnabled: underlyingMap.scrollZoom && underlyingMap.scrollZoom.isEnabled ? underlyingMap.scrollZoom.isEnabled() : 'N/A',
                    hasEnableMethod: underlyingMap.scrollZoom && typeof underlyingMap.scrollZoom.enable === 'function'
                });

                // CRITICAL FIX: Force re-enable scrollZoom if it exists but is disabled
                if (underlyingMap.scrollZoom && typeof underlyingMap.scrollZoom.enable === 'function') {
                    try {
                        const wasEnabled = underlyingMap.scrollZoom.isEnabled ? underlyingMap.scrollZoom.isEnabled() : null;
                        window.debugPanel.log('INFO', `scrollZoom status before fix: ${wasEnabled}`);

                        if (wasEnabled === false) {
                            window.debugPanel.log('ERROR', '💥 scrollZoom was DISABLED! Re-enabling now...');
                            underlyingMap.scrollZoom.enable();
                            window.debugPanel.log('INFO', '✅ scrollZoom re-enabled');
                        } else {
                            // Force enable anyway to be safe
                            underlyingMap.scrollZoom.enable();
                            window.debugPanel.log('INFO', '✅ Force-enabled scrollZoom');
                        }
                    } catch (err) {
                        window.debugPanel.log('ERROR', 'Failed to enable scrollZoom', { error: err.message });
                    }
                } else {
                    window.debugPanel.log('ERROR', '❌ scrollZoom handler not found or has no enable method!');
                }

                // CRITICAL: Monitor DOM events after zoomstart to see if they're blocked
                const canvas = underlyingMap.getCanvas();
                if (canvas) {
                    let domWheelCount = 0;
                    let domMouseCount = 0;

                    const wheelListener = (e) => {
                        domWheelCount++;
                        window.debugPanel.log('DEBUG', `🎡 DOM wheel event #${domWheelCount}`, {
                            deltaY: e.deltaY,
                            defaultPrevented: e.defaultPrevented,
                            propagationStopped: e.cancelBubble
                        });
                    };

                    const mouseListener = (e) => {
                        domMouseCount++;
                        if (domMouseCount <= 3) {
                            window.debugPanel.log('DEBUG', `🖱️ DOM mouse event #${domMouseCount}`, {
                                type: e.type,
                                button: e.button
                            });
                        }
                    };

                    canvas.addEventListener('wheel', wheelListener);
                    canvas.addEventListener('mousedown', mouseListener);

                    window.debugPanel.log('INFO', '✅ DOM event listeners attached', {
                        canvasElement: !!canvas,
                        hasWheelListener: true,
                        hasMouseListener: true
                    });

                    // Clean up after 5 seconds
                    setTimeout(() => {
                        canvas.removeEventListener('wheel', wheelListener);
                        canvas.removeEventListener('mousedown', mouseListener);
                        window.debugPanel.log('INFO', '🎡 DOM event monitoring complete', {
                            wheelEvents: domWheelCount,
                            mouseEvents: domMouseCount,
                            mapZoomEvents: zoomEventCount
                        });
                    }, 5000);
                } else {
                    window.debugPanel.log('ERROR', '❌ Could not attach DOM listeners - no canvas!');
                }

                // Check if event system survives zoomstart
                setTimeout(() => {
                    const survived = checkEventSystem();
                    window.debugPanel.log(survived ? 'INFO' : 'ERROR',
                        survived ? '✅ Event system intact after zoomstart' : '💥 Event system destroyed during zoomstart',
                        {
                            listenerTypes: underlyingMap._listeners ? Object.keys(underlyingMap._listeners) : [],
                            listenerCount: underlyingMap._listeners ? Object.keys(underlyingMap._listeners).length : 0
                        }
                    );

                    // Check if interaction handlers are still enabled
                    // First, inspect MapLibre internals to find where handlers live
                    window.debugPanel.log('INFO', '🔍 MapLibre internals', {
                        hasHandlers: !!underlyingMap.handlers,
                        has_handlers: !!underlyingMap._handlers,
                        topLevelKeys: Object.keys(underlyingMap).filter(k => !k.startsWith('_')).slice(0, 30),
                        privateKeys: Object.keys(underlyingMap).filter(k => k.startsWith('_') && k.includes('handler')).slice(0, 10)
                    });

                    // Handlers are DIRECTLY on the map object, not in a sub-property!
                    const handlerStatus = {};
                    ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate', 'touchPitch'].forEach(name => {
                        if (underlyingMap[name]) {
                            handlerStatus[name] = {
                                exists: true,
                                enabled: underlyingMap[name].isEnabled ? underlyingMap[name].isEnabled() : 'no isEnabled method',
                                active: underlyingMap[name].isActive ? underlyingMap[name].isActive() : 'no isActive method',
                                type: typeof underlyingMap[name]
                            };
                        } else {
                            handlerStatus[name] = { exists: false };
                        }
                    });
                    window.debugPanel.log('INFO', '🎮 Interaction handler status (FIXED - checking map directly)', handlerStatus);

                    // Check canvas and container status
                    const canvas = underlyingMap.getCanvas();
                    const container = underlyingMap.getContainer();
                    window.debugPanel.log('INFO', '🖼️ Canvas/Container status', {
                        hasCanvas: !!canvas,
                        canvasStyle: canvas ? {
                            display: canvas.style.display,
                            pointerEvents: canvas.style.pointerEvents,
                            visibility: canvas.style.visibility,
                            cursor: canvas.style.cursor
                        } : null,
                        containerStyle: container ? {
                            display: container.style.display,
                            pointerEvents: container.style.pointerEvents,
                            visibility: container.style.visibility
                        } : null
                    });
                }, 10);
            });

            underlyingMap.on('zoom', (e) => {
                zoomEventCount++;
                const now = performance.now();
                const delta = now - lastZoomTime;
                lastZoomTime = now;

                // Log every 10th zoom event to avoid spam
                if (zoomEventCount % 10 === 0) {
                    window.debugPanel.log('DEBUG', `⚡ Zoom event #${zoomEventCount} (${delta.toFixed(1)}ms since last)`, {
                        zoom: underlyingMap.getZoom(),
                        fps: (1000 / delta).toFixed(1)
                    });
                }
            });

            underlyingMap.on('zoomend', (e) => {
                const duration = performance.now() - lastZoomTime;
                zoomInProgress = false;
                window.debugPanel.log('INFO', '✅ ZOOM END', {
                    finalZoom: underlyingMap.getZoom(),
                    totalEvents: zoomEventCount,
                    duration: `${duration.toFixed(1)}ms`,
                    timestamp: new Date().toISOString()
                });

                // Check if map is still responsive after zoom
                setTimeout(() => {
                    try {
                        const testZoom = underlyingMap.getZoom();
                        const testCenter = underlyingMap.getCenter();
                        window.debugPanel.log('INFO', '🧪 Post-zoom responsiveness check', {
                            canGetZoom: testZoom !== undefined,
                            canGetCenter: testCenter !== undefined,
                            isLoaded: underlyingMap.loaded(),
                            hasCanvas: !!underlyingMap.getCanvas()
                        });
                    } catch (err) {
                        window.debugPanel.log('ERROR', '💥 Map became unresponsive after zoom!', {
                            error: err.message,
                            stack: err.stack
                        });
                    }
                }, 100);
            });

            // Track move events too
            let moveEventCount = 0;
            underlyingMap.on('movestart', () => {
                moveEventCount = 0;
                window.debugPanel.log('DEBUG', '🚶 Move start');
            });

            underlyingMap.on('moveend', () => {
                window.debugPanel.log('DEBUG', `🛑 Move end (${moveEventCount} events)`);
            });

            underlyingMap.on('move', () => {
                moveEventCount++;
            });

            // Monitor render events
            underlyingMap.on('render', () => {
                if (window.debugPanel && window.debugPanel.enabled) {
                    // Only log renders occasionally to avoid spam
                    if (Math.random() < 0.01) {
                        window.debugPanel.log('DEBUG', 'Map render event');
                    }
                }
            });

            // Monitor for rendering errors
            underlyingMap.on('error', (e) => {
                window.debugPanel.log('ERROR', 'Underlying map error', {
                    error: e.error ? e.error.message : String(e)
                });
            });
        }
    } catch (err) {
        window.debugPanel.log('WARN', 'Could not access underlying map instance', {
            error: err.message
        });
    }

    // Monitor for any unhandled errors
    window.addEventListener('error', (e) => {
        window.debugPanel.log('ERROR', 'Unhandled error', {
            message: e.message,
            filename: e.filename,
            lineno: e.lineno,
            colno: e.colno,
            error: e.error ? e.error.stack : 'No stack trace'
        });
    });

    // Monitor for unhandled promise rejections
    window.addEventListener('unhandledrejection', (e) => {
        window.debugPanel.log('ERROR', 'Unhandled promise rejection', {
            reason: e.reason,
            promise: String(e.promise)
        });
    });
}

document.getElementById('github').addEventListener('click', e => {
    window.open('https://github.com/nagix/gtfs-box', '_blank');
});

const configContainer = document.getElementById('config-container');

document.getElementById('toggle').addEventListener('click', e => {
    const classList = e.target.classList;

    if (classList.toggle('fa-angle-down')) {
        configContainer.style.height = 0;
    }
    if (classList.toggle('fa-angle-up')) {
        configContainer.style.height = '160px';
    }
});
configContainer.addEventListener('transitionend', e => {
    try {
        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', 'Config transition ended, resizing map');
        }

        const underlyingMap = map.getMapboxMap ? map.getMapboxMap() : (map.getMap ? map.getMap() : null);
        if (underlyingMap && typeof underlyingMap.resize === 'function') {
            underlyingMap.resize();
        } else {
            // Fallback: try calling resize directly on map object
            if (typeof map.resize === 'function') {
                map.resize();
            }
        }
    } catch (err) {
        if (window.debugPanel) {
            window.debugPanel.log('ERROR', 'Failed to resize map after transition', { error: err.message });
        }
    }
});

document.getElementById('location').addEventListener('click', e => {
    const {lng, lat} = map.getCenter();

    zoomElement.value = map.getZoom();
    latitudeElement.value = lat;
    longitudeElement.value = lng;
    bearingElement.value = map.getBearing();
    pitchElement.value = map.getPitch();
});

document.getElementById('load').addEventListener('click', e => {
    const index = selectElement.value,
        source = SOURCES[index],
        gtfsUrl = gtfsUrlElement.value,
        vehiclePositionUrl = vehiclePositionUrlElement.value || undefined,
        color = colorElement.value.slice(1).toUpperCase(),
        zoom = numberOrDefault(zoomElement.value, 14),
        latitude = numberOrDefault(latitudeElement.value, 35.6814),
        longitude = numberOrDefault(longitudeElement.value, 139.7670),
        bearing = numberOrDefault(bearingElement.value, 0),
        pitch = numberOrDefault(pitchElement.value, 60),
        langParam = options.lang ? `lang=${options.lang}&` : '';
        indexParam = source &&
            gtfsUrl === source.gtfsUrl &&
            vehiclePositionUrl === source.vehiclePositionUrl &&
            color === source.color &&
            zoom === source.zoom &&
            latitude === source.center[1] &&
            longitude === source.center[0] &&
            bearing === source.bearing &&
            pitch === source.pitch ? `index=${index}&` : '',
        params = `gtfsurl=${encodeURIComponent(gtfsUrl)}${vehiclePositionUrl ? `&gtfsvpurl=${encodeURIComponent(vehiclePositionUrl)}` : ''}&gtfscolor=${color}#${zoom}/${latitude}/${longitude}/${bearing}/${pitch}`;

    if (window.debugPanel) {
        window.debugPanel.log('INFO', 'Loading new GTFS data source', {
            gtfsUrl,
            vehiclePositionUrl,
            color,
            zoom,
            latitude,
            longitude,
            bearing,
            pitch
        });
    }

    window.location.href = `./?${langParam}${indexParam}${params}`;
});

const routeControl = new RouteControl({
    onSelect: ref => {
        const startTime = performance.now();

        if (ref) {
            map.updateBusRouteHighlight(ref.gtfsId, ref.routeId);
        } else {
            map.updateBusRouteHighlight();
        }

        const duration = performance.now() - startTime;
        if (window.debugPanel && duration > 10) {
            window.debugPanel.log('DEBUG', `Route highlight update: ${duration.toFixed(2)}ms`);
        }
    },
    onChange: (refs, checked) => {
        const startTime = performance.now();

        if (window.debugPanel) {
            window.debugPanel.log('DEBUG', `Route visibility change: ${refs.length} routes ${checked ? 'shown' : 'hidden'}`);
        }

        for (const {gtfsId, routeId} of refs) {
            const route = map.gtfs.get(gtfsId).routeLookup.get(routeId);

            if (checked) {
                delete route.hidden;
            } else {
                route.hidden = true;
            }
        }

        map.updateBusRouteVisibility();

        const duration = performance.now() - startTime;
        if (window.debugPanel) {
            window.debugPanel.recordPerformance('Route Visibility Update', duration);
            if (duration > 50) {
                window.debugPanel.log('WARN', `Slow route visibility update: ${duration.toFixed(2)}ms`, {
                    routeCount: refs.length,
                    checked
                });
            }
        }
    }
});

map.on('load', () => {
    if (window.debugPanel) {
        window.debugPanel.log('INFO', 'Map load event triggered');

        // Log deck.gl/WebGL info
        try {
            const underlyingMap = map.getMapboxMap ? map.getMapboxMap() : null;
            if (underlyingMap && underlyingMap.painter && underlyingMap.painter.context) {
                const gl = underlyingMap.painter.context.gl;
                window.debugPanel.log('INFO', 'WebGL context information', {
                    version: gl.getParameter(gl.VERSION),
                    vendor: gl.getParameter(gl.VENDOR),
                    renderer: gl.getParameter(gl.RENDERER),
                    maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)
                });
            }
        } catch (err) {
            window.debugPanel.log('WARN', 'Could not get WebGL context info', { error: err.message });
        }

        // Monitor map style changes (deck.gl layers get added here)
        try {
            const underlyingMap = map.getMapboxMap ? map.getMapboxMap() : null;
            if (underlyingMap) {
                underlyingMap.on('styledata', () => {
                    window.debugPanel.log('INFO', 'Style data loaded/changed', {
                        layers: underlyingMap.style._order ? underlyingMap.style._order.length : 0,
                        sources: Object.keys(underlyingMap.style.sourceCaches || {}).length
                    });
                });
            }
        } catch (err) {
            window.debugPanel.log('WARN', 'Could not monitor style changes', { error: err.message });
        }
    }

    let prevGtfsKeys = '';
    let updateCount = 0;

    setInterval(() => {
        const intervalStartTime = performance.now();
        updateCount++;

        const gtfsKeys = [...map.gtfs.keys()].join();

        let mbox;
        try {
            mbox = map.getMapboxMap ? map.getMapboxMap() : (map.getMap ? map.getMap() : null);
            if (!mbox) {
                if (window.debugPanel && updateCount === 1) {
                    window.debugPanel.log('ERROR', 'Could not access underlying map instance in route update interval');
                }
                return;
            }
        } catch (err) {
            if (window.debugPanel && updateCount === 1) {
                window.debugPanel.log('ERROR', 'Exception accessing underlying map', { error: err.message });
            }
            return;
        }

        if (prevGtfsKeys !== gtfsKeys) {
            if (window.debugPanel) {
                window.debugPanel.log('INFO', 'GTFS data changed, refreshing routes', {
                    previousKeys: prevGtfsKeys || '(empty)',
                    newKeys: gtfsKeys,
                    updateCount: updateCount
                });

                // Log if we're about to trigger 3D rendering
                try {
                    const gtfsCount = map.gtfs.size;
                    let totalVehicles = 0;
                    for (const gtfs of map.gtfs.values()) {
                        if (gtfs.vehicles && Array.isArray(gtfs.vehicles)) {
                            totalVehicles += gtfs.vehicles.length;
                        }
                    }

                    if (totalVehicles > 0) {
                        window.debugPanel.log('WARN', `About to render ${totalVehicles} 3D vehicles - this may trigger freeze`, {
                            totalVehicles,
                            gtfsSourceCount: gtfsCount
                        });
                    }
                } catch (err) {
                    window.debugPanel.log('DEBUG', 'Could not count vehicles', { error: err.message });
                }
            }

            const routesBuildStartTime = performance.now();
            const routes = [];

            if (!mbox.hasControl(routeControl)) {
                mbox.addControl(routeControl);
                if (window.debugPanel) {
                    window.debugPanel.log('INFO', 'Route control added to map');
                }
            }

            let totalRouteCount = 0;
            for (const gtfs of map.gtfs.values()) {
                const routeCount = gtfs.routeLookup.size;
                totalRouteCount += routeCount;

                if (window.debugPanel) {
                    window.debugPanel.log('DEBUG', `Processing GTFS data source: ${gtfs.agency}`, {
                        gtfsId: gtfs.id,
                        routeCount: routeCount,
                        agency: gtfs.agency
                    });
                }

                for (const route of gtfs.routeLookup.values()) {
                    const {id, shortName, longName, color, textColor} = route;

                    routes.push({
                        agency: gtfs.agency,
                        shortName,
                        longName,
                        color,
                        textColor,
                        ref: {gtfsId: gtfs.id, routeId: id}
                    });
                }
            }

            const routesBuildDuration = performance.now() - routesBuildStartTime;
            if (window.debugPanel) {
                window.debugPanel.recordPerformance('Route List Build', routesBuildDuration);
                window.debugPanel.log('DEBUG', `Built route list in ${routesBuildDuration.toFixed(2)}ms`, {
                    totalRoutes: totalRouteCount
                });
            }

            const sortStartTime = performance.now();
            const sortedRoutes = routes.sort((a, b) => {
                const nameA = (a.shortName + a.longName).toUpperCase(),
                    nameB = (b.shortName + b.longName).toUpperCase();

                return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
            });
            const sortDuration = performance.now() - sortStartTime;

            if (window.debugPanel) {
                window.debugPanel.recordPerformance('Route Sort', sortDuration);
                window.debugPanel.log('INFO', `🔄 About to refresh route control UI with ${sortedRoutes.length} routes - may cause brief freeze`, {
                    routeCount: sortedRoutes.length,
                    timestamp: performance.now()
                });
            }

            const refreshStartTime = performance.now();
            try {
                routeControl.refresh(sortedRoutes);
            } catch (err) {
                if (window.debugPanel) {
                    window.debugPanel.log('ERROR', 'Route control refresh failed', { error: err.message, stack: err.stack });
                }
            }
            const refreshDuration = performance.now() - refreshStartTime;

            if (window.debugPanel) {
                window.debugPanel.recordPerformance('Route Control DOM Refresh', refreshDuration);
                if (refreshDuration > 50) {
                    window.debugPanel.log('WARN', `⚠️ Route control refresh took ${refreshDuration.toFixed(2)}ms (may cause freeze)`, {
                        routeCount: sortedRoutes.length
                    });
                }
            }

            prevGtfsKeys = gtfsKeys;

            const totalDuration = performance.now() - intervalStartTime;
            if (window.debugPanel) {
                window.debugPanel.recordPerformance('Route Update Cycle (Full)', totalDuration);
                if (totalDuration > 50) {
                    window.debugPanel.log('WARN', `Slow route update cycle: ${totalDuration.toFixed(2)}ms`, {
                        routesBuildDuration: routesBuildDuration.toFixed(2),
                        sortDuration: sortDuration.toFixed(2),
                        routeCount: routes.length
                    });
                }
            }
        } else {
            // Log periodic checks (but less frequently to avoid spam)
            if (updateCount % 60 === 0 && window.debugPanel) {
                window.debugPanel.log('DEBUG', `Route update check #${updateCount} - no changes`);
            }
        }

        const intervalDuration = performance.now() - intervalStartTime;
        if (intervalDuration > 100 && window.debugPanel) {
            window.debugPanel.log('WARN', `Route update interval took ${intervalDuration.toFixed(2)}ms (threshold: 100ms)`);
        }
    }, 1000);

    // Monitor GTFS data updates
    if (window.debugPanel) {
        setInterval(() => {
            const gtfsCount = map.gtfs.size;
            if (gtfsCount > 0) {
                const gtfsInfo = [];
                for (const [key, gtfs] of map.gtfs.entries()) {
                    gtfsInfo.push({
                        id: key,
                        agency: gtfs.agency,
                        routes: gtfs.routeLookup.size,
                        // Check if vehicles property exists
                        vehicles: gtfs.vehicles ? gtfs.vehicles.length : 'N/A'
                    });
                }

                window.debugPanel.log('DEBUG', `GTFS data status check`, {
                    dataSourceCount: gtfsCount,
                    sources: gtfsInfo
                });
            }
        }, 30000); // Every 30 seconds
    }
});
