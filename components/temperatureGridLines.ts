import { DimensionBounds, InterfaceBounds } from '../forecastUI.js'

export const TemperatureGridLines = ({
  canvasBounds,
  temperatureBounds,
}: {
  canvasBounds: InterfaceBounds
  temperatureBounds: DimensionBounds
}): SVGElement => {
  const temperatureGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  temperatureGridLines.classList.add('temperature-gridlines')

  for (let i = temperatureBounds.min; i <= temperatureBounds.max; i += 5) {
    const y = canvasBounds.temperatureCanvas.y.max - canvasBounds.temperatureCanvas.y.length * ((i - temperatureBounds.min) / (temperatureBounds.max - temperatureBounds.min))

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', `${canvasBounds.temperatureCanvas.x.min}`)
    line.setAttribute('y1', `${y}`)
    line.setAttribute('x2', `${canvasBounds.temperatureCanvas.x.max}`)
    line.setAttribute('y2', `${y}`)
    line.classList.add('horizontal-gridline')
    line.classList.add('temperature')
    temperatureGridLines.appendChild(line)

    const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    axisLabel.setAttribute('x', `${canvasBounds.temperatureCanvas.x.min}`)
    axisLabel.setAttribute('y', `${y}`)
    axisLabel.setAttribute('text-anchor', 'end')
    axisLabel.setAttribute('transform', 'translate(-10, 4)')
    axisLabel.innerHTML = `${i}°`
    axisLabel.classList.add('horizontal-gridline')
    axisLabel.classList.add('temperature')
    temperatureGridLines.appendChild(axisLabel)

    // Add another in the middle.
    const middleLabel = axisLabel.cloneNode(true) as SVGAElement
    middleLabel.setAttribute('x', `${canvasBounds.temperatureCanvas.x.min + 0.5 * canvasBounds.temperatureCanvas.x.length}`)
    middleLabel.setAttribute('transform', 'translate(0, 4)')
    temperatureGridLines.appendChild(middleLabel)
  }

  return temperatureGridLines
}
