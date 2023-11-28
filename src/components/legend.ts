import { CanvasBounds } from '../app.js'

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
