import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {
	Checkbox,
	IconButton,
	Input,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import StandardModal from '../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../Components/Shared/Buttons/StandardButton';
import { DeleteUserModal } from './Components/DeleteUserModal';
import PageRow from '../../../../../../../Components/Shared/PageRow';
import Section from '../../../../../../../Components/Shared/Section';

// Modals
import { AddRoleModal, AddPermissionModal } from './Components';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../../../../consts/colors';

// Services
import requestFactory from '../../../../../../../services/request.factory';

// Redux
import {
	GET_ORGANIZATION_USERS,
	DELETE_ORGANIZATION_USER_PERMISSION,
	DELETE_ORGANIZATION_USER_ROLE,
} from '../../../../../../../redux/organization.slice';

export const EditUserModal = (props) => {
	const { open, setOpen, userId, handleSelectUserId } = props;

	const dispatch = useDispatch();

	// Global states
	const { displayedUsers } = useSelector((state) => state.organization.users);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { roles: organizationRolesState } = useSelector(
		(state) => state.organization
	);
	const { tasks: tasksState } = useSelector((state) => state.tasks);
	const userState = useSelector((state) => state.user);

	// Local states
	const [user, setUser] = useState({
		id: null,
		firstName: 'null',
		lastName: 'null',
		email: 'null',
		roles: [],
		permissions: [],
	});

	const [selectedRoles, setSelectedRoles] = useState([]);
	const [selectedPermissions, setSelectedPermissions] = useState({
		action: '',
		allow: false,
		resource_type: '',
	});

	// Modals
	const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
	const [openAddPermissionModal, setOpenAddPermissionModal] = useState(false);
	const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);

	useEffect(() => {
		if (userId) {
			const tmpUser = displayedUsers.find((user) => user.id === userId);
			setUser({
				id: tmpUser.id,
				firstName: tmpUser.first_name,
				lastName: tmpUser.last_name,
				email: tmpUser.email,
				roles: [],
				permissions: [],
			});
		}
	}, [userId]);

	const getInfo = useCallback(async () => {
		const resRoles = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/users/${userId}/roles`,
			userState,
			dispatch,
		});

		const resPermissions = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/users/${userId}/permissions`,
			userState,
			dispatch,
		});

		setUser({
			...user,
			roles: resRoles.roles || [],
			permissions: resPermissions.data || [],
		});
		setSelectedRoles([]);
	});

	useEffect(() => {
		if (user.id !== null) {
			getInfo();
		}
	}, [user.id]);

	const handleSelectRole = (roleId) => {
		if (selectedRoles.includes(roleId)) {
			const tmpRoles = selectedRoles.filter((role) => role !== roleId);
			setSelectedRoles(tmpRoles);
		} else {
			setSelectedRoles([...selectedRoles, roleId]);
		}
	};

	const handleChangeAllRoles = () => {
		if (selectedRoles.length > 0) {
			setSelectedRoles([]);
		} else {
			setSelectedRoles(user.roles.map((role) => role.id));
		}
	};

	const handleSelectPermission = (permission) => {
		if (permission === selectedPermissions)
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
		else setSelectedPermissions(permission);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const handleAddUserRoles = async (selectedRoles) => {
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/users/${userId}/roles`,
			userState,
			data: { roles: selectedRoles },
			dispatch,
		});

		getInfo();
		setOpenAddRoleModal(!openAddRoleModal);
	};

	const handleDeleteUserRole = () => {
		dispatch(
			DELETE_ORGANIZATION_USER_ROLE({
				organizationId,
				userId,
				selectedRoles,
				rolesList: organizationRolesState,
				userState,
			})
		);
		setTimeout(() => {
			setUser({
				...user,
				roles: [],
			});
			getInfo();
		}, 1000);
	};

	const handleAddUserPermissions = async (selectedPermission) => {
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/users/${userId}/permissions`,
			userState,
			data: selectedPermission,
			dispatch,
		});

		getInfo();
		setOpenAddPermissionModal(!openAddPermissionModal);
	};

	const handleDeleteUserPermission = () => {
		dispatch(
			DELETE_ORGANIZATION_USER_PERMISSION({
				organizationId,
				userId,
				selectedPermissions,
				userState,
			})
		);
		setTimeout(() => {
			setUser({
				...user,
				permissions: [],
			});
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
			getInfo();
		}, 1000);
	};

	const handleClose = () => {
		setUser({
			id: null,
			firstName: null,
			lastName: null,
			email: null,
			roles: [],
			permissions: [],
		});
		handleSelectUserId(null);
		dispatch(GET_ORGANIZATION_USERS({ organizationId, userState, dispatch }));
		setOpen(!open);
	};

	const handleOpenAddRoleModal = () => {
		setOpenAddRoleModal(!openAddRoleModal);
		getInfo();
	};

	const handleOpenAddPermissionModal = () => {
		setOpenAddPermissionModal(!openAddPermissionModal);
		getInfo();
	};

	const handleOpenDeleteUserModal = () => {
		setOpenDeleteUserModal(!openDeleteUserModal);
	};

	return (
		userId !== '' && (
			<>
				<StandardModal
					open={open}
					setOpen={setOpen}
					title="Manage user:"
					content={
						<Box sx={styles().modalContainer}>
							<Box sx={styles().dialogContentContainer}>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{ ...styles().dialogContentText, fontSize: 'small' }}
									>
										First name
									</Typography>
									<FormControl>
										<Input
											disabled
											className={cssStyles.common_input_type}
											id="firstName"
											name="firstName"
											value={user && user.firstName}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{ ...styles().dialogContentText, fontSize: 'small' }}
									>
										Last name
									</Typography>
									<FormControl>
										<Input
											disabled
											className={cssStyles.common_input_type}
											id="lastName"
											name="lastName"
											value={user && user.lastName}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
								<Box sx={styles().dialogContent}>
									<Typography
										sx={{ ...styles().dialogContentText, fontSize: 'small' }}
									>
										Email Address
									</Typography>
									<FormControl>
										<Input
											disabled
											className={cssStyles.common_input_type}
											id="email"
											name="email"
											value={user && user.email}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
							</Box>

							{/* Roles */}
							<div style={styles().rolesContainer}>
								<div style={styles().rolesContainerTitle}>Roles:</div>
								<div style={styles().rolesActions}>
									{/* Add role */}
									<IconButton onClick={handleOpenAddRoleModal}>
										<AddOutlinedIcon
											sx={{ color: `${colors.blue} !important` }}
										/>
									</IconButton>

									{/* Remove role */}
									<IconButton
										onClick={
											selectedRoles.length > 0
												? handleDeleteUserRole
												: undefined
										}
										disabled={selectedRoles.length === 0}
									>
										<DeleteForeverOutlinedIcon
											sx={{
												color: `${
													selectedRoles.length > 0 && colors.blue
												} !important`,
											}}
										/>
									</IconButton>
								</div>
								<div style={styles().rolesList}>
									<TableContainer
										sx={{
											marginTop: '12px',
										}}
									>
										<Table size="small">
											<TableHead>
												<TableRow
													sx={{
														borderBottom: `2px solid ${colors.lightBorderColor}`,
													}}
												>
													<TableCell sx={styles().tableTitle}>
														<Checkbox
															color="primary"
															sx={{ padding: '0px', paddingLeft: '6px' }}
															checked={selectedRoles.length > 0}
															onChange={handleChangeAllRoles}
														/>
													</TableCell>
													<TableCell sx={styles().tableTitle}>Id</TableCell>
													<TableCell sx={styles().tableTitle}>Name</TableCell>
													<TableCell sx={styles().tableTitle}>
														Description
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{user &&
													user.roles &&
													user.roles.length > 0 &&
													user.roles.map((role) => (
														<TableRow
															key={role.id}
															sx={{
																'&:lastChild td, &:lastChild th': {
																	border: `0 !important`,
																},
															}}
															hover
															selected={selectedRoles.includes(role.id)}
															onClick={() => handleSelectRole(role.id)}
														>
															<TableCell padding="checkbox">
																<Checkbox
																	color="primary"
																	inputProps={{
																		'aria-label': 'select all desserts',
																	}}
																	checked={selectedRoles.includes(role.id)}
																	onChange={() => handleSelectRole(role.id)}
																/>
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{role.id}
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{role.name}
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{role.description}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</div>

							{/* Permissions */}
							<div style={styles().rolesContainer}>
								<div style={styles().rolesContainerTitle}>Permissions:</div>
								<div style={styles().rolesActions}>
									{/* Add permission */}
									<IconButton onClick={handleOpenAddPermissionModal}>
										<AddOutlinedIcon
											sx={{ color: `${colors.blue} !important` }}
										/>
									</IconButton>

									{/* Remove permission */}
									<IconButton onClick={() => handleDeleteUserPermission()}>
										<DeleteForeverOutlinedIcon
											sx={{
												color: `${
													selectedPermissions.resource_type !== '' &&
													colors.blue
												} !important`,
											}}
										/>
									</IconButton>
								</div>
								<div style={styles().rolesList}>
									<TableContainer
										sx={{
											marginTop: '12px',
										}}
									>
										<Table size="small">
											<TableHead>
												<TableRow
													sx={{
														borderBottom: `2px solid ${colors.lightBorderColor}`,
													}}
												>
													<TableCell sx={styles().tableTitle}>Action</TableCell>
													<TableCell sx={styles().tableTitle}>
														Allowed
													</TableCell>
													<TableCell sx={styles().tableTitle}>
														Resource type
													</TableCell>
													<TableCell sx={styles().tableTitle}>
														Resource name
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{user &&
													user.permissions &&
													user.permissions.length > 0 &&
													user.permissions.map((permission) => (
														<TableRow
															key={permission.id}
															sx={{
																'&:lastChild td, &:lastChild th': {
																	border: `0 !important`,
																},
															}}
															hover
															selected={selectedPermissions === permission}
															onClick={() => handleSelectPermission(permission)}
														>
															<TableCell padding="checkbox">
																<Checkbox
																	color="primary"
																	inputProps={{
																		'aria-label': 'select all desserts',
																	}}
																	checked={selectedPermissions === permission}
																	onChange={() =>
																		handleSelectPermission(permission)
																	}
																/>
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{permission.action}
															</TableCell>
															<TableCell sx={styles().tableContent}>
																<Checkbox
																	color="primary"
																	sx={{ padding: '0px', paddingLeft: '6px' }}
																	checked={permission.allow}
																	disabled
																/>
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{permission.resource_type}
															</TableCell>
															<TableCell sx={styles().tableContent}>
																{permission.resource_type === 'task' &&
																permission.resource_uuid
																	? tasksState.find(
																			(task) =>
																				task.uuid === permission.resource_uuid
																	  ).name
																	: ''}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</div>

							{/* Delete user */}
							<PageRow
								type="danger"
								column1={
									<Section title="Delete this user">
										<span style={{ fontSize: 'small', color: colors.darkGray }}>
											Once deleted, it will be gone forever. Please be certain.
										</span>
									</Section>
								}
								column2={
									<Section style={{ fontWeight: 'bold' }}>
										<StandardButton
											handleClick={handleOpenDeleteUserModal}
											type="danger"
											value="Delete this user"
										/>
									</Section>
								}
							/>
						</Box>
					}
					actions={
						<StandardButton value="Close" handleClick={handleClose} close />
					}
				/>
				<AddRoleModal
					open={openAddRoleModal}
					setOpen={handleOpenAddRoleModal}
					handleAddUserRoles={handleAddUserRoles}
					currentRoles={user.roles}
				/>
				<AddPermissionModal
					open={openAddPermissionModal}
					setOpen={handleOpenAddPermissionModal}
					handleAddUserPermissions={handleAddUserPermissions}
				/>
				<DeleteUserModal
					open={openDeleteUserModal}
					setOpen={setOpenDeleteUserModal}
					userId={userId}
					handleCloseParent={handleClose}
				/>
			</>
		)
	);
};

EditUserModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	userId: PropTypes.string,
	handleSelectUserId: PropTypes.func,
};
