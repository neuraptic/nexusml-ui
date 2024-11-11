import { v4 as uuidv4 } from 'uuid';

// Redux
import {
	CREATE_SHAPE,
	DELETE_SHAPE,
	SET_CURRENT_SHAPES,
	UPDATE_EXAMPLE,
	UPDATE_SHAPE,
} from '../../../../../redux/examples.slice';

// Services
import { newLog } from '../../../../../services/logger';

export const disableObjectSelection = ({ editor, isPolygonMode }) => {
	if (isPolygonMode) {
		editor?.canvas.on('selection:created', function () {
			this.selection = false;
			this.forEachObject((o) => {
				o.selectable = false;
			});
		});
	}
};

/* eslint-disable no-unsafe-optional-chaining */
export const addMouseZoomEventHandler = ({ editor, setZoom }) => {
	editor?.canvas.on('mouse:wheel', (e) => {
		newLog('addMouseZoomEventHandler');
		const delta = e.e.deltaY * -1;
		let zoom = editor?.canvas.getZoom();

		if (zoom > 3) {
			zoom += delta / 500;
		} else {
			zoom += delta / 1000;
		}

		zoom = Math.round(zoom * 10) / 10;

		if (zoom > 0.1 && zoom <= 5) {
			editor?.canvas.zoomToPoint({ x: e.e.offsetX, y: e.e.offsetY }, zoom);
		}
		e.e.preventDefault();
		e.e.stopPropagation();

		setZoom(zoom);
	});
};

export const addPanEventHandler = ({ editor }) => {
	newLog('addPanEventHandler');
	editor?.canvas.on('mouse:down', function (opt) {
		const evt = opt.e;
		if (evt.altKey === true) {
			this.isDragging = true;
			this.selection = false;
			this.lastPosX = evt.clientX;
			this.lastPosY = evt.clientY;
		}
	});
	editor?.canvas.on('mouse:move', function (opt) {
		if (this.isDragging) {
			const { e } = opt;
			const vpt = this.viewportTransform;
			vpt[4] += e.clientX - this.lastPosX;
			vpt[5] += e.clientY - this.lastPosY;
			this.requestRenderAll();
			this.lastPosX = e.clientX;
			this.lastPosY = e.clientY;
		}
	});
	editor?.canvas.on('mouse:up', function () {
		// on mouse up we want to recalculate new interaction
		// for all objects, so we call setViewportTransform
		this.setViewportTransform(this.viewportTransform);
		this.isDragging = false;
		this.selection = true;
	});
};

export const addMouseDownEventHandler = ({
	editor,
	canvasState,
	setCanvasState,
}) => {
	editor?.canvas.on('mouse:down', (e) => {
		if (e.e.altKey === true) {
			newLog('addMouseDownEventHandler');
			setCanvasState({
				...canvasState,
				state: 'PANNING',
				lastPosX: e.e.clientX,
				lastPosY: e.e.clientY,
			});
		} else {
			setCanvasState({ ...canvasState, state: 'IDLE' });
		}
	});
};

export const addMouseMoveEventHandler = ({
	editor,
	canvasState,
	setCanvasState,
}) => {
	editor?.canvas.on('mouse:move', (e) => {
		newLog('addMouseMoveEventHandler');
		const vpt = editor?.canvas.viewportTransform;
		vpt[4] += e.e.clientX - editor?.canvas.lastPosX;
		vpt[5] += e.e.clientY - editor?.canvas.lastPosY;
		editor?.canvas.requestRenderAll();
		setCanvasState({
			...canvasState,
			lastPosX: e.e.clientX,
			lastPosY: e.e.clientY,
		});
	});
};

export const addMouseUpEventHandler = ({
	editor,
	canvasState,
	setCanvasState,
}) => {
	editor?.canvas.on('mouse:up', () => {
		newLog('addMouseUpEventHandler');
		editor?.canvas.setViewportTransform(editor?.canvas.viewportTransform);
		setCanvasState({ ...canvasState, state: 'IDLE' });
	});
};

