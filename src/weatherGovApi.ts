import { GeoLocation } from './location.js'

export interface WeatherCondition {
  type: string
  coverage: string
}

// @todo set the temperatures as optional so we can handle those better.
export interface ForecastPoint {
  startTime: string
  endTime: string
  temperature: number
  dewPoint: number
  windChill: number
  probabilityOfPercipitation: number
  weatherConditions: WeatherCondition[]
}

const getForecastPointsFromXML = (responseXML: Document | null): ForecastPoint[] => {
  const getElementsFromXML = (selectors: string) => {
    if (responseXML === null) {
      return []
    }
    return Array.from(responseXML.documentElement.querySelectorAll(selectors))
  }

  const temperatures = getElementsFromXML('temperature[type="hourly"] > value')
    .map(element => parseInt(element.innerHTML))

  const dewPoints = getElementsFromXML('temperature[type="dew point"] > value')
    .map(element => parseInt(element.innerHTML))
  
  const windChills = getElementsFromXML('temperature[type="wind chill"] > value')
    .map(element => parseInt(element.innerHTML))
  
  const probabilityOfPercipitations = getElementsFromXML('probability-of-precipitation > value')
    .map(element => parseInt(element.innerHTML))

  const weatherConditions: WeatherCondition[][] = getElementsFromXML('weather-conditions')
    .map(element => {
      const values = element.querySelectorAll('value')
      if (!values) {
        return [
          {
            type: 'none',
            coverage: 'none',
          },
        ]
      }

      return Array.from(values).map(value => ({
        type: value.getAttribute('weather-type') ?? 'none',
        coverage: value.getAttribute('coverage') ?? 'none',
      }))
    })

  const startTimes = getElementsFromXML('start-valid-time')
    .map(element => element.innerHTML)

  const endTimes = getElementsFromXML('end-valid-time')
    .map(element => element.innerHTML)

  return startTimes.map((startTime, index) => ({
    startTime,
    endTime: endTimes[index],
    temperature: temperatures[index],
    dewPoint: dewPoints[index],
    windChill: windChills[index],
    probabilityOfPercipitation: probabilityOfPercipitations[index],
    weatherConditions: weatherConditions[index],
  }))
}

export const fetchWeatherForecastData = ({latitude, longitude}: GeoLocation) => new Promise<ForecastPoint[]>((resolve, reject) => {
  const xhr = new XMLHttpRequest()

  xhr.onload = () => {
    resolve(getForecastPointsFromXML(xhr.responseXML))
  }

  xhr.onerror = () => {
    reject(new Error('Failed to load weather forecast data.'))
  }

  xhr.onabort = () => {
    reject(new Error('Aborted loading weather forecast data.'))
  }

  xhr.ontimeout = () => {
    reject(new Error('Timed out loading weather forecast data.'))
  }

  xhr.open('GET',`https://forecast.weather.gov/MapClick.php?lat=${latitude}&lon=${longitude}&FcstType=digitalDWML`, true)
  xhr.responseType = 'document'
  xhr.send()
})
