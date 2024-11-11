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
import { AddPermissionModal } from './Components';
import { DeleteCollaboratorModal } from './Components/DeleteCollaboratorModal';
import PageRow from '../../../../../../../Components/Shared/PageRow';
import Section from '../../../../../../../Components/Shared/Section';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../../../../consts/colors';

// Redux
import requestFactory from '../../../../../../../services/request.factory';
import {
	DELETE_ORGANIZATION_COLLABORATOR_PERMISSION,
	GET_ORGANIZATION_USERS,
} from '../../../../../../../redux/organization.slice';

export const EditCollaboratorModal = (props) => {
	const { open, setOpen, collaboratorId, handleSelectCollaboratorId } = props;

	const dispatch = useDispatch();

	// Global states
	const { displayedCollaborators } = useSelector(
		(state) => state.organization.collaborators
	);
	const { id: organizationId } = useSelector(
		(state) => state.organization.info
	);
	const { tasks: tasksState } = useSelector((state) => state.tasks);
	const userState = useSelector((state) => state.user);

	// Local states
	const [collaborator, setCollaborator] = useState({
		id: null,
		firstName: 'null',
		lastName: 'null',
		email: 'null',
		permissions: [],
	});

	const [selectedPermissions, setSelectedPermissions] = useState({
		action: '',
		allow: false,
		resource_type: '',
	});

	// Modals
	const [openAddPermissionModal, setOpenAddPermissionModal] = useState(false);
	const [openDeleteCollaboratorModal, setOpenDeleteCollaboratorModal] =
		useState(false);

	useEffect(() => {
		if (collaboratorId) {
			const tmpCollaborator = displayedCollaborators.find(
				(collaborator) => collaborator.id === collaboratorId
			);
			setCollaborator({
				id: tmpCollaborator.id,
				firstName: tmpCollaborator.first_name,
				lastName: tmpCollaborator.last_name,
				email: tmpCollaborator.email,
				permissions: [],
			});
		}
	}, [collaboratorId]);

	const getInfo = useCallback(async () => {
		const resPermissions = await requestFactory({
			type: 'GET',
			url: `/organizations/${organizationId}/collaborators/${collaboratorId}/permissions`,
			userState,
			dispatch,
		});

		setCollaborator({
			...collaborator,
			permissions: resPermissions.data || [],
		});
	});

	useEffect(() => {
		if (collaborator.id !== null) {
			getInfo();
		}
	}, [collaborator.id]);

	const handleSelectPermission = (permission) => {
		if (permission === selectedPermissions)
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
		else setSelectedPermissions(permission);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCollaborator({ ...collaborator, [name]: value });
	};

	const handleAddCollaboratorPermission = async (selectedPermission) => {
		await requestFactory({
			type: 'POST',
			url: `/organizations/${organizationId}/collaborators/${collaboratorId}/permissions`,
			userState,
			data: selectedPermission,
			dispatch,
		});

		getInfo();
		setOpenAddPermissionModal(!openAddPermissionModal);
	};

	const handleDeleteUserPermission = () => {
		dispatch(
			DELETE_ORGANIZATION_COLLABORATOR_PERMISSION({
				organizationId,
				collaboratorId,
				selectedPermissions,
				userState,
			})
		);
		setTimeout(() => {
			setCollaborator({
				...collaborator,
				permissions: [],
			});
			setSelectedPermissions({ action: '', allow: false, resource_type: '' });
			getInfo();
		}, 1000);
	};

	const handleClose = () => {
		setCollaborator({
			id: null,
			firstName: null,
			lastName: null,
			email: null,
			roles: [],
			permissions: [],
		});
		handleSelectCollaboratorId(null);
		dispatch(GET_ORGANIZATION_USERS({ organizationId, userState, dispatch }));
		setOpen(!open);
	};

	const handleOpenAddPermissionModal = () => {
		setOpenAddPermissionModal(!openAddPermissionModal);
		getInfo();
	};

	const handleOpenDeleteUserModal = () => {
		setOpenDeleteCollaboratorModal(!openDeleteCollaboratorModal);
	};

	return (
		collaboratorId !== '' && (
			<>
				<StandardModal
					open={open}
					setOpen={setOpen}
					title="Manage collaborator:"
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
											value={collaborator && collaborator.firstName}
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
											value={collaborator && collaborator.lastName}
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
											value={collaborator && collaborator.email}
											onChange={(e) => handleChange(e)}
										/>
									</FormControl>
								</Box>
							</Box>
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
												{collaborator &&
													collaborator.permissions &&
													collaborator.permissions.length > 0 &&
													collaborator.permissions.map((permission) => (
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

							{/* Delete collaborator */}
							<PageRow
								type="danger"
								column1={
									<Section title="Delete this collaborator">
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
											value="Delete this collaborator"
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
				{openAddPermissionModal && (
					<AddPermissionModal
						open={openAddPermissionModal}
						setOpen={handleOpenAddPermissionModal}
						handleAddCollaboratorPermission={handleAddCollaboratorPermission}
					/>
				)}
				{openDeleteCollaboratorModal && (
					<DeleteCollaboratorModal
						open={openDeleteCollaboratorModal}
						setOpen={setOpenDeleteCollaboratorModal}
						collaboratorId={collaboratorId}
						handleCloseParent={handleClose}
					/>
				)}
			</>
		)
	);
};

EditCollaboratorModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	collaboratorId: PropTypes.string,
	handleSelectCollaboratorId: PropTypes.func,
};
