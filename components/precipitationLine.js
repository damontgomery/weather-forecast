import { Polyline } from './polyline.js';
import { precipitationCoverageLabelToValueMap } from './precipitation.js';
export const PrecipitationLine = ({ propertyName, className, forecastPoints, canvasBounds, }) => Polyline({
    points: forecastPoints.map((forecastPoint, i) => {
        const weatherCondition = forecastPoint.weatherCondition;
        let value = 0;
        if (weatherCondition.type === propertyName &&
            precipitationCoverageLabelToValueMap.has(weatherCondition.coverage)) {
            value = precipitationCoverageLabelToValueMap.get(weatherCondition.coverage).value;
        }
        return {
            x: canvasBounds.precipitationCanvas.x.min + canvasBounds.precipitationCanvas.x.length * (i / (forecastPoints.length - 1)),
            y: canvasBounds.precipitationCanvas.y.max - canvasBounds.precipitationCanvas.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1))
        };
    }),
    className
});
//# sourceMappingURL=precipitationLine.js.map