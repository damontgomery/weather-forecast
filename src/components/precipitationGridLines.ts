import { InterfaceBounds } from '../forecastUI.js'
import { precipitationCoverageLabelToValueMap } from './precipitation.js'

export const PrecipitationGridLines = ({
  canvasBounds,
}: {
  canvasBounds: InterfaceBounds
}): SVGElement => {
  const precipitationGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  precipitationGridLines.classList.add('precipitation-gridlines')

  Array.from(precipitationCoverageLabelToValueMap.entries()).forEach(([_, coverageValue]) => {
    const y = canvasBounds.precipitationCanvas.y.max - canvasBounds.precipitationCanvas.y.length * (coverageValue.value / (precipitationCoverageLabelToValueMap.size - 1))

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', `${canvasBounds.precipitationCanvas.x.min}`)
    line.setAttribute('y1', `${y}`)
    line.setAttribute('x2', `${canvasBounds.precipitationCanvas.x.max}`)
    line.setAttribute('y2', `${y}`)
    line.classList.add('horizontal-gridline')
    line.classList.add('precipitation')
    precipitationGridLines.appendChild(line)

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', `${canvasBounds.precipitationCanvas.x.min}`)
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
