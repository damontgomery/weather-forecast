import { ForecastPoint } from '../weatherGovApi.js'
import { DimensionBounds, InterfaceBounds } from '../forecastUI.js'
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
  canvasBounds: InterfaceBounds
  temperatureBounds: DimensionBounds
}): SVGPolylineElement => Polyline({
  points: forecastPoints.map((forecastPoint, i) => ({
    x: canvasBounds.temperatureCanvas.x.min + canvasBounds.temperatureCanvas.x.length * (i / (forecastPoints.length - 1)),
    // @ts-ignore
    y: canvasBounds.temperatureCanvas.y.max - canvasBounds.temperatureCanvas.y.length * ((forecastPoint[propertyName] - temperatureBounds.min) / temperatureBounds.length)
  })),
  className
})
