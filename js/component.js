window.createFactorRow = function(item) {
  // Create SVG arrow based on trend
  let trendArrow = '';
  const svgArrow = `<svg width="28" height="21" viewBox="0 0 122.88 108.06" xmlns="http://www.w3.org/2000/svg">
    <path d="M58.94,24.28a14.27,14.27,0,0,1,20.35-20l39.49,40.16a14.28,14.28,0,0,1,0,20L80.09,103.79a14.27,14.27,0,1,1-20.35-20L74.82,68.41l-60.67-.29a14.27,14.27,0,0,1,.24-28.54l59.85.28L58.94,24.28Z" fill="currentColor"/>
  </svg>`;
  
  switch(item.trend) {
    case 'up':
      trendArrow = `<span class="svg-arrow right">${svgArrow}</span>`;
      break;
    case 'down':
      trendArrow = `<span class="svg-arrow left">${svgArrow}</span>`;
      break;
    case 'neutral':
    default:
      trendArrow = '';
      break;
  }

  // Determine handle color class based on implication
  let handleColorClass = '';
  switch(item.implication.toLowerCase()) {
    case 'positive':
      handleColorClass = 'positive';
      break;
    case 'neutral':
      handleColorClass = 'neutral';
      break;
    case 'negative':
      handleColorClass = 'negative';
      break;
  }

  // Calculate position based on value (0-100) as percentage
  // Constrain position to prevent handle overflow (10px handle radius)
  const rawPosition = Math.min(Math.max(item.value, 0), 100);
  const constrainedPosition = Math.min(Math.max(rawPosition, 3), 97);
  
  // Create the range slider visualization
  const rangeSlider = `
    <div class="range-slider">
      <div class="range-track">
        <div class="range-thumb" style="left: ${constrainedPosition}%;">
          ${trendArrow}
          <div class="range-handle ${handleColorClass}"></div>
        </div>
      </div>
    </div>
  `;

  return `
    <tr>
      <td>${item.factor}</td>
      <td>${rangeSlider}</td>
      <td>${item.cioView}</td>
    </tr>
  `;
};
