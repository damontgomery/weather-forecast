export function drawInterface({ screenElement, forecastPoints, previousScreenHandler = () => { }, nextScreenHandler = () => { }, zoomOutScreenHandler = () => { }, zoomInScreenHandler = () => { }, }) {
    if (!screenElement) {
        return;
    }
    // clear existing svg.
    screenElement.innerHTML = '';
    if (forecastPoints.length === 0) {
        return;
    }
    // Set up SVG canvas
    // const getSVG = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${maxWidth} ${maxHeight}`);
    const canvasPadding = 50;
    // Temperature canvas takes up top 2/3 of screen.
    const temperatureCanvasHeightPercent = 2 / 3;
    const temperatureCanvasBounds = {
        x: {
            min: canvasPadding,
            max: maxWidth - canvasPadding,
            length: maxWidth - (canvasPadding * 2),
        },
        y: {
            min: canvasPadding,
            max: (maxHeight * temperatureCanvasHeightPercent) - canvasPadding,
            length: (maxHeight * temperatureCanvasHeightPercent) - (canvasPadding * 2),
        },
    };
    const precipitationCanvasBounds = {
        x: {
            min: canvasPadding,
            max: maxWidth - canvasPadding,
            length: maxWidth - (canvasPadding * 2),
        },
        y: {
            min: (maxHeight * temperatureCanvasHeightPercent) + canvasPadding,
            max: maxHeight - canvasPadding,
            length: (maxHeight * (1 - temperatureCanvasHeightPercent)) - (canvasPadding * 2),
        },
    };
    //   return svg
    // }
    // Draw start time.
    const timeLabels = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    timeLabels.classList.add('time-labels');
    const startTime = new Date(forecastPoints[0].startTime);
    const startTimeLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    startTimeLabel.setAttribute('x', `${temperatureCanvasBounds.x.min}`);
    startTimeLabel.setAttribute('y', `${temperatureCanvasBounds.y.min}`);
    startTimeLabel.setAttribute('text-anchor', 'start');
    startTimeLabel.setAttribute('transform', 'translate(0, -18)');
    startTimeLabel.innerHTML = startTime.toLocaleString('en-US', { weekday: 'long', month: '2-digit', day: 'numeric' });
    startTimeLabel.classList.add('time-label');
    startTimeLabel.classList.add('start');
    timeLabels.appendChild(startTimeLabel);
    const endTime = new Date(forecastPoints[forecastPoints.length - 1].endTime);
    const endTimeLabel = startTimeLabel.cloneNode(true);
    endTimeLabel.setAttribute('text-anchor', 'end');
    endTimeLabel.setAttribute('transform', `translate(${temperatureCanvasBounds.x.length}, -18)`);
    endTimeLabel.innerHTML = endTime.toLocaleString('en-US', { weekday: 'long', month: '2-digit', day: 'numeric' });
    endTimeLabel.classList.add('end');
    timeLabels.appendChild(endTimeLabel);
    svg.appendChild(timeLabels);
    // Draw time gridlines.
    forecastPoints.forEach((forecastPoint, i) => {
        const startTime = new Date(forecastPoint.startTime);
        let labelGap = Math.ceil(forecastPoints.length / 8);
        // This seems to work once we get really zoomed out.
        if (labelGap > 12) {
            labelGap = 24;
        }
        else if (labelGap > 6) {
            labelGap = 12;
        }
        const shouldDrawLabel = (i == 0 ||
            i == forecastPoints.length - 1 ||
            startTime.getHours() % labelGap == 0);
        if (!shouldDrawLabel) {
            return;
        }
        const x = temperatureCanvasBounds.x.min + temperatureCanvasBounds.x.length * (i / (forecastPoints.length - 1));
        const temperatureGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        temperatureGridline.setAttribute('x1', `${x}`);
        temperatureGridline.setAttribute('y1', `${temperatureCanvasBounds.y.min}`);
        temperatureGridline.setAttribute('x2', `${x}`);
        temperatureGridline.setAttribute('y2', `${temperatureCanvasBounds.y.max}`);
        temperatureGridline.classList.add('vertical-gridline');
        temperatureGridline.classList.add('temperature');
        svg.appendChild(temperatureGridline);
        const precipitationGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        precipitationGridline.setAttribute('x1', `${x}`);
        precipitationGridline.setAttribute('y1', `${precipitationCanvasBounds.y.min}`);
        precipitationGridline.setAttribute('x2', `${x}`);
        precipitationGridline.setAttribute('y2', `${precipitationCanvasBounds.y.max}`);
        precipitationGridline.classList.add('vertical-gridline');
        precipitationGridline.classList.add('precipitation');
        svg.appendChild(precipitationGridline);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${x}`);
        text.setAttribute('y', `${maxHeight * (2 / 3)}`);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('transform', `rotate(-90 ${x} ${maxHeight * (2 / 3)}) translate(30, 5)`);
        text.innerHTML = startTime.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        text.classList.add('vertical-gridline');
        svg.appendChild(text);
    });
    // Draw Temperature gridlines.
    const temperatures = [
        ...forecastPoints.map(forecastPoint => forecastPoint.temperature),
        ...forecastPoints.map(forecastPoint => forecastPoint.dewPoint),
        ...forecastPoints.map(forecastPoint => forecastPoint.windChill),
    ].filter(n => !isNaN(n));
    const minTemperature = Math.min(...temperatures);
    const maxTemperature = Math.max(...temperatures);
    const chartGridlineSpacing = 5;
    const chartMaxTemperature = Math.round(maxTemperature / chartGridlineSpacing) * chartGridlineSpacing + chartGridlineSpacing;
    const chartMinTemperature = Math.round(minTemperature / chartGridlineSpacing) * chartGridlineSpacing - chartGridlineSpacing;
    const chartTemperatureBounds = {
        max: chartMaxTemperature,
        min: chartMinTemperature,
        length: chartMaxTemperature - chartMinTemperature,
    };
    for (let i = chartTemperatureBounds.min; i <= chartTemperatureBounds.max; i += 5) {
        const y = temperatureCanvasBounds.y.max - temperatureCanvasBounds.y.length * ((i - chartTemperatureBounds.min) / (chartTemperatureBounds.max - chartTemperatureBounds.min));
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${temperatureCanvasBounds.x.min}`);
        line.setAttribute('y1', `${y}`);
        line.setAttribute('x2', `${temperatureCanvasBounds.x.max}`);
        line.setAttribute('y2', `${y}`);
        line.classList.add('horizontal-gridline');
        line.classList.add('temperature');
        svg.appendChild(line);
        const axisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        axisLabel.setAttribute('x', `${temperatureCanvasBounds.x.min}`);
        axisLabel.setAttribute('y', `${y}`);
        axisLabel.setAttribute('text-anchor', 'end');
        axisLabel.setAttribute('transform', 'translate(-10, 4)');
        axisLabel.innerHTML = `${i}°`;
        axisLabel.classList.add('horizontal-gridline');
        axisLabel.classList.add('temperature');
        svg.appendChild(axisLabel);
        // Add another in the middle.
        const middleLabel = axisLabel.cloneNode(true);
        middleLabel.setAttribute('x', `${temperatureCanvasBounds.x.min + 0.5 * temperatureCanvasBounds.x.length}`);
        middleLabel.setAttribute('transform', 'translate(0, 4)');
        svg.appendChild(middleLabel);
    }
    // points: {x: number, y: number}[]
    const drawPolyline = ({ points, color = 'black', className }) => {
        const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        polyline.setAttribute('points', points.filter(p => !isNaN(p.y)).map(p => `${p.x},${p.y}`).join(' '));
        polyline.setAttribute('stroke', color);
        polyline.setAttribute('fill', 'none');
        polyline.classList.add(className);
        svg.appendChild(polyline);
    };
    // Draw temperature line.
    const drawTemperatureLine = ({ propertyName, className }) => {
        drawPolyline({
            points: forecastPoints.map((forecastPoint, i) => ({
                x: temperatureCanvasBounds.x.min + temperatureCanvasBounds.x.length * (i / (forecastPoints.length - 1)),
                // @ts-ignore
                y: temperatureCanvasBounds.y.max - temperatureCanvasBounds.y.length * ((forecastPoint[propertyName] - chartTemperatureBounds.min) / chartTemperatureBounds.length)
            })),
            className
        });
    };
    drawTemperatureLine({ propertyName: 'temperature', className: 'temperature' });
    drawTemperatureLine({ propertyName: 'dewPoint', className: 'dew-point' });
    drawTemperatureLine({ propertyName: 'windChill', className: 'wind-chill' });
    const precipitationCoverageLabelToValueMap = new Map([
        [
            'none', {
                value: 0,
                shortLabel: '',
            }
        ],
        [
            'slight chance', {
                value: 1,
                shortLabel: 'sch',
            }
        ],
        [
            'chance', {
                value: 2,
                shortLabel: 'cha',
            }
        ],
        [
            'likely', {
                value: 3,
                shortLabel: 'like',
            }
        ],
        [
            'occasional', {
                value: 4,
                shortLabel: 'occ',
            }
        ],
    ]);
    // Draw gridlines.
    Array.from(precipitationCoverageLabelToValueMap.entries()).forEach(([_, coverageValue]) => {
        const y = precipitationCanvasBounds.y.max - precipitationCanvasBounds.y.length * (coverageValue.value / (precipitationCoverageLabelToValueMap.size - 1));
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', `${precipitationCanvasBounds.x.min}`);
        line.setAttribute('y1', `${y}`);
        line.setAttribute('x2', `${precipitationCanvasBounds.x.max}`);
        line.setAttribute('y2', `${y}`);
        line.classList.add('horizontal-gridline');
        line.classList.add('precipitation');
        svg.appendChild(line);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${precipitationCanvasBounds.x.min}`);
        text.setAttribute('y', `${y}`);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('transform', 'translate(-10, 4)');
        text.innerHTML = coverageValue.shortLabel;
        text.classList.add('horizontal-gridline');
        text.classList.add('precipitation');
        svg.appendChild(text);
    });
    const drawPrecipitationLine = ({ propertyName, className }) => {
        drawPolyline({
            points: forecastPoints.map((forecastPoint, i) => {
                const weatherCondition = forecastPoint.weatherCondition;
                let value = 0;
                if (weatherCondition.type === propertyName &&
                    precipitationCoverageLabelToValueMap.has(weatherCondition.coverage)) {
                    value = precipitationCoverageLabelToValueMap.get(weatherCondition.coverage).value;
                }
                return {
                    x: precipitationCanvasBounds.x.min + precipitationCanvasBounds.x.length * (i / (forecastPoints.length - 1)),
                    y: precipitationCanvasBounds.y.max - precipitationCanvasBounds.y.length * (value / (precipitationCoverageLabelToValueMap.size - 1))
                };
            }),
            className
        });
    };
    drawPrecipitationLine({ propertyName: 'snow', className: 'snow' });
    drawPrecipitationLine({ propertyName: 'rain', className: 'rain' });
    // Draw legend.
    const legend = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legend.classList.add('legend');
    legend.setAttribute('transform', `translate(${canvasPadding} ${maxHeight - (canvasPadding / 2) + 15})`);
    svg.appendChild(legend);
    const addLegendLabel = ({ label, className, offset }) => {
        const labelElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelElement.innerHTML = label;
        labelElement.classList.add('label');
        labelElement.classList.add(className);
        if (offset) {
            labelElement.setAttribute('transform', `translate(${offset} 0)`);
        }
        legend.appendChild(labelElement);
    };
    const legendLabelWidth = 200;
    addLegendLabel({ label: 'Temperature', className: 'temperature' });
    addLegendLabel({ label: 'Dew Point', className: 'dew-point', offset: legendLabelWidth });
    addLegendLabel({ label: 'Wind Chill', className: 'wind-chill', offset: legendLabelWidth * 2 });
    addLegendLabel({ label: 'Snow', className: 'snow', offset: legendLabelWidth * 3 });
    addLegendLabel({ label: 'Rain', className: 'rain', offset: legendLabelWidth * 4 });
    // Draw buttons.
    const buttonContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    buttonContainer.classList.add('buttons');
    const leftButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    leftButton.setAttribute('points', `0,0 ${maxWidth / 2},${maxHeight / 2} 0,${maxHeight}`);
    leftButton.classList.add('button');
    leftButton.classList.add('previous');
    leftButton.addEventListener('click', previousScreenHandler);
    buttonContainer.appendChild(leftButton);
    const rightButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    rightButton.setAttribute('points', `${maxWidth},0 ${maxWidth / 2},${maxHeight / 2} ${maxWidth},${maxHeight}`);
    rightButton.classList.add('button');
    rightButton.classList.add('next');
    rightButton.addEventListener('click', nextScreenHandler);
    buttonContainer.appendChild(rightButton);
    const zoomOutButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    zoomOutButton.setAttribute('points', `0,${maxHeight} ${maxWidth / 2},${maxHeight / 2} ${maxWidth},${maxHeight}`);
    zoomOutButton.classList.add('button');
    zoomOutButton.classList.add('zoom-out');
    zoomOutButton.addEventListener('click', zoomOutScreenHandler);
    buttonContainer.appendChild(zoomOutButton);
    const zoomInButton = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    zoomInButton.setAttribute('points', `0,0 ${maxWidth / 2},${maxHeight / 2} ${maxWidth},0`);
    zoomInButton.classList.add('button');
    zoomInButton.classList.add('zoom-in');
    zoomInButton.addEventListener('click', zoomInScreenHandler);
    buttonContainer.appendChild(zoomInButton);
    svg.appendChild(buttonContainer);
    screenElement.appendChild(svg);
}
//# sourceMappingURL=forecastUI.js.map