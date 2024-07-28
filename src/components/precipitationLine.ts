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
}): SVGPolylineElement => {
  const pointValues = forecastPoints.map((forecastPoint) => {
    const condition = forecastPoint.weatherConditions
      .find(weatherCondition => 
        weatherCondition.type === propertyName &&
        precipitationCoverageLabelToValueMap.has(weatherCondition.coverage)
      )
    
    return condition?.coverage ? (precipitationCoverageLabelToValueMap.get(condition.coverage) as PrecipitationCoverageValue).value : 0
  })

  // We don't want to draw the line if there are no values.
  const points: {x: number, y: number }[] = pointValues.filter(value => value > 0).length > 0
    ? pointValues.map((value, i) => ({
      x: canvasBounds.x.min + canvasBounds.x.length * (i / (forecastPoints.length - 1)),
      y: canvasBounds.y.max - canvasBounds.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1)),
    }))
    : []

  return Polyline({
    points,
    className,
  })
}
