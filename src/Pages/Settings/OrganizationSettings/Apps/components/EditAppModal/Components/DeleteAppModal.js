import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { FormControl, Input } from '@mui/material';
import StandardModal from '../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

// ALERTS
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../redux/alerts.slice';
import { APP_DELETED } from '../../../../../../../AlertsList/organizationSettingsAlerts';

// Redux
import { DELETE_ORGANIZATION_APP } from '../../../../../../../redux/organization.slice';

export const DeleteAppModal = (props) => {
	const { open, setOpen, handleCloseParent, appId } = props;

	const dispatch = useDispatch();

	const currentAppNameToDeleteRef = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const organizationAppsState = useSelector((state) => state.organization.apps);

	// Local states
	const [appNameToDelete, setAppNameToDelete] = useState('');
	const [currentAppNameToDelete, setCurrentAppNameToDelete] = useState('');

	useEffect(() => {
		const tmpApp = organizationAppsState.find((app) => app.id === appId);
		setCurrentAppNameToDelete(tmpApp.name);
	}, [appId]);

	const handleClose = () => {
		setOpen(!open);
		handleCloseParent();
	};

	const confirmDeleteApp = async () => {
		if (appNameToDelete === currentAppNameToDelete) {
			await dispatch(
				DELETE_ORGANIZATION_APP({ organizationId, appId, userState })
			);

			// Added setTimeout to wait for the app to be deleted before get the updated list of apps.
			setTimeout(1000);

			handleClose();
			dispatch(ADD_ALERT({ type: 'success', message: APP_DELETED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(APP_DELETED));
			}, 2000);
		}
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this APP"
			size="40%"
			content={
				<div
					className={cssStyles.delete_confirmation_modal}
					style={{ display: 'flex', flexDirection: 'column' }}
				>
					<p>Once deleted, it will be gone forever. Please be certain.</p>
					<p>
						Before proceeding, please be sure to review the Terms of Service
						regarding account deletion.
					</p>
					<p>
						Enter the app name to confirm.{' '}
						<span style={{ color: 'red' }}>{currentAppNameToDelete || ''}</span>
					</p>
					<FormControl style={{ marginBottom: '30px', maxWidth: '340px' }}>
						<Input
							className={cssStyles.common_input_type}
							ref={currentAppNameToDeleteRef}
							id="name"
							value={appNameToDelete}
							onChange={() =>
								setAppNameToDelete(
									currentAppNameToDeleteRef.current.children[0].value
								)
							}
						/>
					</FormControl>
				</div>
			}
			actions={
				<>
					<StandardButton
						handleClick={confirmDeleteApp}
						type="danger"
						value="Delete this app"
					/>
					<StandardButton handleClick={handleClose} close value="Close" />
				</>
			}
		/>
	);
};

DeleteAppModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleCloseParent: PropTypes.func,
	appId: PropTypes.string,
};
