export const TimeGridLines = ({ forecastPoints, canvasBounds }) => {
    const timeGridLines = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    timeGridLines.classList.add('time-gridlines');
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
        const x = canvasBounds.temperatureCanvas.x.min + canvasBounds.temperatureCanvas.x.length * (i / (forecastPoints.length - 1));
        const temperatureGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        temperatureGridline.setAttribute('x1', `${x}`);
        temperatureGridline.setAttribute('y1', `${canvasBounds.temperatureCanvas.y.min}`);
        temperatureGridline.setAttribute('x2', `${x}`);
        temperatureGridline.setAttribute('y2', `${canvasBounds.temperatureCanvas.y.max}`);
        temperatureGridline.classList.add('vertical-gridline');
        temperatureGridline.classList.add('temperature');
        timeGridLines.appendChild(temperatureGridline);
        const precipitationGridline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        precipitationGridline.setAttribute('x1', `${x}`);
        precipitationGridline.setAttribute('y1', `${canvasBounds.precipitationCanvas.y.min}`);
        precipitationGridline.setAttribute('x2', `${x}`);
        precipitationGridline.setAttribute('y2', `${canvasBounds.precipitationCanvas.y.max}`);
        precipitationGridline.classList.add('vertical-gridline');
        precipitationGridline.classList.add('precipitation');
        timeGridLines.appendChild(precipitationGridline);
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${x}`);
        text.setAttribute('y', `${canvasBounds.global.y.max * (2 / 3)}`);
        text.setAttribute('text-anchor', 'end');
        text.setAttribute('transform', `rotate(-90 ${x} ${canvasBounds.global.y.max * (2 / 3)}) translate(30, 5)`);
        text.innerHTML = startTime.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        text.classList.add('vertical-gridline');
        timeGridLines.appendChild(text);
    });
    return timeGridLines;
};
//# sourceMappingURL=timeGridLines.js.map