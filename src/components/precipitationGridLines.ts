import { CanvasBounds } from '../app.js'
import { precipitationCoverageLabelToValueMap } from '../precipitation.js'
import { HorizontalGridLine } from './horizontalGridLine.js'
import { HorizontalGridLineLabel } from './horizontalGridLineLabel.js'

export const PrecipitationGridLines = ({
  canvasBounds,
}: {
  canvasBounds: CanvasBounds
}): SVGElement => {
  const precipitationGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  precipitationGridLines.classList.add('precipitation-gridlines')

  Array.from(precipitationCoverageLabelToValueMap.entries()).forEach(([_, coverageValue]) => {
    const y = canvasBounds.y.max - canvasBounds.y.length * (coverageValue.value / (precipitationCoverageLabelToValueMap.size - 1))

    precipitationGridLines.appendChild(HorizontalGridLine({
      xMin: canvasBounds.x.min,
      xMax: canvasBounds.x.max,
      y,
      className: 'precipitation',
    }))

    precipitationGridLines.appendChild(HorizontalGridLineLabel({
      label: coverageValue.shortLabel,
      x: canvasBounds.x.min,
      y,
      className: 'precipitation',
    }))
  })

  return precipitationGridLines
}