export const addObjectMovingEventHandler = ({ editor }) => {
	editor?.canvas.on('object:moving', (e) => {
		newLog('addObjectMovingEventHandler');
		const obj = e.target;
		if (
			obj.currentHeight > obj.canvas.height ||
			obj.currentWidth > obj.canvas.width
		) {
			return;
		}
		obj.setCoords();
		if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
			obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
			obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
		}
		if (
			obj.getBoundingRect().top + obj.getBoundingRect().height >
				obj.canvas.height ||
			obj.getBoundingRect().left + obj.getBoundingRect().width >
				obj.canvas.width
		) {
			obj.top = Math.min(
				obj.top,
				obj.canvas.height -
					obj.getBoundingRect().height +
					obj.top -
					obj.getBoundingRect().top
			);
			obj.left = Math.min(
				obj.left,
				obj.canvas.width -
					obj.getBoundingRect().width +
					obj.left -
					obj.getBoundingRect().left
			);
		}
	});
};

export const addObjectScalingEventHandler = ({ editor }) => {
	let left = 0;
	let top = 0;
	let width = 0;
	let height = 0;
	let scaleX = 0;
	let scaleY = 0;

	editor?.canvas.on('object:scaling', (e) => {
		newLog('addObjectScalingEventHandler');
		const obj = e.target;
		obj.setCoords();
		const newBr = obj.getBoundingRect();
		if (
			newBr.width + newBr.left >= obj.canvas.width ||
			newBr.height + newBr.top >= obj.canvas.height ||
			newBr.left < 0 ||
			newBr.top < 0
		) {
			obj.left = left;
			obj.top = top;
			obj.scaleX = scaleX;
			obj.scaleY = scaleY;
			obj.width = width;
			obj.height = height;
		} else {
			left = obj.left;
			top = obj.top;
			scaleX = obj.scaleX;
			scaleY = obj.scaleY;
			width = obj.width;
			height = obj.height;
		}
	});
};

export const addObjectModifiedEventHandler = ({
	editor,
	fabric,
	scalingFactor,
	currentElementShapes,
	dispatch,
	taskId,
	exampleId,
	setSelectedShape,
	userState,
}) => {
	editor?.canvas.on('object:modified', (e) => {
		newLog('addObjectModifiedEventHandler');

		const obj = e.target;

		const matrix = obj.calcTransformMatrix();
		const transformedPoints = obj.points
			.map(
				(point) =>
					new fabric.Point(
						point.x - obj.pathOffset.x,
						point.y - obj.pathOffset.y
					)
			)
			.map((point) => fabric.util.transformPoint(point, matrix));

		let oldShape = [];
		oldShape = currentElementShapes.find((s) => s.id === obj.id);
		const newShape = { ...oldShape };
		newShape.polygon = transformedPoints.map((point) => ({
			x: point.x / scalingFactor,
			y: point.y / scalingFactor,
		}));

		setSelectedShape(newShape.id);

		dispatch(
			UPDATE_SHAPE({
				taskId,
				exampleId,
				shapeId: newShape.id,
				newShape,
				dispatch,
				userState,
			})
		);
	});
};

export const addObjectSelectionCreatedEventHandler = ({
	editor,
	setSelectedShape,
	currentElementShapes,
	isPolygonMode,
}) => {
	if (!isPolygonMode) {
		editor?.canvas.on('selection:created', (e) => {
			newLog('addObjectSelectionCreatedEventHandler');

			const shape = currentElementShapes.find((s) => s.id === e.selected[0].id);
			editor?.canvas.getObjects().forEach((o) => {
				if (o.id === shape.id) {
					editor?.canvas.setActiveObject(o);
				}
			});

			setSelectedShape(shape.id);
		});
	} else {
		editor?.canvas.off();
	}
};

export const addObjectSelectionUpdatedEventHandler = ({
	editor,
	setSelectedShape,
	currentElementShapes,
}) => {
	editor?.canvas.on('selection:updated', (e) => {
		newLog('addObjectSelectionUpdatedEventHandler');
		const shape = currentElementShapes.find((s) => s.id === e.selected[0].id);
		setSelectedShape(shape.id);
	});
};

