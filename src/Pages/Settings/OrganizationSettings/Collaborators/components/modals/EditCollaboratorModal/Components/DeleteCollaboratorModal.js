import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import { FormControl, Input } from '@mui/material';
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
	DELETE_ORGANIZATION_COLLABORATOR,
	GET_ORGANIZATION_COLLABORATORS,
} from '../../../../../../../../redux/organization.slice';

export const DeleteCollaboratorModal = ({
	open,
	setOpen,
	handleCloseParent,
	collaboratorId,
}) => {
	const dispatch = useDispatch();

	const currentUserEmailToDeleteRef = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { displayedCollaborators } = useSelector(
		(state) => state.organization.collaborators
	);

	// Local states
	const [collaboratorEmailToDelete, setCollaboratorEmailToDelete] =
		useState('');
	const [
		currentCollaboratorEmailToDelete,
		setCurrentCollaboratorEmailToDelete,
	] = useState('');
	const [isLoadingButton, setIsLoadingButton] = useState(false);

	useEffect(() => {
		const tmpCollaborator = displayedCollaborators.find(
			(collaborator) => collaborator.id === collaboratorId
		);
		setCurrentCollaboratorEmailToDelete(tmpCollaborator.email);
	}, [collaboratorId]);

	const handleClose = async () => {
		await dispatch(
			GET_ORGANIZATION_COLLABORATORS({
				organizationId,
				userState,
				dispatch,
			})
		);
		setOpen(!open);
		handleCloseParent();
	};

	const confirmDeleteUser = async () => {
		setIsLoadingButton(true);
		if (collaboratorEmailToDelete === currentCollaboratorEmailToDelete) {
			await dispatch(
				DELETE_ORGANIZATION_COLLABORATOR({
					organizationId,
					collaboratorId,
					userState,
				})
			);

			// Added setTimeout to wait for the collaborator to be deleted before get the updated list of collaborators
			setTimeout(1000);

			dispatch(ADD_ALERT({ type: 'success', message: USER_DELETED }));
			setTimeout(() => {
				dispatch(REMOVE_ALERT(USER_DELETED));
			}, 2000);
			setIsLoadingButton(false);
			handleClose();
		}
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Delete this collaborator"
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
						Enter the collaborator email to confirm.{' '}
						<span style={{ color: 'red' }}>
							{currentCollaboratorEmailToDelete || ''}
						</span>
					</p>
					<FormControl style={{ marginBottom: '30px', maxWidth: '340px' }}>
						<Input
							className={cssStyles.common_input_type}
							ref={currentUserEmailToDeleteRef}
							id="name"
							value={collaboratorEmailToDelete}
							onChange={() =>
								setCollaboratorEmailToDelete(
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
					value="Delete this collaborator"
					loading={isLoadingButton}
				/>
			}
		/>
	);
};

DeleteCollaboratorModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleCloseParent: PropTypes.func,
	collaboratorId: PropTypes.string,
};
