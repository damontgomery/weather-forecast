import { DimensionBounds, CanvasBounds } from '../app.js'
import { ForecastPoint } from '../weatherGovApi.js'
import { DividedCanvasBounds } from './forecast.js'
import { Polyline } from './polyline.js'

export const TemperatureLine = ({
  propertyName,
  className,
  forecastPoints,
  canvasBounds,
  temperatureBounds,
}:{
  propertyName: string
  className: string
  forecastPoints: ForecastPoint[]
  canvasBounds: CanvasBounds
  temperatureBounds: DimensionBounds
}): SVGPolylineElement => Polyline({
  points: forecastPoints.map((forecastPoint, i) => ({
    x: canvasBounds.x.min + canvasBounds.x.length * (i / (forecastPoints.length - 1)),
    // @ts-ignore
    y: canvasBounds.y.max - canvasBounds.y.length * ((forecastPoint[propertyName] - temperatureBounds.min) / temperatureBounds.length)
  })),
  className
})
