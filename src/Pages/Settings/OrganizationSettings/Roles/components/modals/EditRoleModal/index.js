import { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import {
	Checkbox,
	DialogActions,
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
import PageRow from '../../../../../../../Components/Shared/PageRow';
import Section from '../../../../../../../Components/Shared/Section';
import { AddPermissionModal, DeleteRoleModal } from './Components';

// Alerts
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../redux/alerts.slice';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../../../../consts/colors';

// Services
import requestFactory from '../../../../../../../services/request.factory';

// Redux
import {
	DELETE_ORGANIZATION_ROLE_PERMISSION,
	GET_ORGANIZATION_ROLES,
} from '../../../../../../../redux/organization.slice';

// Form validations
import { addOrganizationRoleSchema } from '../../../../../../../FormValidations';

export const EditRoleModal = (props) => {
	const { open, setOpen, roleId, handleSelectRoleId } = props;

	const dispatch = useDispatch();

	// Global states
	const { tasks: tasksState } = useSelector((state) => state.tasks);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { roles: organizationRolesState } = useSelector(
		(state) => state.organization
	);
	const userState = useSelector((state) => state.user);

	// Local states
	const [role, setRole] = useState({
		id: null,
		name: 'null',
		description: 'null',
		users: [],
		permissions: [],
	});

	const [userPage] = useState(0);
	const [userRowsPerPage] = useState(5);
	const [selectedRoles, setSelectedRoles] = useState([]);
	const [selectedPermissions, setSelectedPermissions] = useState({
		action: '',
		allow: false,
		resource_type: '',
	});
	const [buttonLoading, setButtonLoading] = useState(false);

	// Modals
	const [openAddPermissionModal, setOpenAddPermissionModal] = useState(false);
	const [openDeleteRoleModal, setOpenDeleteRoleModal] = useState(false);

	useEffect(() => {
		if (roleId !== '') {
			const tmpRole = organizationRolesState.find((role) => role.id === roleId);
			setRole({
				id: roleId,
				name: tmpRole.name,
				description: tmpRole.description,
				users: [],
				permissions: [],
			});
		}
	}, [roleId]);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await addOrganizationRoleSchema.fields[name]
			.validate(value)
			.catch((err) => {
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
	};

	const formik = useFormik({
		initialValues: role,
		enableReinitialize: true,
		onSubmit: async (values) => {
			let hasError = false;
			await addOrganizationRoleSchema.validate(values).catch((err) => {
				hasError = true;
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
			if (!hasError) {
				setButtonLoading(true);
				setButtonLoading(false);
			}
		},
	});

	const getInfo = useCallback(async () => {
		const tmpUsers = await requestFactory({
			type: 'get',
			url: `/organizations/${organizationId}/roles/${roleId}/users?page=${
				userPage + 1
			}&per_page=${userRowsPerPage}&total_count=false`,
			userState,
			dispatch,
		});

		const resUsers = await Promise.all(
			tmpUsers.data.map((user) =>
				requestFactory({
					type: 'GET',
					url: `/organizations/${organizationId}/users/${user.id}`,
					userState,
					dispatch,
				})
			)
		).then((result) => result);

		const resPermissions = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/roles/${roleId}/permissions`,
			userState,
			dispatch,
		});

		setRole({
			...role,
			users: resUsers,
			permissions: resPermissions.data,
		});
		setSelectedRoles([]);
	});

	useEffect(() => {
		if (role.id !== null) {
			getInfo();
		}
	}, [role.id, userPage, userRowsPerPage]);

	const handleSelectRole = (roleId) => {
		if (selectedRoles.includes(roleId)) {
			const tmpRoles = selectedRoles.filter((role) => role !== roleId);
			setSelectedRoles(tmpRoles);
		} else {
			setSelectedRoles([...selectedRoles, roleId]);
		}
	};

	const handleSelectPermission = (permission) => {
		if (permission === selectedPermissions)
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
		else setSelectedPermissions(permission);
	};

	const handleAddUserPermissions = async (selectedPermission) => {
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/roles/${roleId}/permissions`,
			userState,
			data: selectedPermission,
			dispatch,
		});

		getInfo();
		setOpenAddPermissionModal(!openAddPermissionModal);
	};

	const handleDeleteUserPermission = () => {
		dispatch(
			DELETE_ORGANIZATION_ROLE_PERMISSION({
				organizationId,
				roleId,
				selectedPermissions,
				userState,
			})
		);
		setTimeout(() => {
			setRole({
				...role,
				permissions: [],
			});
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
			getInfo();
		}, 1000);
	};

	const handleClose = () => {
		setRole({
			id: null,
			name: '',
			description: '',
			users: [],
			permissions: [],
		});
		handleSelectRoleId(null);
		dispatch(GET_ORGANIZATION_ROLES({ organizationId, userState, dispatch }));
		setOpen(!open);
	};

	const handleOpenAddPermissionModal = () => {
		setOpenAddPermissionModal(!openAddPermissionModal);
		getInfo();
	};

	const handleOpenDeleteRoleModal = () => {
		setOpenDeleteRoleModal(!openDeleteRoleModal);
	};

	return (
		roleId !== '' && (
			<>
				<StandardModal
					open={open}
					setOpen={setOpen}
					title="Manage role:"
					content={
						<form onSubmit={formik.handleSubmit}>
							<Box sx={styles().modalContainer}>
								<Box sx={styles().dialogContentContainer}>
									<Box sx={styles().dialogContent}>
										<Typography
											sx={{ ...styles().dialogContentText, fontSize: 'small' }}
										>
											Name
										</Typography>
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="name"
												name="name"
												type="name"
												placeholder="Name"
												onChange={formik.handleChange}
												onBlur={(e) => handleValidate(e)}
												value={formik.values.name}
											/>
										</FormControl>
									</Box>
									<Box sx={styles().dialogContent}>
										<Typography
											sx={{ ...styles().dialogContentText, fontSize: 'small' }}
										>
											Description
										</Typography>
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="description"
												name="description"
												type="description"
												placeholder="Description"
												onChange={formik.handleChange}
												onBlur={(e) => handleValidate(e)}
												value={formik.values.description}
											/>
										</FormControl>
									</Box>
								</Box>

								{/* Roles */}
								<div style={styles().rolesContainer}>
									<div style={styles().rolesContainerTitle}>Users:</div>
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
														<TableCell sx={styles().tableTitle}>Id</TableCell>
														<TableCell sx={styles().tableTitle}>
															Email
														</TableCell>
														<TableCell sx={styles().tableTitle}>
															First name
														</TableCell>
														<TableCell sx={styles().tableTitle}>
															Last name
														</TableCell>
													</TableRow>
												</TableHead>
												<TableBody>
													{role &&
														role.users &&
														role.users.length > 0 &&
														role.users.map((role) => (
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
																<TableCell sx={styles().tableContent}>
																	{role.id}
																</TableCell>
																<TableCell sx={styles().tableContent}>
																	{role.email}
																</TableCell>
																<TableCell sx={styles().tableContent}>
																	{role.first_name}
																</TableCell>
																<TableCell sx={styles().tableContent}>
																	{role.last_name}
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
														<TableCell sx={styles().tableTitle}>
															Action
														</TableCell>
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
													{role &&
														role.permissions &&
														role.permissions.length > 0 &&
														role.permissions.map((permission) => (
															<TableRow
																key={permission.resource_type}
																sx={{
																	'&:lastChild td, &:lastChild th': {
																		border: `0 !important`,
																	},
																}}
																hover
																selected={selectedPermissions === permission}
																onClick={() =>
																	handleSelectPermission(permission)
																}
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
										<Section title="Delete this role">
											<span
												style={{ fontSize: 'small', color: colors.darkGray }}
											>
												Once deleted, it will be gone forever. Please be
												certain.
											</span>
										</Section>
									}
									column2={
										<Section style={{ fontWeight: 'bold' }}>
											<StandardButton
												handleClick={handleOpenDeleteRoleModal}
												type="danger"
												value="Delete this role"
											/>
										</Section>
									}
								/>
							</Box>
							<DialogActions>
								<StandardButton
									className={cssStyles.light_blue_bg_btn}
									value="Save changes"
									type="submit"
									loading={buttonLoading}
								/>
								<StandardButton value="Close" handleClick={handleClose} close />
							</DialogActions>
						</form>
					}
				/>
				<AddPermissionModal
					open={openAddPermissionModal}
					setOpen={handleOpenAddPermissionModal}
					handleAddUserPermissions={handleAddUserPermissions}
				/>
				<DeleteRoleModal
					open={openDeleteRoleModal}
					setOpen={setOpenDeleteRoleModal}
					roleId={roleId}
					handleCloseParent={handleClose}
				/>
			</>
		)
	);
};

EditRoleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	roleId: PropTypes.string,
	handleSelectRoleId: PropTypes.func,
};
