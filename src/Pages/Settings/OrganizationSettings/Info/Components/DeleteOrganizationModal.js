import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { FormControl, Input } from '@mui/material';
import StandardModal from '../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

// ALERTS
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../redux/alerts.slice';
import {
	ORGANIZATION_DELETED,
	WRONG_ORGANIZATION_NAME,
} from '../../../../../AlertsList/organizationSettingsAlerts';

// Redux
import { DELETE_ORGANIZATION } from '../../../../../redux/organization.slice';

export const DeleteOrganizationModal = (props) => {
	const { open, setOpen } = props;

	const dispatch = useDispatch();

	const currentOrganizationNameToDeleteRef = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { info: organizationInfoState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [organizationNameToDetele, setOrganizationNameToDetele] = useState('');
	const [currentOrganizationNameToDelete, setCurrentOrganizationNameToDelete] =
		useState('');
	const [isLoadingDeleteOrganization, setIsLoadingDeleteOrganization] =
		useState(false);

	useEffect(() => {
		setCurrentOrganizationNameToDelete(organizationInfoState.name);
	}, [organizationInfoState]);

	const handleClose = () => {
		setOpen(!open);
		setOrganizationNameToDetele('');
	};

	const confirmDeleteOrganization = async () => {
		setIsLoadingDeleteOrganization(true);
		if (organizationNameToDetele === currentOrganizationNameToDelete) {
			await dispatch(
				DELETE_ORGANIZATION({
					organizationId: organizationInfoState.id,
					userState,
					dispatch,
				})
			);

			// Added setTimeout to wait for the app to be deleted before get the updated list of apps.
			setTimeout(1000);

			handleClose();
			dispatch(ADD_ALERT({ type: 'success', message: ORGANIZATION_DELETED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(ORGANIZATION_DELETED));
			}, 2000);
		} else {
			dispatch(
				ADD_ALERT({ type: 'warning', message: WRONG_ORGANIZATION_NAME })
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(WRONG_ORGANIZATION_NAME));
			}, 2000);
		}
		setIsLoadingDeleteOrganization(false);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this Organization"
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
						Enter the organization name to confirm.{' '}
						<span style={{ color: 'red' }}>
							{currentOrganizationNameToDelete || ''}
						</span>
					</p>
					<FormControl style={{ marginBottom: '30px', maxWidth: '340px' }}>
						<Input
							className={cssStyles.common_input_type}
							ref={currentOrganizationNameToDeleteRef}
							id="name"
							value={organizationNameToDetele}
							onChange={() =>
								setOrganizationNameToDetele(
									currentOrganizationNameToDeleteRef.current.children[0].value
								)
							}
						/>
					</FormControl>
				</div>
			}
			actions={
				<>
					<StandardButton
						handleClick={confirmDeleteOrganization}
						loading={isLoadingDeleteOrganization}
						type={
							organizationNameToDetele !== currentOrganizationNameToDelete
								? 'disabled'
								: 'danger'
						}
						value="Delete this organization"
					/>
					<StandardButton handleClick={handleClose} close value="Close" />
				</>
			}
		/>
	);
};

DeleteOrganizationModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
