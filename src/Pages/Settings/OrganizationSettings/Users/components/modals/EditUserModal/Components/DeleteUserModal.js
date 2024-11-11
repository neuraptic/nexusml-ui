import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { FormControl, Input } from '@mui/material';

// Modals
import StandardModal from '../../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../../Components/Shared/Buttons/StandardButton';

// Styles
import cssStyles from './styles.module.css';

// ALERTS
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../../redux/alerts.slice';
import { USER_DELETED } from '../../../../../../../../AlertsList/organizationSettingsAlerts';

// Redux
import {
	DELETE_ORGANIZATION_USER,
	GET_ORGANIZATION_USERS,
} from '../../../../../../../../redux/organization.slice';

export const DeleteUserModal = ({
	open,
	setOpen,
	handleCloseParent,
	userId,
}) => {
	const dispatch = useDispatch();

	const currentUserEmailToDeleteRef = useRef();

	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { displayedUsers } = useSelector((state) => state.organization.users);

	const [userEmailToDelete, setUserEmailToDelete] = useState('');
	const [currentUserEmailToDelete, setCurrentUserEmailToDelete] = useState('');

	useEffect(() => {
		const tmpUser = displayedUsers.find((user) => user.id === userId);
		setCurrentUserEmailToDelete(tmpUser.email);
	}, [userId]);

	const handleClose = () => {
		dispatch(GET_ORGANIZATION_USERS({ organizationId, dispatch, accessToken }));
		setOpen(!open);
		handleCloseParent();
	};

	const confirmDeleteUser = () => {
		if (userEmailToDelete === currentUserEmailToDelete) {
			dispatch(
				DELETE_ORGANIZATION_USER({
					organizationId,
					userId,
					userState,
					dispatch,
				})
			);

			// Added setTimeout to wait for the user to be deleted before get the updated list of users
			setTimeout(1000);

			handleClose();
			dispatch(ADD_ALERT({ type: 'success', message: USER_DELETED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(USER_DELETED));
			}, 2000);
		}
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this user"
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
						Enter the user email to confirm.{' '}
						<span style={{ color: 'red' }}>
							{currentUserEmailToDelete || ''}
						</span>
					</p>
					<FormControl style={{ marginBottom: '30px', maxWidth: '340px' }}>
						<Input
							className={cssStyles.common_input_type}
							ref={currentUserEmailToDeleteRef}
							id="name"
							value={userEmailToDelete}
							onChange={() =>
								setUserEmailToDelete(
									currentUserEmailToDeleteRef.current.children[0].value
								)
							}
						/>
					</FormControl>
				</div>
			}
			actions={
				<StandardButton
					handleClick={confirmDeleteUser}
					type="danger"
					value="Delete this user"
				/>
			}
		/>
	);
};

DeleteUserModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleCloseParent: PropTypes.func,
	userId: PropTypes.string,
};