export const addObjectSelectionClearedEventHandler = ({
	editor,
	setSelectedShape,
	setSelectedShapeOutput,
}) => {
	editor?.canvas.on('selection:cleared', () => {
		newLog('addObjectSelectionClearedEventHandler');
		setSelectedShape('');
		setSelectedShapeOutput({});
		editor?.canvas.discardActiveObject();
		editor?.canvas.renderAll();
	});
};

export const addObjectSelectionFromShapeChips = ({ editor, selectedShape }) => {
	newLog('addObjectSelectionFromShapeChips');
	editor?.canvas.getObjects().forEach((o) => {
		if (o.id === selectedShape) {
			editor?.canvas.setActiveObject(o);
			editor?.canvas.renderAll();
		}
	});
};

export const onAddBoxShape = async ({
	editor,
	fabric,
	selectedShapeOutput,
	scalingFactor,
	currentElement,
	dispatch,
	currentRowId,
	taskId,
	exampleId,
	userState,
	zoom,
	currentExampleState,
	examplesState,
	selectedOutputs,
}) => {
	newLog('onAddBoxShape');

	const boxShape = new fabric.Rect({
		top: 0,
		left: 0,
		width: 100 / zoom,
		height: 100 / zoom,
		stroke: 'red',
		strokeWidth: 2,
		fill: 'rgba(255,0,0,0.2)',
		strokeUniform: true,
		transparentCorners: false,
	});

	let newShape = {};

	boxShape.opacity = 0;

	editor?.canvas.viewportCenterObject(boxShape);

	newShape = {
		element: currentElement.element,
		polygon: [],
	};

	boxShape.getCoords().forEach((c) => {
		newShape.polygon.push({
			x: c.x / scalingFactor,
			y: c.y / scalingFactor,
		});
	});

	boxShape.id = uuidv4();
	boxShape.opacity = 1;

	if (
		Object.keys(newShape).length > 0 &&
		currentRowId !== '' &&
		selectedShapeOutput.id !== ''
	) {
		const shapeRes = await dispatch(
			CREATE_SHAPE({ taskId, exampleId, userState, dispatch, newShape })
		);
		if (selectedOutputs.length > 0) {
			await dispatch(
				UPDATE_SHAPE({
					taskId,
					exampleId,
					shapeId: shapeRes.payload.id,
					newShape: {
						...shapeRes.payload,
						outputs: selectedOutputs.map((output) => ({
							element: output.name,
							value: output.value,
						})),
					},
					dispatch,
					userState,
				})
			);
		}

		let tmpUpdate = {
			id: currentRowId,
			values: [],
		};

		const tmpExample = examplesState.find(
			(example) => example.id === currentRowId
		);

		if (tmpExample) {
			// INPUTS
			if (currentExampleState.inputs && currentExampleState.inputs.length > 0) {
				currentExampleState.inputs.forEach((input) => {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, input] };
				});
			}

			// METADATA
			if (
				currentExampleState.metadata &&
				currentExampleState.metadata.length > 0
			) {
				currentExampleState.metadata.forEach((meta) => {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, meta] };
				});
			}

			// OUTPUTS
			if (
				currentExampleState.outputs &&
				currentExampleState.outputs.length > 0
			) {
				currentExampleState.outputs.forEach((output) => {
					tmpUpdate = {
						...tmpUpdate,
						values: [...tmpUpdate.values, output],
					};
				});
			}
			if (
				tmpUpdate.values.find(
					(el) => el.element === selectedShapeOutput.name
				) &&
				Array.isArray(
					tmpUpdate.values.find((el) => el.element === selectedShapeOutput.name)
						.value
				)
			) {
				tmpUpdate = {
					...tmpUpdate,
					values: tmpUpdate.values.map((el) => {
						if (el.element === selectedShapeOutput.name) {
							return {
								element: selectedShapeOutput.name,
								value: [...el.value, shapeRes.payload.id],
							};
						}
						return el;
					}),
				};
			} else {
				tmpUpdate = {
					...tmpUpdate,
					values: [
						...tmpUpdate.values,
						{
							element: selectedShapeOutput.name,
							value: shapeRes.payload.id,
						},
					],
				};
			}
		}

		await dispatch(
			UPDATE_EXAMPLE({
				taskId,
				exampleId: currentRowId,
				examplesToUpdate: tmpUpdate,
				dispatch,
				userState,
			})
		);
	} else {
		newLog('Error onAddBoxShape');
	}
};

