import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { CirclePicker } from 'react-color';

// Manage roles & permissions
import { HasAccess, usePermify } from '@permify/react-role';

// Components
import {
	Avatar,
	Checkbox,
	Collapse,
	Divider,
	FormControl,
	Grid,
	IconButton,
	Input,
	Menu,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import PageRow from '../../../../Components/Shared/PageRow';
import Section from '../../../../Components/Shared/Section';
import StandardModal from '../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import StatusBar from '../../../../Components/Shared/StatusBar';
import CardItem from '../../../../Components/Shared/CardItem';
import TableSkeleton from '../../../../Components/Shared/Skeleton/TableSkeleton';
import { AddUserPermissionModal } from './components/AddUserPermissionsModal';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { TextInput } from '../../../../Components/Shared/Inputs';

// Modals
import { DeleteUserPermissionsModal } from './components/DeleteUserPermissionsModal';
import { AddRolePermissionModal } from './components/AddRolePermissionsModal';
import { DeleteRolePermissionModal } from './components/DeleteRolePermissionsModal';
import { ConfirmationDialog } from '../../../../Components/Shared/ConfirmationDialog';
import { EditTaskModal } from './components/EditTaskModal';

// Syles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

// Redux
import {
	DELETE_TASK,
	GET_TASKS,
	GET_TASK_PERMISSIONS,
	GET_TASK_SETTINGS,
	UPDATE_TASK_SETTINGS,
} from '../../../../redux/tasks.slice';
import {
	CREATE_ORGANIZATION_ROLE_PERMISSION,
	CREATE_ORGANIZATION_USER_PERMISSION,
	DELETE_ORGANIZATION_ROLE_PERMISSION,
	DELETE_ORGANIZATION_USER_PERMISSION,
} from '../../../../redux/organization.slice';
import {
	CREATE_TAG,
	DELETE_TAG,
	UPDATE_TAG,
} from '../../../../redux/examples.slice';

// Services
import checkIsAuthorized from '../../../../services/checkIsAuthorized';
import { getTextColorBasedOnBackgroundColor } from '../../../../services/getTextColorBasedOnBackgroundColor';

const servicesDictionary = {
	active_learning: 'Active Learning service',
	continual_learning: 'Continual Learning service',
	inference: 'Inference service',
	monitoring: 'Monitoring service',
};

export const TaskSettings = () => {
	const { isAuthorized } = usePermify();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const taskNameToDeleteRef = useRef();

	// Global states
	const userState = useSelector((state) => state.user);
	const { settings: settingsLoaderState, currentTask: currentTaskLoaderState } =
		useSelector((state) => state.loaders.task);
	const {
		currentTask: currentTaskState,
		currentTaskSettings: currentTaskSettingsState,
		currentTaskPermissions: currentTaskPermissionsState,
	} = useSelector((state) => state.tasks);
	const {
		info: currentOrganizationInfoState,
		users: organizationUsersState,
		roles: organizationRolesState,
	} = useSelector((state) => state.organization);
	const { tags: tagsState } = useSelector((state) => state.examples);

	// Local states
	const [open, setOpen] = useState(false);
	const [settings, setSettings] = useState({});
	const [pageUserPermissions, setPageUserPermissions] = useState(0);
	const [rowsPerPageUserPermissions, setRowsPerPageUserPermissions] =
		useState(5);
	const [pageRolesPermissions, setPageRolesPermissions] = useState(0);
	const [rowsPerPageRolesPermissions, setRowsPerPageRolesPermissions] =
		useState(5);
	const [taskNameToDelete, setTaskNameToDelete] = useState('');
	const [selectedUserPermissions, setSelectedUserPermissions] = useState([]);
	const [selectedRolePermissions, setSelectedRolePermissions] = useState([]);
	const [openAddUserPermissionModal, setOpenAddUserPermissionModal] =
		useState(false);
	const [openDeleteUserPermissionsModal, setOpenDeleteUserPermissionsModal] =
		useState(false);
	const [openAddRolePermissionModal, setOpenAddRolePermissionModal] =
		useState(false);
	const [openDeleteRolePermissionsModal, setOpenDeleteRolePermissionsModal] =
		useState(false);
	const [openConfirmServiceDialog, setOpenConfirmServiceDialog] =
		useState(false);
	const [enableServiceConfirmation, setEnableServiceConfirmation] = useState({
		id: '',
		name: '',
		checked: false,
	});
	const [openEditTask, setOpenEditTask] = useState(false);

	const [isLoadingDeleteTask, setIsLoadingDeleteTask] = useState(false);

	const [canCreate, setCanCreate] = useState(false);
	const [canUpdate, setCanUpdate] = useState(false);
	const [canDelete, setCanDelete] = useState(false);

	// ##############################

	// Tags
	const [openCreateTagMenu, setOpenCreateTagMenu] = useState(null);
	const [tag, setTag] = useState({
		name: '',
		description: '',
		color: '#000000',
	});
	const [anchorEl, setAnchorEl] = useState(null);
	const [currentTag, setCurrentTag] = useState(null);
	const [openConfirmDeleteTag, setOpenConfirmDeleteTag] = useState(null);

	useEffect(() => {
		setTag({
			name: '',
			description: '',
			color: '#000000',
		});
	}, []);

	useEffect(() => {
		if (currentTag) {
			setTag({
				name: currentTag.name,
				description: currentTag.description,
				color: currentTag.color,
			});
		}
	}, [currentTag]);

	const handleOpenCreateTagMenu = (e) => {
		setAnchorEl(e.currentTarget);
		setTag({
			name: '',
			description: '',
			color: '#000000',
		});
		setOpenCreateTagMenu(true);
	};

	const handleCloseCreateTagMenu = () => {
		setOpenCreateTagMenu(false);
		setCurrentTag(null);
	};

	const handleEditTag = async (tag) => {
		await dispatch(
			UPDATE_TAG({
				userState,
				taskId: currentTaskState.uuid,
				tagId: currentTag.uuid,
				data: tag,
				dispatch,
			})
		);
		handleCloseCreateTagMenu();
	};

	const handleDeleteTag = async () => {
		await dispatch(
			DELETE_TAG({
				userState,
				taskId: currentTaskState.uuid,
				tagId: currentTag.uuid,
				dispatch,
			})
		);
		handleCloseCreateTagMenu();
	};

	const handleCreateTag = async () => {
		if (tag.name === '') return;

		await dispatch(
			CREATE_TAG({
				taskId: currentTaskState.uuid,
				userState,
				dispatch,
				newTag: tag,
			})
		);

		handleCloseCreateTagMenu();
	};

	const handleOpenConfirmDeleteTag = () =>
		setOpenConfirmDeleteTag(!openConfirmDeleteTag);

	// ##############################

	useEffect(() => {
		checkIsAuthorized({
			isAuthorized,
			setCanCreate,
			permission: 'task.create',
		});
		checkIsAuthorized({
			isAuthorized,
			setCanUpdate,
			permission: 'task.update',
		});
		checkIsAuthorized({
			isAuthorized,
			setCanDelete,
			permission: 'task.delete',
		});
	}, []);

	useEffect(() => {
		if (settings !== currentTaskSettingsState)
			setSettings(currentTaskSettingsState);
	}, [currentTaskSettingsState]);

	const handleUpdateSettings = async () => {
		await dispatch(
			UPDATE_TASK_SETTINGS({
				taskId: currentTaskState.id,
				userState,
				data: { services: settings },
			})
		);
		await dispatch(
			GET_TASK_SETTINGS({ userState, taskId: currentTaskState.id, dispatch })
		);
	};

	useEffect(() => {
		if (currentTaskState.uuid && settings !== currentTaskSettingsState)
			handleUpdateSettings();
	}, [
		settings?.active_learning?.enabled,
		settings?.inference?.enabled,
		settings?.continual_learning?.enabled,
		settings?.monitoring?.enabled,
	]);

	const handleChange = (e) => {
		const { id, name, value, checked } = e.target;

		if (canUpdate) {
			if (name === 'enabled') {
				setEnableServiceConfirmation({
					id,
					name,
					checked,
				});
				setOpenConfirmServiceDialog(true);
				return;
			}
			if (id === 'monitoring.odd_predictions') {
				setSettings({
					...settings,
					monitoring: {
						...settings.monitoring,
						ood_predictions: {
							...settings.monitoring.ood_predictions,
							[name]: value,
						},
					},
				});
				return;
			}
			setSettings({
				...settings,
				[id]: { ...settings[id], [name]: value },
			});
		}
	};

	const handleChangeUserPermissionsPage = (newPage) => {
		setPageUserPermissions(newPage);
	};

	const handleChangeUserPermissionsRowsPerPage = (event) => {
		setRowsPerPageUserPermissions(event.target.value);
		setPageUserPermissions(0);
	};

	const handleChangeAllUsers = (e) => {
		const { checked } = e.target;
		if (canUpdate) {
			if (checked)
				setSelectedUserPermissions(
					currentTaskPermissionsState.users.map((user) => user.user)
				);
			else setSelectedUserPermissions([]);
		}
	};

	const handleChangeSelectedUser = (e, user) => {
		const { checked } = e.target;
		if (canUpdate) {
			if (checked)
				setSelectedUserPermissions([...selectedUserPermissions, user]);
			else
				setSelectedUserPermissions(
					selectedUserPermissions.filter((usr) => usr !== user)
				);
		}
	};

	const handleChangeRolesPermissionsPage = (newPage) => {
		setPageRolesPermissions(newPage);
	};

	const handleChangeRolesPermissionsRowsPerPage = (event) => {
		setRowsPerPageRolesPermissions(event.target.value);
		setPageRolesPermissions(0);
	};

	const handleChangeAllRoles = (e) => {
		const { checked } = e.target;
		if (canUpdate) {
			if (checked)
				setSelectedRolePermissions(
					currentTaskPermissionsState.roles.map((rol) => rol.role)
				);
			else setSelectedRolePermissions([]);
		}
	};

	const handleChangeSelectedRole = (e, role) => {
		const { checked } = e.target;
		if (canUpdate) {
			if (checked)
				setSelectedRolePermissions([...selectedRolePermissions, role]);
			else
				setSelectedRolePermissions(
					selectedRolePermissions.filter((rol) => rol !== role)
				);
		}
	};

	/** Function to update user and role permissions */
	const handleUpdatePermissions = async (
		e,
		type,
		id,
		selectedPermissions = {
			action: '',
			allow: true,
			resource_type: 'task',
			resource_uuid: '',
		}
	) => {
		const { checked, name } = e.target;

		if (canUpdate) {
			if (type === 'user') {
				await dispatch(
					DELETE_ORGANIZATION_USER_PERMISSION({
						organizationId: currentOrganizationInfoState.id,
						userId: id,
						selectedPermissions: {
							...selectedPermissions,
							resource_uuid:
								selectedPermissions.resource_uuid !== ''
									? selectedPermissions.resource_uuid
									: currentTaskState.uuid,
							action:
								selectedPermissions.action !== ''
									? selectedPermissions.action
									: name,
							allow: !checked,
						},
						userState,
						dispatch,
						taskId: currentTaskState.id,
					})
				);
				await dispatch(
					CREATE_ORGANIZATION_USER_PERMISSION({
						organizationId: currentOrganizationInfoState.id,
						userId: id,
						selectedPermissions: {
							...selectedPermissions,
							allow: checked,
							resource_uuid:
								selectedPermissions.resource_uuid !== ''
									? selectedPermissions.resource_uuid
									: currentTaskState.uuid,
							action:
								selectedPermissions.action !== ''
									? selectedPermissions.action
									: name,
						},
						userState,
						dispatch,
						taskId: currentTaskState.id,
					})
				);
			}

			if (type === 'role') {
				await dispatch(
					DELETE_ORGANIZATION_ROLE_PERMISSION({
						organizationId: currentOrganizationInfoState.id,
						roleId: id,
						selectedPermissions: {
							...selectedPermissions,
							resource_uuid:
								selectedPermissions?.resource_uuid !== undefined
									? selectedPermissions.resource_uuid
									: currentTaskState.uuid,
							allow: checked,
						},
						userState,
						dispatch,
						taskId: currentTaskState.id,
					})
				);
				await dispatch(
					CREATE_ORGANIZATION_ROLE_PERMISSION({
						organizationId: currentOrganizationInfoState.id,
						roleId: id,
						selectedPermissions: {
							...selectedPermissions,
							allow: checked,
							resource_uuid:
								selectedPermissions?.resource_uuid !== undefined
									? selectedPermissions.resource_uuid
									: currentTaskState.uuid,
						},
						userState,
						dispatch,
						taskId: currentTaskState.id,
					})
				);
			}
			await dispatch(
				GET_TASK_PERMISSIONS({
					taskId: currentTaskState.uuid || localStorage.getItem('oldTaskId'),
					userState,
					dispatch,
				})
			);
		}
	};

	const handleOpenDeleteModal = () => {
		setOpen(!open);
	};

	const confirmDeleteTask = async () => {
		setIsLoadingDeleteTask(true);
		if (taskNameToDelete === currentTaskState.name) {
			await dispatch(
				DELETE_TASK({
					userState,
					dispatch,
					taskId: currentTaskState.id,
				})
			);
			await dispatch(
				GET_TASKS({
					userState,
					dispatch,
				})
			);
			navigate('/dashboard');
		}
		setIsLoadingDeleteTask(false);
	};

	const handleOpenAddUserPermissionModal = () => {
		setOpenAddUserPermissionModal(!openAddUserPermissionModal);
	};

	const handleOpenDeleteUserPermissionsModal = () => {
		setOpenDeleteUserPermissionsModal(!openDeleteUserPermissionsModal);
	};

	const handleOpenAddRolePermissionModal = () => {
		setOpenAddRolePermissionModal(!openAddRolePermissionModal);
	};

	const handleOpenDeleteRolePermissionsModal = () => {
		setOpenDeleteRolePermissionsModal(!openDeleteRolePermissionsModal);
	};

	const handleOpenEditTask = () => {
		setOpenEditTask(true);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Grid
				container
				spacing={3}
				sx={{
					mb: 3,
				}}
			>
				<Grid item xs={12}>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						type="noIcon"
						title="Task information"
						titlelink={
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<HasAccess
									roles={defaultRoles}
									permissions="task.edit"
									renderAuthFailed={
										<StandardButton type="disabled" value="Edit task info" />
									}
								>
									<StandardButton
										value="Edit task info"
										handleClick={handleOpenEditTask}
									/>
								</HasAccess>
							</div>
						}
					>
						<div style={styles().taskInfoContainer}>
							<div style={styles().taskInfoAvatar}>
								{!currentTaskLoaderState ? (
									<Avatar
										alt="Organization logo"
										src={
											currentTaskState.icon
												? currentTaskState.icon['download_url']
												: null
										}
										variant="circle"
									>
										{currentTaskState.name[0]}
									</Avatar>
								) : (
									<Skeleton variant="circular" height={40} width={40} />
								)}
							</div>
							{!currentTaskLoaderState ? (
								<h3>{currentTaskState.name}</h3>
							) : (
								<h3>
									<Skeleton
										variant="text"
										style={{
											height: '12px',
											width: '75px',
										}}
									/>
								</h3>
							)}
							{!currentTaskLoaderState ? (
								<div>{currentTaskState.description}</div>
							) : (
								<Skeleton
									variant="text"
									style={{
										height: '12px',
										width: '175px',
									}}
								/>
							)}

							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ marginRight: 6 }}>Status:</div>
								{!currentTaskLoaderState ? (
									<StatusBar
										type="task"
										code={currentTaskState.status.status_code}
										name={currentTaskState.status.display_name}
										description={currentTaskState.status.description}
									/>
								) : (
									<Skeleton
										variant="text"
										style={{
											height: '12px',
											width: '75px',
										}}
									/>
								)}
							</div>
						</div>
					</CardItem>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						type="noIcon"
						title="Tags"
					>
						<Grid container>
							Here you can see the tags you have in the {currentTaskState.name}{' '}
							task.
						</Grid>
						<Grid container gap={1} sx={{ marginTop: '12px' }}>
							<Grid item>
								<StandardButton
									type="icon"
									icon={<FontAwesomeIcon icon={faPlus} />}
									handleClick={(e) => handleOpenCreateTagMenu(e)}
								/>
							</Grid>
							{tagsState?.map((tag) => (
								<Grid
									item
									sx={{
										backgroundColor: tag.color || '#000000',
										padding: '6px',
										borderRadius: '6px',
										color: getTextColorBasedOnBackgroundColor(
											tag.color || '#000000'
										),
										'&:hover': {
											cursor: 'pointer',
											backgroundColor: `${tag.color || '#000000'}55 !important`,
										},
									}}
									onClick={(e) => {
										setCurrentTag(tag);
										handleOpenCreateTagMenu(e);
									}}
								>
									{tag.name || ''}
								</Grid>
							))}
						</Grid>
					</CardItem>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						type="noIcon"
						title="User permissions"
					>
						<div>
							Here you can see the permissions you have in the{' '}
							{currentTaskState.name} task.
						</div>
						<div style={styles().rolesActions}>
							{/* Add user */}
							<IconButton onClick={handleOpenAddUserPermissionModal}>
								<AddOutlinedIcon sx={{ color: `${colors.blue} !important` }} />
							</IconButton>

							{/* Remove user */}
							<IconButton
								sx={{
									color: `${
										selectedUserPermissions.length > 0 && colors.blue
									} !important`,
								}}
								onClick={handleOpenDeleteUserPermissionsModal}
								disabled={selectedUserPermissions.length === 0}
							>
								<DeleteForeverOutlinedIcon
									sx={{
										color: `${
											selectedUserPermissions.length > 0 && colors.blue
										} !important`,
									}}
								/>
							</IconButton>
						</div>
						<TableContainer>
							<Table sx={{ minWidth: '100%' }} aria-label="simple table">
								<TableHead>
									<TableRow sx={styles().scopeTableHeader}>
										<TableCell sx={styles().tableTitle}>
											<Checkbox
												color="primary"
												disabled={!canUpdate}
												sx={{ padding: '0px', paddingLeft: '6px' }}
												checked={selectedUserPermissions.length > 0}
												onChange={handleChangeAllUsers}
											/>
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											Email
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											First name
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											Last name
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											<div>
												<div>Permissions</div>
												<div style={styles().cellContainer}>
													<div style={styles().cellColumn}>Read</div>
													<div style={styles().cellColumn}>Update</div>
													<div style={styles().cellColumn}>Delete</div>
												</div>
											</div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody sx={styles().scopeTableBody}>
									{settingsLoaderState.usersPermissions && (
										<>
											<TableSkeleton colsNumber={5} />
											<TableSkeleton colsNumber={5} />
										</>
									)}
									{currentTaskPermissionsState &&
										!settingsLoaderState.usersPermissions &&
										organizationUsersState &&
										organizationUsersState.displayedUsers &&
										organizationUsersState.displayedUsers.length > 0 &&
										currentTaskPermissionsState.users &&
										currentTaskPermissionsState.users.length > 0 &&
										currentTaskPermissionsState.users
											.slice(
												pageUserPermissions * rowsPerPageUserPermissions,
												pageUserPermissions * rowsPerPageUserPermissions +
													rowsPerPageUserPermissions
											)
											.map(
												(permission) =>
													permission.permissions.find(
														(perm) =>
															perm.resource_uuid === currentTaskState.uuid
													) && (
														<TableRow key={uuidv4()}>
															<TableCell sx={styles().tableTitle}>
																<Checkbox
																	color="primary"
																	sx={{ padding: '0px', paddingLeft: '6px' }}
																	checked={selectedUserPermissions.includes(
																		permission.user
																	)}
																	disabled={!canUpdate}
																	onChange={(e) =>
																		handleChangeSelectedUser(e, permission.user)
																	}
																/>
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{
																	organizationUsersState.displayedUsers.find(
																		(user) => user.id === permission.user
																	).email
																}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{
																	organizationUsersState.displayedUsers.find(
																		(user) => user.id === permission.user
																	).first_name
																}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{
																	organizationUsersState.displayedUsers.find(
																		(user) => user.id === permission.user
																	).last_name
																}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																<div style={styles().cellContainer}>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{permission.permissions.filter((perm) => {
																			if (perm.action === 'read') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="read"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (
																									perm.action === 'read' &&
																									perm.resource_uuid
																								) {
																									return perm;
																								}
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'read' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'read' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="read"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (perm.action === 'read')
																									return perm;
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (perm.action === 'read')
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (perm.action === 'read') {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{permission.permissions.filter((perm) => {
																			if (perm.action === 'update') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="update"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (
																									perm.action === 'update' &&
																									perm.resource_uuid
																								) {
																									return perm;
																								}
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (
																											perm.action ===
																												'update' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'update' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="update"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (perm.action === 'update')
																									return perm;
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'update'
																										)
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'update'
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{permission.permissions.filter((perm) => {
																			if (perm.action === 'delete') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="delete"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (
																									perm.action === 'delete' &&
																									perm.resource_uuid
																								) {
																									return perm;
																								}
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (
																											perm.action ===
																												'delete' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'delete' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="userPermissions"
																					name="delete"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						permission.permissions.filter(
																							(perm) => {
																								if (perm.action === 'delete')
																									return perm;
																								return false;
																							}
																						)[0]?.allow
																							? permission.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'delete'
																										)
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'user',
																							permission.user,
																							permission.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'delete'
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																</div>
															</TableCell>
														</TableRow>
													)
											)}
								</TableBody>
							</Table>
						</TableContainer>
						{currentTaskPermissionsState &&
							organizationUsersState &&
							organizationUsersState.roles &&
							organizationUsersState.roles.length > 0 &&
							currentTaskPermissionsState.users && (
								<TablePagination
									rowsPerPageOptions={[5, 10, 25]}
									component="div"
									count={currentTaskPermissionsState.users.length}
									rowsPerPage={rowsPerPageUserPermissions}
									page={pageUserPermissions}
									onPageChange={handleChangeUserPermissionsPage}
									onRowsPerPageChange={handleChangeUserPermissionsRowsPerPage}
								/>
							)}
					</CardItem>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						type="noIcon"
						title="Roles permissions"
					>
						<div>
							Here you can see the roles permissions you have in the{' '}
							{currentTaskState.name} task.
						</div>
						<div style={styles().rolesActions}>
							{/* Add user */}
							<IconButton onClick={handleOpenAddRolePermissionModal}>
								<AddOutlinedIcon sx={{ color: `${colors.blue} !important` }} />
							</IconButton>

							{/* Remove user */}
							<IconButton
								sx={{
									color: `${
										selectedRolePermissions.length > 0 && colors.blue
									} !important`,
								}}
								onClick={handleOpenDeleteRolePermissionsModal}
								disabled={selectedRolePermissions.length === 0}
							>
								<DeleteForeverOutlinedIcon
									sx={{
										color: `${
											selectedRolePermissions.length > 0 && colors.blue
										} !important`,
									}}
								/>
							</IconButton>
						</div>
						<TableContainer>
							<Table sx={{ minWidth: '100%' }} aria-label="simple table">
								<TableHead>
									<TableRow sx={styles().scopeTableHeader}>
										<TableCell sx={styles().tableTitle}>
											<Checkbox
												color="primary"
												disabled={!canUpdate}
												sx={{ padding: '0px', paddingLeft: '6px' }}
												checked={selectedRolePermissions.length > 0}
												onChange={handleChangeAllRoles}
											/>
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											Name
										</TableCell>
										<TableCell sx={styles().scopeTableHeadCell} align="center">
											Description
										</TableCell>

										<TableCell sx={styles().scopeTableHeadCell} align="center">
											<div>
												<div>Permissions</div>
												<div style={styles().cellContainer}>
													<div style={styles().cellColumn}>Read</div>
													<div style={styles().cellColumn}>Update</div>
													<div style={styles().cellColumn}>Delete</div>
												</div>
											</div>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody sx={styles().scopeTableBody}>
									{settingsLoaderState.rolesPermissions && (
										<>
											<TableSkeleton colsNumber={5} />
											<TableSkeleton colsNumber={5} />
										</>
									)}
									{currentTaskPermissionsState &&
										!settingsLoaderState.rolesPermissions &&
										currentTaskPermissionsState.roles &&
										currentTaskPermissionsState.roles
											.slice(
												pageRolesPermissions * rowsPerPageRolesPermissions,
												pageRolesPermissions * rowsPerPageRolesPermissions +
													rowsPerPageRolesPermissions
											)
											.map(
												(role) =>
													role.permissions.find(
														(perm) =>
															perm.resource_uuid === currentTaskState.uuid
													) && (
														<TableRow key={uuidv4()}>
															<TableCell sx={styles().tableTitle}>
																<Checkbox
																	color="primary"
																	sx={{ padding: '0px', paddingLeft: '6px' }}
																	checked={selectedRolePermissions.includes(
																		role.role
																	)}
																	disabled={!canUpdate}
																	onChange={(e) =>
																		handleChangeSelectedRole(e, role.role)
																	}
																/>
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{
																	organizationRolesState.find(
																		(rol) => rol.id === role.role
																	).name
																}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{
																	organizationRolesState.find(
																		(rol) => rol.id === role.role
																	).description
																}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																<div style={styles().cellContainer}>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{role.permissions.filter((perm) => {
																			if (perm.action === 'read') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (
																								perm.action === 'read' &&
																								perm.resource_uuid
																							) {
																								return perm;
																							}
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'read' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'read' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (perm.action === 'read')
																								return perm;
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (perm.action === 'read')
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (perm.action === 'read') {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{role.permissions.filter((perm) => {
																			if (perm.action === 'update') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (
																								perm.action === 'update' &&
																								perm.resource_uuid
																							) {
																								return perm;
																							}
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (
																											perm.action ===
																												'update' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'update' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (perm.action === 'update')
																								return perm;
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'update'
																										)
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'update'
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																	<div
																		key={uuidv4()}
																		style={styles().cellColumn}
																	>
																		{role.permissions.filter((perm) => {
																			if (perm.action === 'delete') return perm;
																			return false;
																		}).length > 1 ? (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (
																								perm.action === 'delete' &&
																								perm.resource_uuid
																							) {
																								return perm;
																							}
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (
																											perm.action ===
																												'delete' &&
																											perm.resource_uuid
																										) {
																											return perm;
																										}
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'delete' &&
																										perm.resource_uuid
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		) : (
																			<FormControl>
																				<Checkbox
																					id="inference"
																					name="enabled"
																					color="primary"
																					disabled={!canUpdate}
																					checked={
																						role.permissions.filter((perm) => {
																							if (perm.action === 'delete')
																								return perm;
																							return false;
																						})[0]?.allow
																							? role.permissions.filter(
																									(perm) => {
																										if (
																											perm.action === 'delete'
																										)
																											return perm;
																										return false;
																									}
																							  )[0].allow
																							: false
																					}
																					onChange={(e) =>
																						handleUpdatePermissions(
																							e,
																							'role',
																							role.role,
																							role.permissions.filter(
																								(perm) => {
																									if (
																										perm.action === 'delete'
																									) {
																										return perm;
																									}
																									return false;
																								}
																							)[0]
																						)
																					}
																				/>
																			</FormControl>
																		)}
																	</div>
																</div>
															</TableCell>
														</TableRow>
													)
											)}
								</TableBody>
							</Table>
						</TableContainer>
						{currentTaskPermissionsState &&
							currentTaskPermissionsState.roles && (
								<TablePagination
									rowsPerPageOptions={[5, 10, 25]}
									component="div"
									count={currentTaskPermissionsState.roles.length}
									rowsPerPage={rowsPerPageRolesPermissions}
									page={pageRolesPermissions}
									onPageChange={handleChangeRolesPermissionsPage}
									onRowsPerPageChange={handleChangeRolesPermissionsRowsPerPage}
								/>
							)}
					</CardItem>
					<Grid container spacing={3} sx={{ marginBottom: 3 }}>
						<Grid item xs={12} md={6}>
							<CardItem
								elevation={measures.cardItemElevation}
								sx={{
									display: 'flex',
									padding: 1,
									marginBottom: 3,
								}}
								type="noIcon"
								title="Inference service"
							>
								{!settingsLoaderState.services && settings.inference ? (
									<div style={styles().servicesList}>
										<div>
											<FormControl>
												<Checkbox
													id="inference"
													name="enabled"
													color="primary"
													disabled={!canUpdate}
													checked={
														Object.keys(settings)?.length > 0 &&
														settings.inference.enabled
													}
													onChange={handleChange}
												/>
											</FormControl>
										</div>
										<div>Enabled</div>
									</div>
								) : (
									<div style={styles().servicesList}>
										<div>
											<Skeleton
												variant="square"
												style={{
													height: '18px',
													width: '18px',
												}}
											/>
										</div>
										<div>
											<Skeleton
												variant="text"
												style={{
													height: '18px',
													width: '200px',
												}}
											/>
										</div>
									</div>
								)}
							</CardItem>
							<CardItem
								elevation={measures.cardItemElevation}
								sx={{
									display: 'flex',
									padding: 1,
									marginBottom: 3,
								}}
								type="noIcon"
								title="Testing service"
							>
								{!settingsLoaderState.services && settings.testing ? (
									<div style={styles().servicesList}>
										<div>
											<FormControl>
												<Checkbox
													id="testing"
													name="enabled"
													color="primary"
													disabled={!canUpdate}
													checked={
														Object.keys(settings)?.length > 0 &&
														settings.testing.enabled
													}
													onChange={handleChange}
												/>
											</FormControl>
										</div>
										<div>Enabled</div>
									</div>
								) : (
									<div style={styles().servicesList}>
										<div>
											<Skeleton
												variant="square"
												style={{
													height: '18px',
													width: '18px',
												}}
											/>
										</div>
										<div>
											<Skeleton
												variant="text"
												style={{
													height: '18px',
													width: '200px',
												}}
											/>
										</div>
									</div>
								)}
							</CardItem>
							<CardItem
								elevation={measures.cardItemElevation}
								sx={{
									display: 'flex',
									padding: 1,
									marginBottom: 3,
								}}
								type="noIcon"
								title="Active Learning service"
							>
								{!settingsLoaderState.services && settings.active_learning ? (
									<>
										<div style={styles().servicesList}>
											<div>
												<FormControl>
													<Checkbox
														id="active_learning"
														name="enabled"
														color="primary"
														disabled={!canUpdate}
														checked={settings.active_learning.enabled || false}
														onChange={handleChange}
													/>
												</FormControl>
											</div>
											<div>Enabled</div>
										</div>
										<Collapse
											in={settings.active_learning.enabled}
											timeout="auto"
											unmountOnExit
											style={{ width: '100%' }}
										>
											<TextField
												label="Query interval (days)"
												id="active_learning"
												name="query_interval"
												value={settings.active_learning.query_interval}
												type="number"
												inputProps={{ min: 0, step: 1 }}
												required
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
											<TextField
												label="Max. examples per query"
												id="active_learning"
												name="max_examples_per_query"
												value={settings.active_learning.max_examples_per_query}
												type="number"
												inputProps={{ min: 0, step: 1 }}
												required
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
										</Collapse>
									</>
								) : (
									<div style={styles().servicesList}>
										<div>
											<Skeleton
												variant="square"
												style={{
													height: '18px',
													width: '18px',
												}}
											/>
										</div>
										<div>
											<Skeleton
												variant="text"
												style={{
													height: '18px',
													width: '200px',
												}}
											/>
										</div>
									</div>
								)}
							</CardItem>
						</Grid>
						<Grid item xs={12} md={6}>
							<CardItem
								elevation={measures.cardItemElevation}
								sx={{
									display: 'flex',
									padding: 1,
									marginBottom: 3,
								}}
								type="noIcon"
								title="Continual Learning service"
							>
								{!settingsLoaderState.services &&
								settings.continual_learning ? (
									<div style={styles().servicesList}>
										<div>
											<FormControl>
												<Checkbox
													id="continual_learning"
													name="enabled"
													color="primary"
													disabled={!canUpdate}
													checked={settings.continual_learning.enabled || false}
													onChange={handleChange}
												/>
											</FormControl>
										</div>
										<div>Enabled</div>
									</div>
								) : (
									<div style={styles().servicesList}>
										<div>
											<Skeleton
												variant="square"
												style={{
													height: '18px',
													width: '18px',
												}}
											/>
										</div>
										<div>
											<Skeleton
												variant="text"
												style={{
													height: '18px',
													width: '200px',
												}}
											/>
										</div>
									</div>
								)}
							</CardItem>
							<CardItem
								elevation={measures.cardItemElevation}
								sx={{
									display: 'flex',
									padding: 1,
								}}
								type="noIcon"
								title="Monitoring service"
							>
								{!settingsLoaderState.services && settings.monitoring ? (
									<>
										<div style={styles().servicesList}>
											<div>
												<FormControl>
													<Checkbox
														id="monitoring"
														name="enabled"
														color="primary"
														disabled={!canUpdate}
														checked={settings.monitoring.enabled || false}
														onChange={handleChange}
													/>
												</FormControl>
											</div>
											<div>Enabled</div>
										</div>
										<Collapse
											in={settings.monitoring.enabled}
											timeout="auto"
											unmountOnExit
											style={{ width: '100%' }}
										>
											<TextField
												label="Refresh interval (number of predictions)"
												id="monitoring"
												name="refresh_interval"
												value={settings.monitoring.refresh_interval}
												type="number"
												inputProps={{ min: 0, step: 1 }}
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
											<TextField
												label="Out-of-distribution minimum sample"
												id="monitoring.odd_predictions"
												name="min_sample"
												value={settings.monitoring.ood_predictions.min_sample}
												type="number"
												inputProps={{ min: 0, step: 1 }}
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
											<TextField
												label="Out-of-distribution sensitivity (float value between 0 and 1)"
												id="monitoring.odd_predictions"
												name="sensitivity"
												value={settings.monitoring.ood_predictions.sensitivity}
												type="number"
												inputProps={{ min: 0, max: 1, step: 0.1 }}
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
											<TextField
												label="Out-of-distribution smoothing (float value between 0 and 1"
												id="monitoring.odd_predictions"
												name="smoothing"
												value={settings.monitoring.ood_predictions.smoothing}
												type="number"
												inputProps={{ min: 0, max: 1, step: 0.1 }}
												disabled={!canUpdate}
												sx={{
													...styles().serviceInput,
													width: '100%',
													marginTop: '6px',
													marginBottom: '6px',
												}}
												onChange={handleChange}
												onBlur={handleUpdateSettings}
											/>
										</Collapse>
									</>
								) : (
									<div style={styles().servicesList}>
										<div>
											<Skeleton
												variant="square"
												style={{
													height: '18px',
													width: '18px',
												}}
											/>
										</div>
										<div>
											<Skeleton
												variant="text"
												style={{
													height: '18px',
													width: '200px',
												}}
											/>
										</div>
									</div>
								)}
							</CardItem>
						</Grid>
					</Grid>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							display: 'flex',
							padding: 1,
							marginBottom: 3,
						}}
						type="noIcon"
						title="Delete task"
					>
						<PageRow
							type="danger"
							column1={
								<Section title="Delete this task">
									<span style={{ fontSize: 'small', color: colors.darkGray }}>
										Once deleted, it will be gone forever. Please be certain.
									</span>
								</Section>
							}
							column2={
								<div style={styles().ownerEmails}>
									<div style={styles().ownerEmailsTitle}>
										<HasAccess
											roles={defaultRoles}
											permissions="task.delete"
											renderAuthFailed={
												<StandardButton
													type="disabled"
													value="Delete this task"
												/>
											}
										>
											<StandardButton
												disabled={!canDelete}
												handleClick={handleOpenDeleteModal}
												type="danger"
												value="Delete this task"
											/>
										</HasAccess>
									</div>
								</div>
							}
						/>

						{open && (
							<StandardModal
								open={open}
								setOpen={setOpen}
								title="Delete this task"
								content={
									<div
										className={cssStyles.delete_confirmation_modal}
										style={{ display: 'flex', flexDirection: 'column' }}
									>
										<p>
											Once deleted, it will be gone forever. Please be certain.
										</p>
										<p>
											Before proceeding, please be sure to review the Terms of
											Service regarding account deletion.
										</p>
										<p>
											Enter this task name to confirm.{' '}
											<span style={{ color: 'red' }}>
												{currentTaskState.name}
											</span>
										</p>
										<FormControl
											style={{ marginBottom: '30px', maxWidth: '340px' }}
										>
											<Input
												className={cssStyles.common_input_type}
												ref={taskNameToDeleteRef}
												id="name"
												value={taskNameToDelete}
												onChange={() =>
													setTaskNameToDelete(
														taskNameToDeleteRef.current.children[0].value
													)
												}
											/>
										</FormControl>
									</div>
								}
								actions={
									<>
										<StandardButton
											handleClick={confirmDeleteTask}
											loading={isLoadingDeleteTask}
											type={
												currentTaskState.name !== taskNameToDelete
													? 'disabled'
													: 'danger'
											}
											value="Delete this task"
										/>
										<StandardButton
											handleClick={handleOpenDeleteModal}
											value="Cancel"
											close
										/>
									</>
								}
							/>
						)}
					</CardItem>
				</Grid>
			</Grid>
			{openAddUserPermissionModal && canCreate && (
				<AddUserPermissionModal
					open={openAddUserPermissionModal}
					setOpen={handleOpenAddUserPermissionModal}
					handleUpdatePermissions={handleUpdatePermissions}
				/>
			)}
			{openDeleteUserPermissionsModal && canDelete && (
				<DeleteUserPermissionsModal
					open={openDeleteUserPermissionsModal}
					setOpen={setOpenDeleteUserPermissionsModal}
					selectedUserPermissions={selectedUserPermissions}
					setSelectedUserPermissions={setSelectedUserPermissions}
				/>
			)}
			{openAddRolePermissionModal && canCreate && (
				<AddRolePermissionModal
					open={openAddRolePermissionModal}
					setOpen={handleOpenAddRolePermissionModal}
					handleUpdatePermissions={handleUpdatePermissions}
				/>
			)}
			{openDeleteRolePermissionsModal && canDelete && (
				<DeleteRolePermissionModal
					open={openDeleteRolePermissionsModal}
					setOpen={setOpenDeleteRolePermissionsModal}
					selectedRolePermissions={selectedRolePermissions}
					setSelectedRolePermissions={setSelectedRolePermissions}
				/>
			)}
			{openConfirmServiceDialog && (
				<ConfirmationDialog
					open={openConfirmServiceDialog}
					setOpen={setOpenConfirmServiceDialog}
					title={
						enableServiceConfirmation.checked
							? `Enable ${servicesDictionary[enableServiceConfirmation.id]}?`
							: `Disable ${servicesDictionary[enableServiceConfirmation.id]}?`
					}
					onConfirm={() => {
						setSettings({
							...settings,
							[enableServiceConfirmation.id]: {
								...settings[enableServiceConfirmation.id],
								[enableServiceConfirmation.name]:
									enableServiceConfirmation.checked,
							},
						});
					}}
				/>
			)}
			{openEditTask && (
				<EditTaskModal open={openEditTask} setOpen={setOpenEditTask} />
			)}

			{
				// Create tag menu
			}
			<Menu
				anchorEl={anchorEl}
				id="create-tag-menu"
				open={openCreateTagMenu}
				onClose={handleCloseCreateTagMenu}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							width: '300px',
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 150,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 10,
								left: -5,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{
					horizontal: 'left',
					vertical: 'top',
				}}
				anchorOrigin={{
					horizontal: 'right',
					vertical: 'bottom',
				}}
			>
				<Grid container>
					<Grid
						item
						xs={12}
						sx={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{currentTag ? 'Update tag' : 'Create tag'}
					</Grid>
				</Grid>
				<Divider />
				<Grid container sx={{ padding: '12px' }}>
					<Grid container>
						<Grid item xs={4}>
							Name:
						</Grid>
						<Grid item xs={8}>
							<TextInput
								value={tag.name}
								placeholder="Tag name"
								onChange={(e) => {
									setTag({ ...tag, name: e.target.value });
								}}
							/>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={4}>
							Description:
						</Grid>
						<Grid item xs={8}>
							<TextInput
								value={tag.description}
								placeholder="Tag description"
								onChange={(e) =>
									setTag({
										...tag,
										description: e.target.value,
									})
								}
							/>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={12}>
							Color:
						</Grid>
						<Grid
							item
							xs={12}
							sx={{
								display: 'flex',
								justifyContent: 'center',
							}}
						>
							<CirclePicker
								color={tag.color}
								onChange={(color) => {
									setTag({ ...tag, color: color.hex });
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid container>
					<Grid
						item
						xs={12}
						gap={1}
						sx={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						<StandardButton
							value={currentTag ? 'Save changes' : 'Create'}
							handleClick={() =>
								currentTag ? handleEditTag(tag) : handleCreateTag()
							}
						/>
						{currentTag && (
							<StandardButton
								value="Delete tag"
								type="danger"
								handleClick={handleOpenConfirmDeleteTag}
							/>
						)}
					</Grid>
				</Grid>
			</Menu>
			{openConfirmDeleteTag && (
				<ConfirmationDialog
					open={openConfirmDeleteTag}
					setOpen={setOpenConfirmDeleteTag}
					title="Confirm delete tag"
					onConfirm={handleDeleteTag}
				/>
			)}
		</HasAccess>
	);
};
