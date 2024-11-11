export const newLog = (message) => {
	if (process.env.REACT_APP_ENV === 'development') {
		console.log(message);
	}
};
