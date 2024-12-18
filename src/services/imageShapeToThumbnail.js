export const imageShapeToThumbnail = ({ shape, imageUrl }) => {
	// Get the original polygon coordinates
	const originalX = shape.polygon.map(({ x }) => x);
	const originalY = shape.polygon.map(({ y }) => y);

	// Calculate the scaling factors
	const rangeX = Math.max(...originalX) - Math.min(...originalX);
	const rangeY = Math.max(...originalY) - Math.min(...originalY);

	const scale = 50 / Math.max(rangeX, rangeY);

	const canvas = document.getElementById(shape.uuid);
	if (canvas) {
		const ctx = canvas.getContext('2d');
		const img = new Image();
		img.src = imageUrl;

		img.crossOrigin = 'anonymous'; // Allow cross-origin images
		img.onload = () => {
			// Draw the clipped image on the canvas
			ctx.drawImage(
				img,
				Math.min(...originalX),
				Math.min(...originalY),
				rangeX,
				rangeY,
				0,
				0,
				rangeX * scale,
				rangeY * scale
			);

			// Reset the clip for future drawings
			ctx.restore();
		};
	}
};

const addVertexPoints = (svg, polygon) => {
	// Add the scaled and translated polygon
	const polygonElement = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'polygon'
	);
	const pointsAttribute = polygon.map((point) => point.join(',')).join(' ');
	polygonElement.setAttribute('points', pointsAttribute);
	polygonElement.setAttribute('fill', 'none');
	polygonElement.setAttribute('stroke', 'gray');
	svg.appendChild(polygonElement);

	// Add circles for each vertex
	for (const [x, y] of polygon) {
		const circleElement = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'circle'
		);
		circleElement.setAttribute('cx', x);
		circleElement.setAttribute('cy', y);
		circleElement.setAttribute('r', 2);
		circleElement.setAttribute('fill', 'red');
		svg.appendChild(circleElement);
	}
};

export const imageShapeToPolygonThumbnail = ({ shape }) => {
	// Get the original polygon coordinates
	const originalX = shape.polygon.map(({ x }) => x);
	const originalY = shape.polygon.map(({ y }) => y);

	// Calculate the scaling factors
	const rangeX = Math.max(...originalX) - Math.min(...originalX);
	const rangeY = Math.max(...originalY) - Math.min(...originalY);

	const scale = 40 / Math.max(rangeX, rangeY);

	// Calculate the translation values
	const translateX = -Math.min(...originalX) * scale + 5;
	const translateY = -Math.min(...originalY) * scale + 5;

	// Apply scaling and translation to each point in the polygon
	const scaledAndTranslatedPolygon = shape.polygon.map(({ x, y }) => [
		x * scale + translateX,
		y * scale + translateY,
	]);

	const svg = document.getElementById(`shape-${shape.uuid}`);
	svg.setAttribute('width', '50');
	svg.setAttribute('height', '50');

	addVertexPoints(svg, scaledAndTranslatedPolygon);

	return scaledAndTranslatedPolygon;
};
