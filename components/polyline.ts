export const Polyline = ({points, color= 'black', className}: {
  points: {x: number, y: number}[]
  color?: string
  className: string
}): SVGPolylineElement => {
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  polyline.setAttribute('points', points.filter(p => !isNaN(p.y)).map(p => `${p.x},${p.y}`).join(' '))
  polyline.setAttribute('stroke', color)
  polyline.setAttribute('fill', 'none')
  polyline.classList.add(className)

  return polyline
}
