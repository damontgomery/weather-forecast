export const HorizontalGridLine = ({
  xMin,
  xMax,
  y,
  className,
}: {
  xMin: number
  xMax: number
  y: number
  className: string
}): SVGElement => {
  const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  gridLine.setAttribute('x1', `${xMin}`)
  gridLine.setAttribute('y1', `${y}`)
  gridLine.setAttribute('x2', `${xMax}`)
  gridLine.setAttribute('y2', `${y}`)
  gridLine.classList.add('horizontal-gridline')
  gridLine.classList.add(className)

  return gridLine
}
