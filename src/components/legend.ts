import { CanvasBounds } from '../app.js'

const LegendLabel = ({
  label,
  className,
  index = 0,
  width,
  isLast = false,
}: {
  label: string
  className: string
  index: number
  width: number
  isLast: boolean
}): SVGElement => {
  const legendLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  legendLabel.innerHTML = label
  legendLabel.classList.add('label')
  legendLabel.classList.add(className)
  
  // Hacky, but looks OK.
  if (index === 0) {
    legendLabel.setAttribute('text-anchor', 'start')
  }
  else {
    legendLabel.setAttribute('transform', `translate(${(index + 0.5) * width} 0)`)
    legendLabel.setAttribute('text-anchor', 'middle')
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
  legend.setAttribute('transform', `translate(${canvasPadding} ${canvasBounds.y.max - (canvasPadding / 2) + 7.5})`);

  const legendLabelWidth = (canvasBounds.x.length - (2 * canvasPadding)) / 6

  new Array(
    { label: 'Temperature', className: 'temperature' },
    { label: 'Dew Point', className: 'dew-point' },
    { label: 'Wind Chill', className: 'wind-chill' },
    { label: 'Snow', className: 'snow' },
    { label: 'Rain', className: 'rain' },
    { label: 'Thunderstorms', className: 'thunderstorms' },
  ).forEach(({ label, className }, index, array) => {
    legend.appendChild(LegendLabel({
      label,
      className,
      index,
      width: legendLabelWidth,
      isLast: index === array.length - 1,
    }))
  })

  return legend
}
