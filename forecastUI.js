import { DateLabels } from './components/dateLabels.js';
import { TimeGridLines } from './components/timeGridLines.js';
import { TemperatureGridLines } from './components/temperatureGridLines.js';
import { TemperatureLine } from './components/temperatureLine.js';
import { PrecipitationGridLines } from './components/precipitationGridLines.js';
import { PrecipitationLine } from './components/precipitationLine.js';
import { Legend } from './components/legend.js';
import { Controls } from './components/controls.js';
const getCanvasBounds = () => {
    const global = {
        x: {
            min: 0,
            max: window.innerWidth,
            length: window.innerWidth,
        },
        y: {
            min: 0,
            max: window.innerHeight,
            length: window.innerHeight,
        },
    };
    const canvasPadding = 50;
    // Temperature canvas takes up top 2/3 of screen.
    const temperatureCanvasHeightPercent = 2 / 3;
    const temperatureCanvas = {
        x: {
            min: canvasPadding,
            max: global.x.max - canvasPadding,
            length: global.x.max - (canvasPadding * 2),
        },
        y: {
            min: canvasPadding,
            max: (global.y.max * temperatureCanvasHeightPercent) - canvasPadding,
            length: (global.y.max * temperatureCanvasHeightPercent) - (canvasPadding * 2),
        },
    };
    const precipitationCanvas = {
        x: {
            min: canvasPadding,
            max: global.x.max - canvasPadding,
            length: global.x.max - (canvasPadding * 2),
        },
        y: {
            min: (global.y.max * temperatureCanvasHeightPercent) + canvasPadding,
            max: global.y.max - canvasPadding,
            length: (global.y.max * (1 - temperatureCanvasHeightPercent)) - (canvasPadding * 2),
        },
    };
    return {
        global,
        temperatureCanvas,
        precipitationCanvas,
        canvasPadding,
    };
};
const getTemperatureBounds = (forecastPoints) => {
    const temperatures = [
        ...forecastPoints.map(forecastPoint => forecastPoint.temperature),
        ...forecastPoints.map(forecastPoint => forecastPoint.dewPoint),
        ...forecastPoints.map(forecastPoint => forecastPoint.windChill),
    ].filter(n => !isNaN(n));
    const minTemperature = Math.min(...temperatures);
    const maxTemperature = Math.max(...temperatures);
    const chartGridlineSpacing = 5;
    const chartMaxTemperature = Math.round(maxTemperature / chartGridlineSpacing) * chartGridlineSpacing + chartGridlineSpacing;
    const chartMinTemperature = Math.round(minTemperature / chartGridlineSpacing) * chartGridlineSpacing - chartGridlineSpacing;
    return {
        max: chartMaxTemperature,
        min: chartMinTemperature,
        length: chartMaxTemperature - chartMinTemperature,
    };
};
export const drawInterface = ({ screenElement, forecastPoints, previousScreenHandler = () => { }, nextScreenHandler = () => { }, zoomOutScreenHandler = () => { }, zoomInScreenHandler = () => { }, }) => {
    if (!screenElement) {
        return;
    }
    // clear existing svg.
    screenElement.innerHTML = '';
    if (forecastPoints.length === 0) {
        return;
    }
    const canvasBounds = getCanvasBounds();
    const temperatureBounds = getTemperatureBounds(forecastPoints);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${canvasBounds.global.x.max} ${canvasBounds.global.y.max}`);
    svg.appendChild(DateLabels({ forecastPoints, canvasBounds }));
    svg.appendChild(TimeGridLines({ forecastPoints, canvasBounds }));
    svg.appendChild(TemperatureGridLines({ canvasBounds, temperatureBounds }));
    svg.appendChild(TemperatureLine({
        propertyName: 'temperature',
        className: 'temperature',
        forecastPoints,
        canvasBounds,
        temperatureBounds,
    }));
    svg.appendChild(TemperatureLine({
        propertyName: 'dewPoint',
        className: 'dew-point',
        forecastPoints,
        canvasBounds,
        temperatureBounds,
    }));
    svg.appendChild(TemperatureLine({
        propertyName: 'windChill',
        className: 'wind-chill',
        forecastPoints,
        canvasBounds,
        temperatureBounds,
    }));
    svg.appendChild(PrecipitationGridLines({ canvasBounds }));
    svg.appendChild(PrecipitationLine({
        propertyName: 'snow',
        className: 'snow',
        forecastPoints,
        canvasBounds,
    }));
    svg.appendChild(PrecipitationLine({
        propertyName: 'rain',
        className: 'rain',
        forecastPoints,
        canvasBounds,
    }));
    svg.appendChild(Legend({ canvasBounds }));
    svg.appendChild(Controls({
        canvasBounds,
        previousScreenHandler,
        nextScreenHandler,
        zoomOutScreenHandler,
        zoomInScreenHandler,
    }));
    screenElement.appendChild(svg);
};
//# sourceMappingURL=forecastUI.js.map