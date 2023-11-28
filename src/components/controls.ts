import { InterfaceBounds } from "../forecastUI.js"

export const Controls = ({
  canvasBounds,
  previousScreenHandler,
  nextScreenHandler,
  zoomOutScreenHandler,
  zoomInScreenHandler,
}: {
  canvasBounds: InterfaceBounds
  previousScreenHandler: () => void
  nextScreenHandler: () => void
  zoomOutScreenHandler: () => void
  zoomInScreenHandler: () => void
}): SVGElement => {
  const controls = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  controls.classList.add('buttons')
  
  const leftButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  leftButton.setAttribute('points', `0,0 ${canvasBounds.global.x.max / 2},${canvasBounds.global.y.max / 2} 0,${canvasBounds.global.y.max}`)
  leftButton.classList.add('button')
  leftButton.classList.add('previous')
  leftButton.addEventListener('click', previousScreenHandler)
  controls.appendChild(leftButton)

  const rightButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  rightButton.setAttribute('points', `${canvasBounds.global.x.max},0 ${canvasBounds.global.x.max / 2},${canvasBounds.global.y.max / 2} ${canvasBounds.global.x.max},${canvasBounds.global.y.max}`)
  rightButton.classList.add('button')
  rightButton.classList.add('next')
  rightButton.addEventListener('click', nextScreenHandler)
  controls.appendChild(rightButton)

  const zoomOutButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  zoomOutButton.setAttribute('points', `0,${canvasBounds.global.y.max} ${canvasBounds.global.x.max / 2},${canvasBounds.global.y.max / 2} ${canvasBounds.global.x.max},${canvasBounds.global.y.max}`)
  zoomOutButton.classList.add('button')
  zoomOutButton.classList.add('zoom-out')
  zoomOutButton.addEventListener('click', zoomOutScreenHandler)
  controls.appendChild(zoomOutButton)

  const zoomInButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  zoomInButton.setAttribute('points', `0,0 ${canvasBounds.global.x.max / 2},${canvasBounds.global.y.max / 2} ${canvasBounds.global.x.max},0`)
  zoomInButton.classList.add('button')
  zoomInButton.classList.add('zoom-in')
  zoomInButton.addEventListener('click', zoomInScreenHandler)
  controls.appendChild(zoomInButton)

  return controls
}
