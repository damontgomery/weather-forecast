import { InterfaceBounds } from "../forecastUI.js"

type Coordinate = [number, number]

const ControlButton = ({
  points,
  className,
  clickHandler,
}: {
  points: Coordinate[]
  className: string
  clickHandler: () => void
}) => {
  const button = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  button.setAttribute('points', points.map(point => point.join(',')).join(' '))
  button.classList.add('button')
  button.classList.add(className)
  button.addEventListener('click', clickHandler)

  return button
}

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

  const centerPoint: Coordinate = [
    canvasBounds.global.x.max / 2,
    canvasBounds.global.y.max / 2,
  ]

  controls.appendChild(ControlButton({
    points: [
      [0, 0],
      centerPoint,
      [0, canvasBounds.global.y.max],
    ],
    className: 'previous',
    clickHandler: previousScreenHandler,
  }))

  controls.appendChild(ControlButton({
    points: [
      [canvasBounds.global.x.max, 0],
      centerPoint,
      [canvasBounds.global.x.max, canvasBounds.global.y.max],
    ],
    className: 'next',
    clickHandler: nextScreenHandler,
  }))

  controls.appendChild(ControlButton({
    points: [
      [0, canvasBounds.global.y.max],
      centerPoint,
      [canvasBounds.global.x.max, canvasBounds.global.y.max],
    ],
    className: 'zoom-out',
    clickHandler: zoomOutScreenHandler,
  }))

  controls.appendChild(ControlButton({
    points: [
      [0, 0],
      centerPoint,
      [canvasBounds.global.x.max, 0],
    ],
    className: 'zoom-in',
    clickHandler: zoomInScreenHandler,
  }))

  return controls
}
