import { CanvasBounds } from '../app.js'

const LegendLabel = ({
  label,
  className,
  offset,
}: {
  label: string
  className: string
  offset?: number
}): SVGElement => {
  const legendLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  legendLabel.innerHTML = label
  legendLabel.classList.add('label')
  legendLabel.classList.add(className)

  if (offset) {
    legendLabel.setAttribute('transform', `translate(${offset} 0)`)
  }

  return legendLabel
}

export const Legend = ({
  canvasBounds,
  canvasPadding,
}: {
  canvasBounds: CanvasBounds
  canvasPadding: number
}): SVGElement => {
  const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  legend.classList.add('legend')
  legend.setAttribute('transform', `translate(${canvasPadding} ${canvasBounds.y.max - (canvasPadding / 2) + 15})`);

  const legendLabelWidth = 200

  legend.appendChild(LegendLabel({
    label: 'Temperature',
    className: 'temperature',
  }))
  legend.appendChild(LegendLabel({
    label: 'Dew Point',
    className: 'dew-point',
    offset: legendLabelWidth,
  }))
  legend.appendChild(LegendLabel({
    label: 'Wind Chill',
    className: 'wind-chill',
    offset: legendLabelWidth * 2,
  }))
  legend.appendChild(LegendLabel({
    label: 'Snow',
    className: 'snow',
    offset: legendLabelWidth * 3,
  }))
  legend.appendChild(LegendLabel({
    label: 'Rain',
    className: 'rain',
    offset: legendLabelWidth * 4,
  }))

  return legend
}
