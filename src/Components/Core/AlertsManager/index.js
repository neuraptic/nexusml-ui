import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Alert } from '@mui/material';

// Redux
import { REMOVE_ALERT } from '../../../redux/alerts.slice';

// Styles
import styles from './styles';
import animationStyles from './styles.css';

function AlertsManager() {
	const dispatch = useDispatch();

	// Local states
	const alerts = useSelector((state) => state.alerts);

	const handleRemoveAlert = (message) => {
		dispatch(REMOVE_ALERT(message));
	};

	useEffect(() => {
		if (alerts.list && alerts.list.length > 0) {
			const tmpAlert = alerts.list.find((alert) => alert.type !== 'error');
			if (tmpAlert) {
				setTimeout(() => {
					handleRemoveAlert(tmpAlert.message);
				}, 5000);
			}
		}
	}, [alerts.list]);

	return (
		<div style={styles().mainAlertContainer}>
			{alerts.list &&
				alerts.list.length > 0 &&
				alerts.list.map((alert) => (
					<div key={uuidv4()} className={animationStyles['alert-container']}>
						{alert.type === 'error' ? (
							<Alert
								style={styles()[alert.type]}
								severity="error"
								onClose={() => handleRemoveAlert(alert.message)}
							>
								<div key={uuidv4()}>{alert.message}</div>
							</Alert>
						) : (
							<div
								key={uuidv4()}
								className={animationStyles['alert-container']}
							>
								<Alert style={styles()[alert.type]} severity={alert.type}>
									{alert.message}
								</Alert>
							</div>
						)}
					</div>
				))}
		</div>
	);
}

export default AlertsManager;
