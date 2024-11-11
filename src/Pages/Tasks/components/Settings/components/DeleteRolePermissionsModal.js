import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Components
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
} from '@mui/material';
import { StandardModalDialog } from '../../../../../Components/Shared/StandardModalDialog';
import StandardButton from '../../../../../Components/Shared/Buttons/StandardButton';

// Alerts
import { DELETE_SETTING_ROLE_PERMISSION_SUCCESS } from '../../../../../AlertsList/taskAlerts';

// Redux
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../redux/alerts.slice';
import { DELETE_ORGANIZATION_ROLE_PERMISSION } from '../../../../../redux/organization.slice';
import { GET_TASK_PERMISSIONS } from '../../../../../redux/tasks.slice';
import { LOAD_TASK_SETTINGS_ROLES_PERMISSIONS } from '../../../../../redux/loaders.slice';

export const DeleteRolePermissionModal = (props) => {
	const { open, setOpen, selectedRolePermissions, setSelectedRolePermissions } =
		props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const {
		currentTask: currentTaskState,
		currentTaskPermissions: currentTaskPermissionsState,
	} = useSelector((state) => state.tasks);
	const { info: currentOrganizationInfoState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [deleteType, setDeleteType] = useState('role');

	const handleChangeDeleteType = (e) => {
		setDeleteType(e.target.value);
	};

	const handleSave = async () => {
		dispatch(LOAD_TASK_SETTINGS_ROLES_PERMISSIONS(true));
		if (deleteType === 'role') {
			selectedRolePermissions.forEach(async (roleId) => {
				const currentRole = currentTaskPermissionsState.roles.find(
					(role) => role.role === roleId
				);

				const currentPermissions = currentRole.permissions.filter(
					(permission) => permission.resource_uuid === currentTaskState.uuid
				);

				if (currentPermissions.length > 0) {
					await Promise.all(
						currentPermissions.map(async (permission) =>
							dispatch(
								DELETE_ORGANIZATION_ROLE_PERMISSION({
									organizationId: currentOrganizationInfoState.id,
									roleId,
									selectedPermissions: {
										resource_type: 'task',
										allow: permission.allow,
										resource_uuid: currentTaskState.uuid,
										action: permission.action,
									},
									userState,
									dispatch,
									taskId: currentTaskState.id,
								})
							)
						)
					);
				}
			});
			dispatch(
				ADD_ALERT({
					type: 'success',
					message: DELETE_SETTING_ROLE_PERMISSION_SUCCESS,
				})
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(DELETE_SETTING_ROLE_PERMISSION_SUCCESS));
			}, 2000);
		}
		if (deleteType === 'all') {
			selectedRolePermissions.forEach(async (roleId) => {
				const currentRole = currentTaskPermissionsState.users.find(
					(role) => role.user === roleId
				);

				const currentPermissions = currentRole.permissions.filter(
					(permission) => permission.resource_uuid === currentTaskState.uuid
				);

				if (currentPermissions.length > 0) {
					await Promise.all(
						currentPermissions.map(async (permission) => {
							if (permission.resource_uuid) {
								dispatch(
									DELETE_ORGANIZATION_ROLE_PERMISSION({
										organizationId: currentOrganizationInfoState.id,
										roleId,
										selectedPermissions: {
											resource_type: 'task',
											allow: permission.allow,
											resource_uuid: currentTaskState.uuid,
											action: permission.action,
										},
										userState,
										dispatch,
										taskId: currentTaskState.id,
									})
								);
							} else {
								dispatch(
									DELETE_ORGANIZATION_ROLE_PERMISSION({
										organizationId: currentOrganizationInfoState.id,
										roleId,
										selectedPermissions: {
											resource_type: 'task',
											allow: permission.allow,
											action: 'read',
										},
										userState,
										dispatch,
										taskId: currentTaskState.id,
									})
								);
								dispatch(
									DELETE_ORGANIZATION_ROLE_PERMISSION({
										organizationId: currentOrganizationInfoState.id,
										roleId,
										selectedPermissions: {
											resource_type: 'task',
											allow: permission.allow,
											action: 'update',
										},
										userState,
										dispatch,
										taskId: currentTaskState.id,
									})
								);
								dispatch(
									DELETE_ORGANIZATION_ROLE_PERMISSION({
										organizationId: currentOrganizationInfoState.id,
										roleId,
										selectedPermissions: {
											resource_type: 'task',
											allow: permission.allow,
											action: 'delete',
										},
										userState,
										dispatch,
										taskId: currentTaskState.id,
									})
								);
							}
						})
					);
				}
			});
			dispatch(
				ADD_ALERT({
					type: 'success',
					message: DELETE_SETTING_ROLE_PERMISSION_SUCCESS,
				})
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(DELETE_SETTING_ROLE_PERMISSION_SUCCESS));
			}, 2000);
		}
		setSelectedRolePermissions([]);
		setOpen(!open);
		setTimeout(async () => {
			await dispatch(
				GET_TASK_PERMISSIONS({
					taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
					userState,
					dispatch,
				})
			);
		}, 1000);
	};

	return (
		<StandardModalDialog
			open={open}
			setOpen={setOpen}
			title="Delete permissions"
			titleDescription="Select the action you want to perform. You can delete the permissions for this specific task or for all tasks that the resource has access to."
			content={
				<>
					<div>
						<b>Warning:</b> This action cannot be undone
					</div>
					<div>
						<h5>Select permissions to remove:</h5>
						<FormControl>
							<RadioGroup
								aria-labelledby="demo-radio-buttons-group-label"
								value={deleteType}
								name="radio-buttons-group"
								onChange={handleChangeDeleteType}
							>
								<FormControlLabel
									value="role"
									control={<Radio />}
									label="Delete permissions for this specific task only."
								/>
								<FormControlLabel
									value="all"
									control={<Radio />}
									label="Delete all the permissions related to tasks for this role."
								/>
							</RadioGroup>
						</FormControl>
					</div>
				</>
			}
			confirmActions={
				<StandardButton
					type="filled"
					handleClick={handleSave}
					value="Delete role permissions"
					style={{ background: '#ff0000 !important' }}
				/>
			}
		/>
	);
};

DeleteRolePermissionModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	selectedRolePermissions: PropTypes.array,
	setSelectedRolePermissions: PropTypes.func,
};
