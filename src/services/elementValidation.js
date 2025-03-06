export const validateElement = {
	integer: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'number') {
			return { error: 'Not a valid integer' };
		}
		return true;
	},

	boolean: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'boolean') {
			return { error: 'Not a valid boolean' };
		}
		return true;
	},

	datetime: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'object') {
			return { error: 'Not a valid date time' };
		}
		return true;
	},
	float: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'number') {
			return { error: 'Not a valid float' };
		}
		return true;
	},
	text: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid string' };
		}
		return true;
	},
	category: () => true,
	generic_file: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid generic file' };
		}
		return true;
	},
	document_file: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid generic file' };
		}
		return true;
	},
	image_file: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid image file' };
		}
		return true;
	},
	video_file: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid video file' };
		}
		return true;
	},
	audio_file: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'string') {
			return { error: 'Not a valid audio file' };
		}
		return true;
	},
	shape: (elementId, elementToValidate) => {
		if (typeof elementToValidate[elementId] !== 'object') {
			return { error: 'Not a valid shape' };
		}
		return true;
	},
};
