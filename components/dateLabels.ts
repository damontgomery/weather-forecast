import { ForecastPoint } from '../weatherGovApi.js'
import { InterfaceBounds } from '../forecastUI.js'

export const DateLabels = ({
  forecastPoints,
  canvasBounds
}: {
  forecastPoints: ForecastPoint[]
  canvasBounds: InterfaceBounds
}): SVGElement => {
  const dateLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  dateLabels.classList.add('date-labels')
  
  const startTime = new Date(forecastPoints[0].startTime)
  const startTimeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  startTimeLabel.setAttribute('x', `${canvasBounds.temperatureCanvas.x.min}`)
  startTimeLabel.setAttribute('y', `${canvasBounds.temperatureCanvas.y.min}`)
  startTimeLabel.setAttribute('text-anchor', 'start')
  startTimeLabel.setAttribute('transform', 'translate(0, -18)')
  startTimeLabel.innerHTML = startTime.toLocaleString('en-US', {weekday: 'long', month: '2-digit', day: 'numeric'})
  startTimeLabel.classList.add('date-label')
  startTimeLabel.classList.add('start')
  dateLabels.appendChild(startTimeLabel)

  const endTime = new Date(forecastPoints[forecastPoints.length - 1].endTime)
  const endTimeLabel = startTimeLabel.cloneNode(true) as SVGAElement
  endTimeLabel.setAttribute('text-anchor', 'end')
  endTimeLabel.setAttribute('transform', `translate(${canvasBounds.temperatureCanvas.x.length}, -18)`)
  endTimeLabel.innerHTML = endTime.toLocaleString('en-US', {weekday: 'long', month: '2-digit', day: 'numeric'})
  endTimeLabel.classList.add('end')
  dateLabels.appendChild(endTimeLabel)

  return dateLabels
}
