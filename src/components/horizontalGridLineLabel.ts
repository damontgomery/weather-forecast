export const HorizontalGridLineLabel = ({
  label,
  x,
  y,
  className,
  transform = 'translate(-10, 4)',
}: {
  label: string
  x: number
  y: number
  className: string
  transform?: string
}): SVGElement => {
  const gridLineLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  gridLineLabel.setAttribute('x', `${x}`)
  gridLineLabel.setAttribute('y', `${y}`)
  gridLineLabel.setAttribute('text-anchor', 'end')
  gridLineLabel.setAttribute('transform', transform)
  gridLineLabel.innerHTML = label
  gridLineLabel.classList.add('horizontal-gridline')
  gridLineLabel.classList.add(className)

  return gridLineLabel
}
