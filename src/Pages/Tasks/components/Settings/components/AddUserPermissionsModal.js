import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import {
	Checkbox,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material';
import { StandardModalDialog } from '../../../../../Components/Shared/StandardModalDialog';
import StandardButton from '../../../../../Components/Shared/Buttons/StandardButton';

// Alerts
import {
	ADD_SETTING_USER_PERMISSION_SUCCESS,
	ADD_SETTING_USER_PERMISSION_WARNING,
} from '../../../../../AlertsList/taskAlerts';

// Redux
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../redux/alerts.slice';
import { CREATE_ORGANIZATION_USER_PERMISSION } from '../../../../../redux/organization.slice';
import { GET_TASK_PERMISSIONS } from '../../../../../redux/tasks.slice';
import { LOAD_TASK_SETTINGS_USERS_PERMISSIONS } from '../../../../../redux/loaders.slice';

export const AddUserPermissionModal = (props) => {
	const { open, setOpen } = props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { displayedUsers: displayedUsersState } = useSelector(
		(state) => state.organization.users
	);
	const { info: currentOrganizationInfoState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [selectedUser, setSelectedUser] = useState({
		uuid: '',
		permissions: {
			read: true,
			update: true,
			delete: true,
		},
	});

	const handleChange = (e) => {
		if (e.target.name === 'user')
			setSelectedUser({ ...selectedUser, uuid: e.target.value });
	};

	const handleChangePermission = (e) => {
		const { name, checked } = e.target;
		setSelectedUser({
			...selectedUser,
			permissions: { ...selectedUser.permissions, [name]: checked },
		});
	};

	const handleSave = async () => {
		dispatch(LOAD_TASK_SETTINGS_USERS_PERMISSIONS(true));
		if (selectedUser.uuid !== '') {
			await Promise.all(
				Object.keys(selectedUser.permissions).map((key) =>
					dispatch(
						CREATE_ORGANIZATION_USER_PERMISSION({
							organizationId: currentOrganizationInfoState.id,
							userId: selectedUser.uuid,
							selectedPermissions: {
								resource_type: 'task',
								allow: selectedUser.permissions[key],
								resource_uuid: currentTaskState.uuid,
								action: key,
							},
							userState,
							dispatch,
							taskId: currentTaskState.id,
						})
					)
				)
			);
			dispatch(
				ADD_ALERT({
					type: 'success',
					message: ADD_SETTING_USER_PERMISSION_SUCCESS,
				})
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(ADD_SETTING_USER_PERMISSION_SUCCESS));
			}, 2000);
			await dispatch(
				GET_TASK_PERMISSIONS({
					taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
					userState,
					dispatch,
				})
			);
			setOpen(!open);
		} else {
			dispatch(
				ADD_ALERT({
					type: 'warning',
					message: ADD_SETTING_USER_PERMISSION_WARNING,
				})
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(ADD_SETTING_USER_PERMISSION_WARNING));
			}, 2000);
		}
	};

	return (
		<StandardModalDialog
			open={open}
			setOpen={setOpen}
			title="Add user permission"
			titleDescription="Here you can add users from your organization to add specific permissions to the current task."
			content={
				<>
					<div>
						<h5>User</h5>
						<FormControl
							fullWidth
							sx={{
								mt: 2,
							}}
						>
							<InputLabel id="elementDataTypeLabel">Users *</InputLabel>
							<Select
								id="type"
								labelId="elementDataTypeLabel"
								name="user"
								label="Data Type"
								value={selectedUser.uuid}
								onChange={handleChange}
							>
								{displayedUsersState.length > 0
									? displayedUsersState.map((user) => (
											<MenuItem key={user.uuid} value={user.uuid}>
												{user.email}
											</MenuItem>
									  ))
									: 'No users found in the organization'}
							</Select>
						</FormControl>
					</div>
					<div>
						<h5>Permissions</h5>
						<Grid
							container
							sx={{
								'&>*': {
									display: 'flex',
									justifyContent: 'center',
								},
							}}
						>
							<Grid
								item
								sx={12}
								md={4}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								Read
								<Checkbox
									color="primary"
									sx={{ padding: '0px', paddingLeft: '6px' }}
									checked={selectedUser.permissions.read}
									name="read"
									onChange={handleChangePermission}
								/>
							</Grid>
							<Grid
								item
								sx={12}
								md={4}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								Update
								<Checkbox
									color="primary"
									sx={{ padding: '0px', paddingLeft: '6px' }}
									checked={selectedUser.permissions.update}
									name="update"
									onChange={handleChangePermission}
								/>
							</Grid>
							<Grid
								item
								sx={12}
								md={4}
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
								}}
							>
								Delete
								<Checkbox
									color="primary"
									sx={{ padding: '0px', paddingLeft: '6px' }}
									checked={selectedUser.permissions.delete}
									name="delete"
									onChange={handleChangePermission}
								/>
							</Grid>
						</Grid>
					</div>
				</>
			}
			confirmActions={
				<StandardButton
					type="filled"
					handleClick={handleSave}
					value="Add user"
					style={{ background: '#ff0000 !important' }}
				/>
			}
		/>
	);
};

AddUserPermissionModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