export const onDrawPolygon = ({ editor, isDrawingPolygon, fabric }) => {
	newLog('onDrawPolygon');

	let shape = null;
	editor?.canvas.on('mouse:up', (e) => {
		const mouseCoords = {
			x: editor?.canvas.getPointer(e).x,
			y: editor?.canvas.getPointer(e).y,
		};

		if (!isDrawingPolygon.current) {
			isDrawingPolygon.current = true;
			shape = new fabric.Polygon(
				[
					{
						x: mouseCoords.x,
						y: mouseCoords.y,
					},
				],
				{
					stroke: 'red',
					strokeWidth: 0.5,
					top: mouseCoords.y,
					left: mouseCoords.x,
					fill: 'rgba(255,0,0,0.2)',
					perPixelTargetFind: true,
					transparentCorners: false,
					selectable: false,
					evented: false,
				}
			);
			editor?.canvas.add(shape);
		} else {
			shape.points.push({
				x: mouseCoords.x,
				y: mouseCoords.y,
			});
			editor?.canvas.remove(shape);
			const obj = shape.toObject();
			delete obj.top;
			delete obj.left;
			shape = new fabric.Polygon(shape.points, obj);
			shape.perPixelTargetFind = true;
			shape.transparentCorners = false;
			shape.selectable = true;
			shape.evented = false;
			editor?.canvas.add(shape);
		}
	});
};

export const onCancelPolygon = ({
	editor,
	setIsPolygonMode,
	isDrawingPolygon,
}) => {
	newLog('onCancelPolygon');
	const fShape = editor?.canvas.getObjects().find((o) => {
		if (o.type === 'polygon') {
			return o.id === undefined;
		}
		return false;
	});
	if (fShape) {
		editor?.canvas.remove(fShape);
	}

	setIsPolygonMode(false);

	isDrawingPolygon.current = false;
};

export const onPersistPolygon = async ({
	setIsPolygonMode,
	isDrawingPolygon,
	currentElement,
	editor,
	scalingFactor,
	dispatch,
	currentRowId,
	taskId,
	exampleId,
	userState,
	selectedShapeOutput,
	currentExampleState,
	examplesState,
	selectedOutputs,
}) => {
	newLog('onPersistPolygon');
	setIsPolygonMode(false);
	isDrawingPolygon.current = false;

	const newShape = {
		element: currentElement.element,
		polygon: [],
	};

	const fShape = editor?.canvas.getObjects().find((o) => {
		if (o.type === 'polygon') {
			return o.id === undefined;
		}
		return false;
	});

	fShape.points.forEach((c) => {
		newShape.polygon.push({
			x: c.x / scalingFactor,
			y: c.y / scalingFactor,
		});
	});

	if (Object.keys(newShape).length > 0 && currentRowId !== '') {
		const shapeRes = await dispatch(
			CREATE_SHAPE({ taskId, exampleId, userState, dispatch, newShape })
		);
		if (selectedOutputs.length > 0) {
			await dispatch(
				UPDATE_SHAPE({
					taskId,
					exampleId,
					shapeId: shapeRes.payload.id,
					newShape: {
						...shapeRes.payload,
						outputs: selectedOutputs.map((output) => ({
							element: output.name,
							value: output.value,
						})),
					},
					dispatch,
					userState,
				})
			);
		}

		let tmpUpdate = {
			id: currentRowId,
			values: [],
		};

		const tmpExample = examplesState.find(
			(example) => example.id === currentRowId
		);

		if (tmpExample) {
			// INPUTS
			if (currentExampleState.inputs && currentExampleState.inputs.length > 0) {
				currentExampleState.inputs.forEach((input) => {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, input] };
				});
			}

			// METADATA
			if (
				currentExampleState.metadata &&
				currentExampleState.metadata.length > 0
			) {
				currentExampleState.metadata.forEach((meta) => {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, meta] };
				});
			}

			// OUTPUTS
			if (
				currentExampleState.outputs &&
				currentExampleState.outputs.length > 0
			) {
				currentExampleState.outputs.forEach((output) => {
					tmpUpdate = {
						...tmpUpdate,
						values: [...tmpUpdate.values, output],
					};
				});
			}
			if (
				tmpUpdate.values.find(
					(el) => el.element === selectedShapeOutput.name
				) &&
				Array.isArray(
					tmpUpdate.values.find((el) => el.element === selectedShapeOutput.name)
						.value
				)
			) {
				tmpUpdate = {
					...tmpUpdate,
					values: tmpUpdate.values.map((el) => {
						if (el.element === selectedShapeOutput.name) {
							return {
								element: selectedShapeOutput.name,
								value: [...el.value, shapeRes.payload.id],
							};
						}
						return el;
					}),
				};
			} else {
				tmpUpdate = {
					...tmpUpdate,
					values: [
						...tmpUpdate.values,
						{
							element: selectedShapeOutput.name,
							value: shapeRes.payload.id,
						},
					],
				};
			}
		}

		await dispatch(
			UPDATE_EXAMPLE({
				taskId,
				exampleId: currentRowId,
				examplesToUpdate: tmpUpdate,
				dispatch,
				userState,
			})
		);
	} else {
		newLog('Error onPersistPolygon');
	}
};

