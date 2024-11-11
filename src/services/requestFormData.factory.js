// TODO: REVIEW AND REMOVE IF UNUSED

// REQUEST FACTORY FUNCTION
const requestFormDataFactory = async (
	type,
	url,
	formData,
	taskServerId = ''
) => {
	const res = await fetch(
		`http://${taskServerId ? `${taskServerId}.` : ''}webpash.com/v1${url}`,
		{
			method: type,
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: {
				Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZjNzI2YTA2LTZiYzUtNDI2Zi1hOTJmLThjNGRjYWVjNGEwYiJ9.HAdBdaXFi02fPHzHjgKXinEqTMSj9Gw-MZ0MWpArrqs`,
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: formData,
		}
	).then((response) => {
		if (response.statusText !== 'No Content') return response.json();
	});

	return res;
};

export default requestFormDataFactory;
