import { ForecastPoint } from '../weatherGovApi.js'
import { CanvasBounds } from '../app.js'

const TimeGridline = ({
  x,
  yMin,
  yMax,
  hours,
  className,
}: {
  x: number
  yMin: number
  yMax: number
  hours: number
  className: string
}): SVGElement => {
  const gridline = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  gridline.setAttribute('x1', `${x}`)
  gridline.setAttribute('y1', `${yMin}`)
  gridline.setAttribute('x2', `${x}`)
  gridline.setAttribute('y2', `${yMax}`)
  gridline.classList.add('vertical-gridline')
  gridline.classList.add(className)
  if (hours == 0) {
    gridline.classList.add('midnight')
  }

  return gridline
}

export const TimeGridLines = ({
  forecastPoints,
  globalCanvasBounds,
  temperatureCanvasBounds,
  precipitationCanvasBounds,
}: {
  forecastPoints: ForecastPoint[]
  globalCanvasBounds: CanvasBounds
  temperatureCanvasBounds: CanvasBounds
  precipitationCanvasBounds: CanvasBounds
}): SVGElement => {
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

    const x = temperatureCanvasBounds.x.min + temperatureCanvasBounds.x.length * (i / (forecastPoints.length - 1))

    timeGridLines.appendChild(TimeGridline({
      x,
      yMin: temperatureCanvasBounds.y.min,
      yMax: temperatureCanvasBounds.y.max,
      hours: startTime.getHours(),
      className: 'temperature',
    }))

    timeGridLines.appendChild(TimeGridline({
      x,
      yMin: precipitationCanvasBounds.y.min,
      yMax: precipitationCanvasBounds.y.max,
      hours: startTime.getHours(),
      className: 'precipitation',
    }))

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', `${x}`)
    text.setAttribute('y', `${globalCanvasBounds.y.max * (2/3)}`)
    text.setAttribute('text-anchor', 'end')
    text.setAttribute('transform', `rotate(-90 ${x} ${globalCanvasBounds.y.max * (2/3)}) translate(30, 5)`)
    text.innerHTML = startTime.toLocaleString('en-US', {hour: 'numeric', hour12: true})
    text.classList.add('vertical-gridline')
    timeGridLines.appendChild(text)
  })

  return timeGridLines
}
