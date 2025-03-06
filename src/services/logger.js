export const newLog = (message) => {
	if (process.env.NEXUSML_UI_ENV === 'development') {
		console.log(message);
	}
};
