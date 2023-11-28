import { fetchWeatherForecastData } from './weatherGovApi.js';
import { drawInterface } from './forecastUI.js';
const weatherForecastContainer = document.querySelector('weather-forecast');
let forecastPoints = [];
let selectedForecastPointsPerScreen = 24;
let selectedScreen = 0;
const getSelectedForecastPoints = () => forecastPoints
    .slice(selectedScreen * selectedForecastPointsPerScreen, (selectedScreen + 1) * selectedForecastPointsPerScreen);
const refreshUI = () => {
    drawInterface({
        screenElement: weatherForecastContainer !== null && weatherForecastContainer !== void 0 ? weatherForecastContainer : undefined,
        forecastPoints: getSelectedForecastPoints(),
        previousScreenHandler,
        nextScreenHandler,
        zoomOutScreenHandler,
        zoomInScreenHandler,
    });
};
const previousScreenHandler = () => {
    selectedScreen = Math.max(0, selectedScreen - 1);
    refreshUI();
};
const nextScreenHandler = () => {
    selectedScreen = Math.min(Math.floor(forecastPoints.length / selectedForecastPointsPerScreen) - 1, selectedScreen + 1);
    refreshUI();
};
// @todo can we generalize this more?
const adjustForOutOfBoundsPointsAfterZoom = () => {
    // Set out of bounds initial values.
    let projectedLastForecastedPoint = 100000;
    let projectedFirstForecastedPoint = -1;
    const projectForecastedPoints = () => {
        projectedLastForecastedPoint = (selectedScreen + 1) * selectedForecastPointsPerScreen;
        projectedFirstForecastedPoint = projectedLastForecastedPoint - selectedForecastPointsPerScreen;
    };
    projectForecastedPoints();
    while (projectedLastForecastedPoint > forecastPoints.length ||
        projectedFirstForecastedPoint < 0) {
        selectedScreen--;
        projectForecastedPoints();
    }
};
const zoomOutScreenHandler = () => {
    selectedForecastPointsPerScreen = Math.min(forecastPoints.length, selectedForecastPointsPerScreen * 2);
    adjustForOutOfBoundsPointsAfterZoom();
    refreshUI();
};
const zoomInScreenHandler = () => {
    selectedForecastPointsPerScreen = Math.max(
    // Min is 2 since we need to display a line, not just a point.
    2, Math.floor(selectedForecastPointsPerScreen / 2));
    refreshUI();
};
fetchWeatherForecastData().then(points => {
    forecastPoints = points;
    refreshUI();
    window.onresize = () => {
        refreshUI();
    };
});
//# sourceMappingURL=scripts.js.map