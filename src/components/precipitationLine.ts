import { ForecastPoint } from '../weatherGovApi.js'
import { CanvasBounds } from '../app.js'
import { Polyline } from './polyline.js'
import { PrecipitationCoverageValue, precipitationCoverageLabelToValueMap } from '../precipitation.js'

export const PrecipitationLine = ({
  propertyName,
  className,
  forecastPoints,
  canvasBounds,
}:{
  propertyName: string
  className: string
  forecastPoints: ForecastPoint[]
  canvasBounds: CanvasBounds
}): SVGPolylineElement => Polyline({
  points: forecastPoints.map((forecastPoint, i) => {
    const weatherConditions = forecastPoint.weatherConditions

    let value = 0;

    weatherConditions.forEach(weatherCondition => {
      if (
        weatherCondition.type === propertyName &&
        precipitationCoverageLabelToValueMap.has(weatherCondition.coverage)
      ) {
        value = (precipitationCoverageLabelToValueMap.get(weatherCondition.coverage) as PrecipitationCoverageValue).value
      }
    })
    
    return {
      x: canvasBounds.x.min + canvasBounds.x.length * (i / (forecastPoints.length - 1)),
      y: canvasBounds.y.max - canvasBounds.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1))
    }
  }),
  className
})
