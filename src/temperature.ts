import { ForecastPoint } from './weatherGovApi.js'

export const temperatureUnits = ['f', 'c'] as const
export type TemperatureUnit = typeof temperatureUnits[number]

export const isTemperatureUnit = (unit: string): unit is TemperatureUnit => temperatureUnits.includes(unit as TemperatureUnit)

const getTemperatureUnitFromQuery = (): TemperatureUnit | null => {
  const queryParameters = new URLSearchParams(window.location.search)
  const tUnitQueryParameter = queryParameters.get('tUnit')

  if (tUnitQueryParameter === null ) {
    return null
  }

  if (isTemperatureUnit(tUnitQueryParameter) === false) {
    return null
  }

  return tUnitQueryParameter
}

export const getTemperatureUnit = () => getTemperatureUnitFromQuery() ?? 'f'

export const convertFahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * (5 / 9)

export const convertForecastPointsToTemperatureUnit = ({
  forecastPoints,
  temperatureUnit,
}: {
  forecastPoints: ForecastPoint[],
  temperatureUnit: TemperatureUnit,
}): ForecastPoint[] => forecastPoints.map(forecastPoint => {
  if (temperatureUnit === 'f') {
    return forecastPoint
  }

  return {
    ...forecastPoint,
    temperature: convertFahrenheitToCelsius(forecastPoint.temperature),
    dewPoint: convertFahrenheitToCelsius(forecastPoint.dewPoint),
    windChill: convertFahrenheitToCelsius(forecastPoint.windChill),
  }
})