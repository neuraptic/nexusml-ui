// Alerts
import { ADD_ALERT } from '../redux/alerts.slice';

// Services
import { newLog } from './logger';

// REQUEST FACTORY FUNCTION
const requestFactory = async (props) => {
	const { type, url, userState, data, dispatch } = props;

	let res = null;

	if (process.env.NEXUSML_UI_AUTH_ENABLED === 'true') {
		res = await fetch(`${process.env.NEXUSML_UI_API_URL}${url}`, {
			method: type,
			headers: {
				Authorization: `Bearer ${userState.accessToken}`,
				// 'X-API-Key': userState.accessToken,
				'content-type': 'application/json',
				cors: 'no-cors',
			},
			body: data && JSON.stringify(data),
		});
	} else {
		res = await fetch(`${process.env.NEXUSML_UI_API_URL}${url}`, {
			method: type,
			headers: {
				'content-type': 'application/json',
				cors: 'no-cors',
			},
			body: data && JSON.stringify(data),
		});
	}

	let json = null;

	if (res.status === 204) return res;

	if (res) {
		json = await res.json();
	}

	// Handle 400 and 500 errors
	let statusError = false;
	if (res.status[0] === 4 || res.status[0] === 5 || json.error || json.errors)
		statusError = true;

	if (statusError && type === 'GET') {
		res = await fetch(`${process.env.NEXUSML_UI_API_URL}${url}`, {
			method: type,
			headers: {
				Authorization: `Bearer ${userState.accessToken}`,
				'content-type': 'application/json',
				cors: 'no-cors',
			},
			body: data && JSON.stringify(data),
		});
	}

	if (statusError) {
		if (json.error) {
			dispatch(ADD_ALERT({ type: 'error', message: json.error.message }));
		} else if (json.errors) {
			Object.keys(json.errors.json).forEach((error) => {
				dispatch(
					ADD_ALERT({ type: 'error', message: json.errors.json[error][0] })
				);
			});
		} else {
			newLog('error4');
			dispatch(
				ADD_ALERT({
					type: 'error',
					message:
						'An unexpected error has occurred. Contact contact@neuraptic.ai for support.',
				})
			);
		}
		return;
	}

	if (res && !json.error) {
		return json;
	}

	return res;
};

export default requestFactory;