export const onDeleteShape = async ({
	taskId,
	exampleId,
	userState,
	dispatch,
	shapeId,
	currentShapesState,
	setSelectedShape,
	currentRowId,
	currentExampleState,
	selectedShapeOutput,
}) => {
	await dispatch(
		DELETE_SHAPE({ taskId, exampleId, userState, dispatch, shapeId })
	);

	let tmpUpdate = {
		id: currentRowId,
		values: [],
	};

	if (currentExampleState) {
		// INPUTS
		if (currentExampleState.inputs && currentExampleState.inputs.length > 0) {
			currentExampleState.inputs.forEach((input) => {
				if (input.value !== shapeId) {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, input] };
				}
			});
		}

		// METADATA
		if (
			currentExampleState.metadata &&
			currentExampleState.metadata.length > 0
		) {
			currentExampleState.metadata.forEach((meta) => {
				if (meta.value !== shapeId) {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, meta] };
				}
			});
		}

		// OUTPUTS
		if (currentExampleState.outputs && currentExampleState.outputs.length > 0) {
			currentExampleState.outputs.forEach((output) => {
				if (output.value !== shapeId && !Array.isArray(output.value)) {
					tmpUpdate = { ...tmpUpdate, values: [...tmpUpdate.values, output] };
				}
				if (Array.isArray(output.value)) {
					tmpUpdate = {
						...tmpUpdate,
						values: [
							...tmpUpdate.values,
							{
								...output,
								value: output.value.filter((value) => value !== shapeId),
							},
						],
					};
				}
			});
		}

		const tmpValues = [];

		tmpUpdate.values.forEach((el) => {
			if (el.element === selectedShapeOutput.name) {
				if (Array.isArray(el.value)) {
					tmpValues.push({
						...el,
						value: el.value.filter((val) => val !== shapeId),
					});
				}
			} else {
				tmpValues.push(el);
			}
		});

		tmpUpdate = {
			...tmpUpdate,
			values: tmpValues,
		};
	}

	await dispatch(
		UPDATE_EXAMPLE({
			taskId,
			exampleId: currentRowId,
			examplesToUpdate: tmpUpdate,
			dispatch,
			userState,
		})
	);

	setSelectedShape('');
	dispatch(
		SET_CURRENT_SHAPES(
			currentShapesState.filter((shape) => shape.id !== shapeId)
		)
	);
};
