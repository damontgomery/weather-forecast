import { ForecastPoint, fetchWeatherForecastData } from './weatherGovApi.js'
import { Forecast } from './components/forecast.js'
import { Controls } from './components/controls.js'
import { getGeoLocationDefault, getGeoLocationFromLocation, getGeoLocationFromURL } from './location.js'

const weatherForecastContainer = document.querySelector('weather-forecast') as HTMLElement | null
let forecastPoints: ForecastPoint[] = []
let selectedForecastPointsPerScreen = 24
let selectedScreen = 0

const getSelectedForecastPoints = () => forecastPoints
  .slice(
    selectedScreen * selectedForecastPointsPerScreen,
    (selectedScreen + 1) * selectedForecastPointsPerScreen
  )

const previousScreenHandler = () => {
  selectedScreen = Math.max(0, selectedScreen - 1)

  render()
}

const nextScreenHandler = () => {
  selectedScreen = Math.min(
    Math.floor(forecastPoints.length / selectedForecastPointsPerScreen) - 1,
    selectedScreen + 1
  )
  render()
}

// @todo can we generalize this more?
const adjustForOutOfBoundsPointsAfterZoom = () => {
  // Set out of bounds initial values.
  let projectedLastForecastedPoint = 100000
  let projectedFirstForecastedPoint = -1

  const projectForecastedPoints = () => {
    projectedLastForecastedPoint = (selectedScreen + 1) * selectedForecastPointsPerScreen
    projectedFirstForecastedPoint = projectedLastForecastedPoint - selectedForecastPointsPerScreen
  }

  projectForecastedPoints()

  while (
    projectedLastForecastedPoint > forecastPoints.length ||
    projectedFirstForecastedPoint < 0
  ) {
    selectedScreen--
    projectForecastedPoints()
  }
}

const zoomOutScreenHandler = () => {
  selectedForecastPointsPerScreen = Math.min(
    forecastPoints.length,
    selectedForecastPointsPerScreen * 2
  )

  adjustForOutOfBoundsPointsAfterZoom()

  render()
}

const zoomInScreenHandler = () => {
  selectedForecastPointsPerScreen = Math.max(
    // Min is 2 since we need to display a line, not just a point.
    2, 
    Math.floor(selectedForecastPointsPerScreen / 2)
  )

  render()
}

export interface DimensionBounds {
  min: number
  max: number
  length: number
}

export interface CanvasBounds {
  x: DimensionBounds
  y: DimensionBounds
}

const render = () => {
  if (!weatherForecastContainer) {
    return
  }

  // clear existing svg.
  weatherForecastContainer.innerHTML = ''

  const canvasBounds: CanvasBounds = {
    x: {
      min: 0,
      max: window.innerWidth,
      length: window.innerWidth,
    },
    y: {
      min: 0,
      max: window.innerHeight,
      length: window.innerHeight,
    },
  }

  const app = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  app.setAttribute('class', 'app')
  app.setAttribute('width', '100%')
  app.setAttribute('height', '100%')
  app.setAttribute('viewBox', `0 0 ${canvasBounds.x.max} ${canvasBounds.y.max}`)

  app.appendChild(Forecast({
    forecastPoints: getSelectedForecastPoints(),
    globalCanvasBounds: canvasBounds,
  }))

  app.appendChild(Controls({
    canvasBounds,
    previousScreenHandler,
    nextScreenHandler,
    zoomOutScreenHandler,
    zoomInScreenHandler,
  }))

  weatherForecastContainer.appendChild(app)
}

let geoLocation = getGeoLocationFromURL()

if (isNaN(geoLocation.latitude) || isNaN(geoLocation.longitude)) {
  getGeoLocationFromLocation()
    .then(location => {
      geoLocation = location
      init()
    })
    .catch(() => {
      geoLocation = getGeoLocationDefault()
      init()
    })
}

const init = () => {
  fetchWeatherForecastData(geoLocation).then(points => {
    forecastPoints = points
    
    render()

    window.onresize = () => {
      render()
    }
  })
}
