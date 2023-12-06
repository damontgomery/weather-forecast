import { DimensionBounds } from '../app.js'
import { CanvasBounds } from '../app.js'
import { HorizontalGridLine } from './horizontalGridLine.js'
import { HorizontalGridLineLabel } from './horizontalGridLineLabel.js'

export const TemperatureGridLines = ({
  canvasBounds,
  temperatureBounds,
}: {
  canvasBounds: CanvasBounds
  temperatureBounds: DimensionBounds
}): SVGElement => {
  const temperatureGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  temperatureGridLines.classList.add('temperature-gridlines')

  for (let i = temperatureBounds.min; i <= temperatureBounds.max; i += 5) {
    const y = canvasBounds.y.max - canvasBounds.y.length * ((i - temperatureBounds.min) / (temperatureBounds.max - temperatureBounds.min))

    temperatureGridLines.appendChild(HorizontalGridLine({
      xMin: canvasBounds.x.min,
      xMax: canvasBounds.x.max,
      y,
      className: 'temperature',
    }))

    temperatureGridLines.appendChild(HorizontalGridLineLabel({
      label: `${i}°`,
      x: canvasBounds.x.min,
      y,
      className: 'temperature',
    }))

    // Add another in the middle.
    temperatureGridLines.appendChild(HorizontalGridLineLabel({
      label: `${i}°`,
      x: canvasBounds.x.min + 0.5 * canvasBounds.x.length,
      y,
      className: 'temperature',
      transform: 'translate(0, 2)',
    }))
  }

  return temperatureGridLines
}
