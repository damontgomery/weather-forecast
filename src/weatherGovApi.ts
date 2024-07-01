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
  weatherCondition: {
    type: string
    coverage: string
  }
}

const getForecastPointsFromXML = (responseXML: Document | null): ForecastPoint[] => {
  const getElementsFromXML = (selectors: string) => {
    if (responseXML === null) {
      return []
    }
    return Array.from(responseXML.documentElement.querySelectorAll(selectors))
  }

  const temperatures = getElementsFromXML('temperature[type="hourly"] > value')
    .map(n => parseInt(n.innerHTML))

  const dewPoints = getElementsFromXML('temperature[type="dew point"] > value')
    .map(n => parseInt(n.innerHTML))
  
  const windChills = getElementsFromXML('temperature[type="wind chill"] > value')
    .map(n => parseInt(n.innerHTML))
  
  const probabilityOfPercipitations = getElementsFromXML('probability-of-precipitation > value')
    .map(n => parseInt(n.innerHTML))

  const weatherConditions = getElementsFromXML('weather-conditions')
    .map(n => {
      const value = n.querySelector('value')
      if (!value) {
        return {
          type: 'none',
          coverage: 'none',
        }
      }

      return {
        type: value.getAttribute('weather-type') ?? 'none',
        coverage: value.getAttribute('coverage') ?? 'none',
      }
    })

  const startTimes = getElementsFromXML('start-valid-time')
    .map(n => n.innerHTML)

  const endTimes = getElementsFromXML('end-valid-time')
    .map(n => n.innerHTML)

  return startTimes.map((startTime, i) => ({
    startTime,
    endTime: endTimes[i],
    temperature: temperatures[i],
    dewPoint: dewPoints[i],
    windChill: windChills[i],
    probabilityOfPercipitation: probabilityOfPercipitations[i],
    weatherCondition: weatherConditions[i],
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

  xhr.open('GET',`https://f1.weather.gov/MapClick.php?lat=${latitude}&lon=${longitude}&FcstType=digitalDWML`, true)
  xhr.responseType = 'document'
  xhr.send()
})
