import { ForecastPoint } from '../weatherGovApi.js'
import { InterfaceBounds } from '../forecastUI.js'
import { Polyline } from './polyline.js'
import { PrecipitationCoverageValue, precipitationCoverageLabelToValueMap } from './precipitation.js'

export const PrecipitationLine = ({
  propertyName,
  className,
  forecastPoints,
  canvasBounds,
}:{
  propertyName: string
  className: string
  forecastPoints: ForecastPoint[]
  canvasBounds: InterfaceBounds
}): SVGPolylineElement => Polyline({
  points: forecastPoints.map((forecastPoint, i) => {
    const weatherCondition = forecastPoint.weatherCondition

    let value = 0;

    if (
      weatherCondition.type === propertyName &&
      precipitationCoverageLabelToValueMap.has(weatherCondition.coverage)
    ) {
      value = (precipitationCoverageLabelToValueMap.get(weatherCondition.coverage) as PrecipitationCoverageValue).value
    }
    
    return {
      x: canvasBounds.precipitationCanvas.x.min + canvasBounds.precipitationCanvas.x.length * (i / (forecastPoints.length - 1)),
      y: canvasBounds.precipitationCanvas.y.max - canvasBounds.precipitationCanvas.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1))
    }
  }),
  className
})
