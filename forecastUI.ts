import { ForecastPoint } from './weatherGovApi.js'

interface DimensionBounds {
  min: number
  max: number
  length: number
}

interface CanvasBounds {
  x: DimensionBounds
  y: DimensionBounds
}
interface Bounds {
  global: CanvasBounds
  temperatureCanvas: CanvasBounds
  precipitationCanvas: CanvasBounds
  canvasPadding: number
}

const getBounds = (): Bounds => {
  const global = {
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

  const canvasPadding = 50

  // Temperature canvas takes up top 2/3 of screen.
  const temperatureCanvasHeightPercent = 2 / 3
  
  const temperatureCanvas = {
    x: {
      min: canvasPadding,
      max: global.x.max - canvasPadding,
      length: global.x.max - (canvasPadding * 2),
    },
    y: {
      min: canvasPadding,
      max: (global.y.max * temperatureCanvasHeightPercent) - canvasPadding,
      length: (global.y.max * temperatureCanvasHeightPercent) - (canvasPadding * 2),
    },
  }

  const precipitationCanvas = {
    x: {
      min: canvasPadding,
      max: global.x.max - canvasPadding,
      length: global.x.max - (canvasPadding * 2),
    },
    y: {
      min: (global.y.max * temperatureCanvasHeightPercent) + canvasPadding,
      max: global.y.max - canvasPadding,
      length: (global.y.max * (1 - temperatureCanvasHeightPercent)) - (canvasPadding * 2),
    },
  }

  return {
    global,
    temperatureCanvas,
    precipitationCanvas,
    canvasPadding,
  }
}

const getChartTemperatureBounds = (forecastPoints: ForecastPoint[]): DimensionBounds => {
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

export function drawInterface ({
  screenElement,
  forecastPoints,
  previousScreenHandler = () => {},
  nextScreenHandler = () => {},
  zoomOutScreenHandler = () => {},
  zoomInScreenHandler = () => {},
}: {
  screenElement?: HTMLElement  
  forecastPoints: ForecastPoint[]
  previousScreenHandler?: () => void
  nextScreenHandler?: () => void
  zoomOutScreenHandler?: () => void
  zoomInScreenHandler?: () => void
}) {
  
  if (!screenElement) {
    return
  }

  // clear existing svg.
  screenElement.innerHTML = ''
  
  if (forecastPoints.length === 0) {
    return
  }

  const bounds = getBounds()

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('viewBox', `0 0 ${bounds.global.x.max} ${bounds.global.y.max}`)

  const getDateLabels = (forecastPoints: ForecastPoint[]): SVGElement => {
    const dateLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    dateLabels.classList.add('date-labels')
    
    const startTime = new Date(forecastPoints[0].startTime)
    const startTimeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    startTimeLabel.setAttribute('x', `${bounds.temperatureCanvas.x.min}`)
    startTimeLabel.setAttribute('y', `${bounds.temperatureCanvas.y.min}`)
    startTimeLabel.setAttribute('text-anchor', 'start')
    startTimeLabel.setAttribute('transform', 'translate(0, -18)')
    startTimeLabel.innerHTML = startTime.toLocaleString('en-US', {weekday: 'long', month: '2-digit', day: 'numeric'})
    startTimeLabel.classList.add('date-label')
    startTimeLabel.classList.add('start')
    dateLabels.appendChild(startTimeLabel)

    const endTime = new Date(forecastPoints[forecastPoints.length - 1].endTime)
    const endTimeLabel = startTimeLabel.cloneNode(true) as SVGAElement
    endTimeLabel.setAttribute('text-anchor', 'end')
    endTimeLabel.setAttribute('transform', `translate(${bounds.temperatureCanvas.x.length}, -18)`)
    endTimeLabel.innerHTML = endTime.toLocaleString('en-US', {weekday: 'long', month: '2-digit', day: 'numeric'})
    endTimeLabel.classList.add('end')
    dateLabels.appendChild(endTimeLabel)

    return dateLabels
  }

  svg.appendChild(getDateLabels(forecastPoints))

  const getTimeGridLines = (forecastPoints: ForecastPoint[]): SVGElement => {
    const timeGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    timeGridLines.classList.add('time-gridlines')

    forecastPoints.forEach((forecastPoint, i) => {
      const startTime = new Date(forecastPoint.startTime)

      let labelGap = Math.ceil(forecastPoints.length / 8)

      // This seems to work once we get really zoomed out.
      if (labelGap > 12) {
        labelGap = 24
      }
      else if (labelGap > 6) {
        labelGap = 12
      }

      const shouldDrawLabel = (
        i == 0 ||
        i == forecastPoints.length - 1 ||
        startTime.getHours() % labelGap == 0
      )

      if (!shouldDrawLabel) {
        return
      }

      const x = bounds.temperatureCanvas.x.min + bounds.temperatureCanvas.x.length * (i / (forecastPoints.length - 1))

      const temperatureGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      temperatureGridline.setAttribute('x1', `${x}`)
      temperatureGridline.setAttribute('y1', `${bounds.temperatureCanvas.y.min}`)
      temperatureGridline.setAttribute('x2', `${x}`)
      temperatureGridline.setAttribute('y2', `${bounds.temperatureCanvas.y.max}`)
      temperatureGridline.classList.add('vertical-gridline')
      temperatureGridline.classList.add('temperature')
      timeGridLines.appendChild(temperatureGridline)

      const precipitationGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      precipitationGridline.setAttribute('x1', `${x}`)
      precipitationGridline.setAttribute('y1', `${bounds.precipitationCanvas.y.min}`)
      precipitationGridline.setAttribute('x2', `${x}`)
      precipitationGridline.setAttribute('y2', `${bounds.precipitationCanvas.y.max}`)
      precipitationGridline.classList.add('vertical-gridline')
      precipitationGridline.classList.add('precipitation')
      timeGridLines.appendChild(precipitationGridline)

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', `${x}`)
      text.setAttribute('y', `${bounds.global.y.max * (2/3)}`)
      text.setAttribute('text-anchor', 'end')
      text.setAttribute('transform', `rotate(-90 ${x} ${bounds.global.y.max * (2/3)}) translate(30, 5)`)
      text.innerHTML = startTime.toLocaleString('en-US', {hour: 'numeric', hour12: true})
      text.classList.add('vertical-gridline')
      timeGridLines.appendChild(text)
    })

    return timeGridLines
  }

  svg.appendChild(getTimeGridLines(forecastPoints))

  const chartTemperatureBounds = getChartTemperatureBounds(forecastPoints)

  const getTemperatureGridLines = (forecastPoints: ForecastPoint[]): SVGElement => {
    const temperatureGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    temperatureGridLines.classList.add('temperature-gridlines')

    for (let i = chartTemperatureBounds.min; i <= chartTemperatureBounds.max; i += 5) {
      const y = bounds.temperatureCanvas.y.max - bounds.temperatureCanvas.y.length * ((i - chartTemperatureBounds.min) / (chartTemperatureBounds.max - chartTemperatureBounds.min))

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', `${bounds.temperatureCanvas.x.min}`)
      line.setAttribute('y1', `${y}`)
      line.setAttribute('x2', `${bounds.temperatureCanvas.x.max}`)
      line.setAttribute('y2', `${y}`)
      line.classList.add('horizontal-gridline')
      line.classList.add('temperature')
      temperatureGridLines.appendChild(line)

      const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      axisLabel.setAttribute('x', `${bounds.temperatureCanvas.x.min}`)
      axisLabel.setAttribute('y', `${y}`)
      axisLabel.setAttribute('text-anchor', 'end')
      axisLabel.setAttribute('transform', 'translate(-10, 4)')
      axisLabel.innerHTML = `${i}°`
      axisLabel.classList.add('horizontal-gridline')
      axisLabel.classList.add('temperature')
      temperatureGridLines.appendChild(axisLabel)

      // Add another in the middle.
      const middleLabel = axisLabel.cloneNode(true) as SVGAElement
      middleLabel.setAttribute('x', `${bounds.temperatureCanvas.x.min + 0.5 * bounds.temperatureCanvas.x.length}`)
      middleLabel.setAttribute('transform', 'translate(0, 4)')
      temperatureGridLines.appendChild(middleLabel)
    }

    return temperatureGridLines
  }

  svg.appendChild(getTemperatureGridLines(forecastPoints))

  const getPolyline = ({points, color= 'black', className}: {
    points: {x: number, y: number}[]
    color?: string
    className: string
  }): SVGPolylineElement => {
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
    polyline.setAttribute('points', points.filter(p => !isNaN(p.y)).map(p => `${p.x},${p.y}`).join(' '))
    polyline.setAttribute('stroke', color)
    polyline.setAttribute('fill', 'none')
    polyline.classList.add(className)

    return polyline
  }

  const getTemperatureLine = ({propertyName, className}:{
    propertyName: string
    className: string
  }): SVGPolylineElement => getPolyline({
    points: forecastPoints.map((forecastPoint, i) => ({
      x: bounds.temperatureCanvas.x.min + bounds.temperatureCanvas.x.length * (i / (forecastPoints.length - 1)),
      // @ts-ignore
      y: bounds.temperatureCanvas.y.max - bounds.temperatureCanvas.y.length * ((forecastPoint[propertyName] - chartTemperatureBounds.min) / chartTemperatureBounds.length)
    })),
    className
  })

  svg.appendChild(getTemperatureLine({propertyName: 'temperature', className: 'temperature'}))
  svg.appendChild(getTemperatureLine({propertyName: 'dewPoint', className: 'dew-point'}))
  svg.appendChild(getTemperatureLine({propertyName: 'windChill', className: 'wind-chill'}))
  
  type PrecipitationCoverageRawValue = 'none' | 'slight chance' | 'chance' | 'likely' | 'occasional'

  interface PrecipitationCoverageValue {
    value: number
    shortLabel: string
  }

  const precipitationCoverageLabelToValueMap: Map<string, PrecipitationCoverageValue> = new Map([
    [
      'none', {
        value: 0,
        shortLabel: '',
      }
    ],
    [
      'slight chance', {
        value: 1,
        shortLabel: 'sch',
      }
    ],
    [
      'chance', {
        value: 2,
        shortLabel: 'cha',
      }
    ],
    [
      'likely', {
        value: 3,
        shortLabel: 'like',
      }
    ],
    [
      'occasional', {
        value: 4,
        shortLabel: 'occ',
      }
    ],
  ])

  const getPrecipitationGridLines = (forecastPoints: ForecastPoint[]): SVGElement => {
    const precipitationGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    precipitationGridLines.classList.add('precipitation-gridlines')

    Array.from(precipitationCoverageLabelToValueMap.entries()).forEach(([_, coverageValue]) => {
      const y = bounds.precipitationCanvas.y.max - bounds.precipitationCanvas.y.length * (coverageValue.value / (precipitationCoverageLabelToValueMap.size - 1))

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', `${bounds.precipitationCanvas.x.min}`)
      line.setAttribute('y1', `${y}`)
      line.setAttribute('x2', `${bounds.precipitationCanvas.x.max}`)
      line.setAttribute('y2', `${y}`)
      line.classList.add('horizontal-gridline')
      line.classList.add('precipitation')
      precipitationGridLines.appendChild(line)

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', `${bounds.precipitationCanvas.x.min}`)
      text.setAttribute('y', `${y}`)
      text.setAttribute('text-anchor', 'end')
      text.setAttribute('transform', 'translate(-10, 4)')
      text.innerHTML = coverageValue.shortLabel
      text.classList.add('horizontal-gridline')
      text.classList.add('precipitation')
      precipitationGridLines.appendChild(text)

    })

    return precipitationGridLines
  }

  svg.appendChild(getPrecipitationGridLines(forecastPoints))

  const getPrecipitationLines = (forecastPoints: ForecastPoint[]): SVGElement => {
    const precipitationLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    precipitationLines.classList.add('precipitation-lines')

    const getPrecipitationLine = ({propertyName, className}: {
      propertyName: string
      className: string
    }): SVGPolylineElement => getPolyline({
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
          x: bounds.precipitationCanvas.x.min + bounds.precipitationCanvas.x.length * (i / (forecastPoints.length - 1)),
          y: bounds.precipitationCanvas.y.max - bounds.precipitationCanvas.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1))
        }
      }),
      className
    })

    precipitationLines.appendChild(getPrecipitationLine({propertyName: 'snow', className: 'snow'}))
    precipitationLines.appendChild(getPrecipitationLine({propertyName: 'rain', className: 'rain'}))

    return precipitationLines
  }

  svg.appendChild(getPrecipitationLines(forecastPoints))

  const getLegend = (): SVGElement => {
    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    legend.classList.add('legend')
    legend.setAttribute('transform', `translate(${bounds.canvasPadding} ${bounds.global.y.max - (bounds.canvasPadding / 2) + 15})`);

    const addLegendLabel = ({label, className, offset}: {
      label: string
      className: string
      offset?: number
    }) => {
      const labelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      labelElement.innerHTML = label
      labelElement.classList.add('label')
      labelElement.classList.add(className)

      if (offset) {
        labelElement.setAttribute('transform', `translate(${offset} 0)`)
      }

      legend.appendChild(labelElement)
    }

    const legendLabelWidth = 200

    addLegendLabel({label: 'Temperature', className: 'temperature'})
    addLegendLabel({label: 'Dew Point', className: 'dew-point', offset: legendLabelWidth})
    addLegendLabel({label: 'Wind Chill', className: 'wind-chill', offset: legendLabelWidth * 2})
    addLegendLabel({label: 'Snow', className: 'snow', offset: legendLabelWidth * 3})
    addLegendLabel({label: 'Rain', className: 'rain', offset: legendLabelWidth * 4})

    return legend
  }

  svg.appendChild(getLegend())

  const getControls = (): SVGElement => {
    const controls = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    controls.classList.add('buttons')
    
    const leftButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    leftButton.setAttribute('points', `0,0 ${bounds.global.x.max / 2},${bounds.global.y.max / 2} 0,${bounds.global.y.max}`)
    leftButton.classList.add('button')
    leftButton.classList.add('previous')
    leftButton.addEventListener('click', previousScreenHandler)
    controls.appendChild(leftButton)

    const rightButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    rightButton.setAttribute('points', `${bounds.global.x.max},0 ${bounds.global.x.max / 2},${bounds.global.y.max / 2} ${bounds.global.x.max},${bounds.global.y.max}`)
    rightButton.classList.add('button')
    rightButton.classList.add('next')
    rightButton.addEventListener('click', nextScreenHandler)
    controls.appendChild(rightButton)

    const zoomOutButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    zoomOutButton.setAttribute('points', `0,${bounds.global.y.max} ${bounds.global.x.max / 2},${bounds.global.y.max / 2} ${bounds.global.x.max},${bounds.global.y.max}`)
    zoomOutButton.classList.add('button')
    zoomOutButton.classList.add('zoom-out')
    zoomOutButton.addEventListener('click', zoomOutScreenHandler)
    controls.appendChild(zoomOutButton)

    const zoomInButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
    zoomInButton.setAttribute('points', `0,0 ${bounds.global.x.max / 2},${bounds.global.y.max / 2} ${bounds.global.x.max},0`)
    zoomInButton.classList.add('button')
    zoomInButton.classList.add('zoom-in')
    zoomInButton.addEventListener('click', zoomInScreenHandler)
    controls.appendChild(zoomInButton)

    return controls
  }

  svg.appendChild(getControls())

  screenElement.appendChild(svg)
}