export const fetchWeatherForecastData = () => {
    const xhr = new XMLHttpRequest();
    const promise = new Promise((resolve, reject) => {
        xhr.onload = () => {
            resolve(getForecastPointsFromXML());
        };
    });
    const getForecastPointsFromXML = () => {
        const xmlToArray = (q) => {
            if (xhr.responseXML === null) {
                return [];
            }
            return Array.from(xhr.responseXML.documentElement.querySelectorAll(q));
        };
        const temperatures = xmlToArray('temperature[type="hourly"] > value')
            .map(n => parseInt(n.innerHTML));
        const dewPoints = xmlToArray('temperature[type="dew point"] > value')
            .map(n => parseInt(n.innerHTML));
        const windChills = xmlToArray('temperature[type="wind chill"] > value')
            .map(n => parseInt(n.innerHTML));
        const probabilityOfPercipitations = xmlToArray('probability-of-precipitation > value')
            .map(n => parseInt(n.innerHTML));
        const weatherConditions = xmlToArray('weather-conditions')
            .map(n => {
            var _a, _b;
            const value = n.querySelector('value');
            if (!value) {
                return {
                    type: 'none',
                    coverage: 'none',
                };
            }
            return {
                type: (_a = value.getAttribute('weather-type')) !== null && _a !== void 0 ? _a : 'none',
                coverage: (_b = value.getAttribute('coverage')) !== null && _b !== void 0 ? _b : 'none',
            };
        });
        const startTimes = xmlToArray('start-valid-time')
            .map(n => n.innerHTML);
        const endTimes = xmlToArray('end-valid-time')
            .map(n => n.innerHTML);
        return startTimes.map((startTime, i) => ({
            startTime,
            endTime: endTimes[i],
            temperature: temperatures[i],
            dewPoint: dewPoints[i],
            windChill: windChills[i],
            probabilityOfPercipitation: probabilityOfPercipitations[i],
            weatherCondition: weatherConditions[i],
        }));
    };
    const getLatitudeAndLongitude = () => {
        var _a, _b;
        const queryParameters = new URLSearchParams(window.location.search);
        const lat = parseFloat((_a = queryParameters.get('lat')) !== null && _a !== void 0 ? _a : '');
        const lon = parseFloat((_b = queryParameters.get('lon')) !== null && _b !== void 0 ? _b : '');
        return [
            !isNaN(lat) ? lat : 41.9536,
            !isNaN(lon) ? lon : -87.7117,
        ];
    };
    const [latitude, longitude] = getLatitudeAndLongitude();
    xhr.open('GET', `https://forecast.weather.gov/MapClick.php?lat=${latitude}&lon=${longitude}&FcstType=digitalDWML`, true);
    xhr.responseType = 'document';
    xhr.send();
    return promise;
};
//# sourceMappingURL=weatherGovApi.js.map