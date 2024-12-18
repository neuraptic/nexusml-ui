import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { FormControl, Input } from '@mui/material';
import StandardButton from '../../../../../../../../Components/Shared/Buttons/StandardButton';
import StandardModal from '../../../../../../../../Components/Shared/StandardModal';

// Styles
import cssStyles from './styles.module.css';

// Redux
import { DELETE_ORGANIZATION_ROLE } from '../../../../../../../../redux/organization.slice';

// ALERTS
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../../redux/alerts.slice';
import { ROLE_DELETED } from '../../../../../../../../AlertsList/organizationSettingsAlerts';

export const DeleteRoleModal = (props) => {
	const { open, setOpen, handleCloseParent, roleId } = props;

	const dispatch = useDispatch();

	const currentRoleNameToDeleteRef = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { roles: organizationRolesState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [roleNameToDelete, setRoleNameToDelete] = useState('');
	const [currentRoleNameToDelete, setCurrentRoleNameToDelete] = useState('');

	useEffect(() => {
		const tmpRole = organizationRolesState.find((role) => role.id === roleId);
		setCurrentRoleNameToDelete(tmpRole.name);
	}, [roleId]);

	const handleClose = () => {
		setOpen(!open);
		handleCloseParent();
	};

	const confirmDeleteRole = () => {
		if (roleNameToDelete === currentRoleNameToDelete) {
			dispatch(DELETE_ORGANIZATION_ROLE({ organizationId, roleId, userState }));

			// Added setTimeout to wait for the role to be deleted before get the updated list of roles
			setTimeout(1000);

			handleClose();
			dispatch(ADD_ALERT({ type: 'success', message: ROLE_DELETED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(ROLE_DELETED));
			}, 2000);
		}
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this role"
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
						Enter this role name to confirm.{' '}
						<span style={{ color: 'red' }}>
							{currentRoleNameToDelete || ''}
						</span>
					</p>
					<FormControl style={{ marginBottom: '30px', maxWidth: '340px' }}>
						<Input
							className={cssStyles.common_input_type}
							ref={currentRoleNameToDeleteRef}
							id="name"
							value={roleNameToDelete}
							onChange={() =>
								setRoleNameToDelete(
									currentRoleNameToDeleteRef.current.children[0].value
								)
							}
						/>
					</FormControl>
				</div>
			}
			actions={
				<StandardButton
					handleClick={confirmDeleteRole}
					type="danger"
					value="Delete this role"
				/>
			}
		/>
	);
};

DeleteRoleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleCloseParent: PropTypes.func,
	roleId: PropTypes.string,
};
