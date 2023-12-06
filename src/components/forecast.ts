import { CanvasBounds, DimensionBounds } from '../app.js'
import { ForecastPoint } from '../weatherGovApi.js'
import { DateLabels } from './dateLabels.js'
import { TimeGridLines } from './timeGridLines.js'
import { TemperatureGridLines } from './temperatureGridLines.js'
import { TemperatureLine } from './temperatureLine.js'
import { PrecipitationGridLines } from './precipitationGridLines.js'
import { PrecipitationLine } from './precipitationLine.js'
import { Legend } from './legend.js'

export interface DividedCanvasBounds {
  global: CanvasBounds
  temperatureCanvas: CanvasBounds
  precipitationCanvas: CanvasBounds
  canvasPadding: number
}

const getTemperatureBounds = (forecastPoints: ForecastPoint[]): DimensionBounds => {
  const temperatures = [
    ...forecastPoints.map(forecastPoint => forecastPoint.temperature),
    ...forecastPoints.map(forecastPoint => forecastPoint.dewPoint),
    ...forecastPoints.map(forecastPoint => forecastPoint.windChill),
  ].filter(n => !isNaN(n))

  const minTemperature = Math.min(...temperatures)
  const maxTemperature = Math.max(...temperatures)

  const chartGridlineSpacing = 5
  const chartMaxTemperature = Math.round(maxTemperature / chartGridlineSpacing) * chartGridlineSpacing + chartGridlineSpacing
  const chartMinTemperature = Math.round(minTemperature / chartGridlineSpacing) * chartGridlineSpacing - chartGridlineSpacing

  return {
    max: chartMaxTemperature,
    min: chartMinTemperature,
    length: chartMaxTemperature - chartMinTemperature,
  }
}

export const Forecast = ({
  forecastPoints,
  globalCanvasBounds,
}: {
  forecastPoints: ForecastPoint[]
  globalCanvasBounds: CanvasBounds
}): SVGElement => {
  const forecast = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  forecast.setAttribute('class', 'forecast')
  
  if (forecastPoints.length === 0) {
    return forecast
  }

  const canvasPadding = 25

  // Temperature canvas takes up top 2/3 of screen.
  const temperatureCanvasHeightPercent = 2 / 3
  
  const temperatureCanvasBounds: CanvasBounds = {
    x: {
      min: canvasPadding,
      max: globalCanvasBounds.x.max - canvasPadding,
      length: globalCanvasBounds.x.max - (canvasPadding * 2),
    },
    y: {
      min: canvasPadding,
      max: (globalCanvasBounds.y.max * temperatureCanvasHeightPercent) - canvasPadding,
      length: (globalCanvasBounds.y.max * temperatureCanvasHeightPercent) - (canvasPadding * 2),
    },
  }

  const precipitationCanvasBounds: CanvasBounds = {
    x: {
      min: canvasPadding,
      max: globalCanvasBounds.x.max - canvasPadding,
      length: globalCanvasBounds.x.max - (canvasPadding * 2),
    },
    y: {
      min: (globalCanvasBounds.y.max * temperatureCanvasHeightPercent) + canvasPadding,
      max: globalCanvasBounds.y.max - canvasPadding,
      length: (globalCanvasBounds.y.max * (1 - temperatureCanvasHeightPercent)) - (canvasPadding * 2),
    },
  }

  const temperatureBounds = getTemperatureBounds(forecastPoints)

  forecast.appendChild(DateLabels({
    forecastPoints,
    canvasBounds: temperatureCanvasBounds,
  }))
  forecast.appendChild(TimeGridLines({
    forecastPoints,
    globalCanvasBounds,
    temperatureCanvasBounds,
    precipitationCanvasBounds,
  }))
  forecast.appendChild(TemperatureGridLines({
    canvasBounds: temperatureCanvasBounds,
    temperatureBounds,
  }))
  forecast.appendChild(TemperatureLine({
    propertyName: 'temperature',
    className: 'temperature',
    forecastPoints,
    canvasBounds: temperatureCanvasBounds,
    temperatureBounds,
  }))
  forecast.appendChild(TemperatureLine({
    propertyName: 'dewPoint',
    className: 'dew-point',
    forecastPoints,
    canvasBounds: temperatureCanvasBounds,
    temperatureBounds,
  }))
  forecast.appendChild(TemperatureLine({
    propertyName: 'windChill',
    className: 'wind-chill',
    forecastPoints,
    canvasBounds: temperatureCanvasBounds,
    temperatureBounds,
  }))
  forecast.appendChild(PrecipitationGridLines({canvasBounds: precipitationCanvasBounds}))
  forecast.appendChild(PrecipitationLine({
    propertyName: 'snow',
    className: 'snow',
    forecastPoints,
    canvasBounds: precipitationCanvasBounds,
  }))
  forecast.appendChild(PrecipitationLine({
    propertyName: 'rain',
    className: 'rain',
    forecastPoints,
    canvasBounds: precipitationCanvasBounds,
  }))
  forecast.appendChild(Legend({
    canvasBounds: globalCanvasBounds,
    canvasPadding,
  }))

  return forecast
}
