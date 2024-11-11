import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import {
	Grid,
	FormControl,
	Input,
	InputLabel,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Checkbox,
} from '@mui/material';
import PageTitle from '../../../Components/Shared/PageTitle';
import Section from '../../../Components/Shared/Section';
import PageRow from '../../../Components/Shared/PageRow';
import StandardButton from '../../../Components/Shared/Buttons/StandardButton';
import CardItem from '../../../Components/Shared/CardItem';
import AccessDenied from '../../../Components/Core/AccessDenied';
import TableSkeleton from '../../../Components/Shared/Skeleton/TableSkeleton';
import { CustomPagination } from '../../../Components/Shared/CustomPagination';

// Modals
import { EditUserModal } from './EditUserModal';

// Consts
import { colors } from '../../../consts/colors';
import { measures } from '../../../consts/sizes';
import { defaultRoles } from '../../../consts/rolesAndPermissions';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Redux
import { UPDATE_EMAIL_NOTIFICATIONS } from '../../../redux/user.slice';

// Contexts
import ConfigContext from '../../../Providers/ConfigContext';

const UserSettings = () => {
	const { appName } = useContext(ConfigContext);

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { userSettings: userSettingsLoaderManager } = useSelector(
		(state) => state.loaders
	);

	// Local states
	const [rolesRowsPerPage, setRolesRowsPerPage] = useState(5);
	const [rolesPage, setRolesPage] = useState(0);
	const [permissionsRowsPerPage, setPermissionsRowsPerPage] = useState(5);
	const [permissionsPage, setPermissionsPage] = useState(0);
	const [tmpUserData, setTmpUserData] = useState({
		userId: userState.id,
		firstName: userState.first_name,
		lastName: userState.last_name,
		email: userState.email,
	});
	const [openChangeInfoModal, setOpenChangeInfoModal] = useState(false);

	useEffect(() => {
		setTmpUserData({
			...tmpUserData,
			userId: userState.id,
			firstName: userState.first_name,
			lastName: userState.last_name,
			email: userState.email,
		});
	}, [userState]);

	const handleChangeEmailNotifications = (e) => {
		const { checked } = e.target;
		dispatch(
			UPDATE_EMAIL_NOTIFICATIONS({
				userState,
				dispatch,
				data: checked
					? { notifications: 'email' }
					: { notifications: 'polling' },
			})
		);
	};

	const handleChangeRolesPage = (event, newPage) => {
		setRolesPage(newPage);
	};

	const handleChangeRolesRowsPerPage = (event) => {
		setRolesRowsPerPage(parseInt(event.target.value, 10));
		setRolesPage(0);
	};

	const handleChangePermissionsPage = (event, newPage) => {
		setPermissionsPage(newPage);
	};

	const handleChangePermissionsRowsPerPage = (event) => {
		setPermissionsRowsPerPage(parseInt(event.target.value, 10));
		setPermissionsPage(0);
	};

	const handleOpenChangeInfoModal = () => {
		setOpenChangeInfoModal(!openChangeInfoModal);
	};

	return (
		<>
			<PageTitle title="My account" userId={userState.uid} />
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				sx={{
					px: {
						xs: 1,
						sm: 4,
						md: measures.mdGeneralMargin,
						lg: measures.lgGeneralMargin,
					},
					width: '100%',
					marginTop: '24px',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<PageRow
					column1={
						<Section title="Profile">
							<span style={{ fontSize: 'small', color: colors.darkGray }}>
								Here you can see your profile information in {appName}. You can
								customize your first name and last name here. Other profile
								details are read-only.
							</span>
						</Section>
					}
					column2={
						<div style={styles().profileForm}>
							<div style={styles().firstLine}>
								<FormControl sx={styles().input} required>
									<InputLabel
										className={cssStyles.common_input_label}
										htmlFor="first-name"
									>
										First name
									</InputLabel>

									<Input
										disabled
										className={cssStyles.common_input_type}
										id="first-name"
										value={tmpUserData.firstName || ''}
									/>
								</FormControl>
								<FormControl sx={styles().input} required>
									<InputLabel
										className={cssStyles.common_input_label}
										htmlFor="last-name"
									>
										Last name
									</InputLabel>
									<Input
										disabled
										className={cssStyles.common_input_type}
										id="last-name"
										value={tmpUserData.lastName || ''}
									/>
								</FormControl>
							</div>
							<FormControl sx={styles().input}>
								<InputLabel
									className={cssStyles.common_input_label}
									htmlFor="email-address"
								>
									Email address
								</InputLabel>
								<Input
									disabled
									className={cssStyles.common_input_type}
									id="email-address"
									value={userState.email ? userState.email : ''}
								/>
							</FormControl>
							<div style={styles().changePasswordContainer}>
								<StandardButton
									value="Modify info"
									handleClick={handleOpenChangeInfoModal}
								/>
							</div>
						</div>
					}
				/>
				<PageRow
					column1={<Section title="Email notifications" />}
					column2={
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<div>
								<FormControl>
									<Checkbox
										id="email-notifications"
										name="email-notifications"
										color="primary"
										checked={userState.notifications === 'email'}
										onChange={handleChangeEmailNotifications}
									/>
								</FormControl>
							</div>
							<div>Enabled</div>
						</div>
					}
				/>
				<Grid
					container
					sx={{
						gap: 5,
						display: 'flex',
						justifyContent: 'center',
						marginTop: '24px',
					}}
				>
					<Grid item xs={10} md={5.5}>
						<CardItem
							elevation={measures.cardItemElevation}
							sx={{
								display: 'flex',
								padding: 1,
							}}
							type="noIcon"
							title="Roles"
						>
							<div>
								Here you can see the roles you have in {appName}. These roles
								are read-only. If you want to change them, please contact the
								administrator of this or any other organization you may have
								been assigned to.
							</div>

							<HasAccess
								roles={defaultRoles}
								permissions="organization.read"
								renderAuthFailed={<AccessDenied width="100%" />}
							>
								<TableContainer>
									<Table sx={{ minWidth: '100%' }} aria-label="simple table">
										<TableHead>
											<TableRow sx={styles().scopeTableHeader}>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Name
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Description
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody sx={styles().scopeTableBody}>
											{!userSettingsLoaderManager.roles ? (
												userState.roles?.length > 0 &&
												userState.roles.map((role) => (
													<TableRow key={uuidv4()}>
														<TableCell
															align="center"
															sx={styles().scopeCrudElement}
														>
															{role.name}
														</TableCell>
														<TableCell
															align="center"
															sx={styles().scopeCrudElement}
														>
															{role.description}
														</TableCell>
													</TableRow>
												))
											) : (
												<>
													<TableSkeleton colsNumber={2} />
													<TableSkeleton colsNumber={2} />
												</>
											)}
										</TableBody>
									</Table>
								</TableContainer>
								{userState.roles?.length > 0 && (
									<CustomPagination
										total={userState.roles.length}
										rowsPerPage={rolesRowsPerPage}
										page={rolesPage}
										handleChangePage={handleChangeRolesPage}
										handleChangeRowsPerPage={handleChangeRolesRowsPerPage}
										simple
									/>
								)}
							</HasAccess>
						</CardItem>
					</Grid>
					<Grid item xs={10} md={5.5}>
						<CardItem
							elevation={measures.cardItemElevation}
							sx={{
								display: 'flex',
								padding: 1,
							}}
							type="noIcon"
							title="Permissions"
						>
							<div>
								Here you can see the permissions you have in {appName}. These
								permissions are read-only. If you want to change them, please
								contact the administrator of this or any other organization you
								may have been assigned to.
							</div>

							<HasAccess
								roles={defaultRoles}
								permissions="organization.read"
								renderAuthFailed={<AccessDenied width="100%" />}
							>
								<TableContainer>
									<Table sx={{ minWidth: '100%' }} aria-label="simple table">
										<TableHead>
											<TableRow sx={styles().scopeTableHeader}>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Action
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Organization
												</TableCell>
												<TableCell
													sx={styles().scopeTableHeadCell}
													align="center"
												>
													Resource type
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody sx={styles().scopeTableBody}>
											{!userSettingsLoaderManager.permissions ? (
												userState.permissions?.length > 0 &&
												userState.permissions
													.slice(
														permissionsPage * permissionsRowsPerPage,
														permissionsPage * permissionsRowsPerPage +
															permissionsRowsPerPage
													)
													.map((permission) => (
														<TableRow key={uuidv4()}>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{permission.action}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{permission.organization}
															</TableCell>
															<TableCell
																align="center"
																sx={styles().scopeCrudElement}
															>
																{permission.resource_type}
															</TableCell>
														</TableRow>
													))
											) : (
												<>
													<TableSkeleton colsNumber={3} />
													<TableSkeleton colsNumber={3} />
												</>
											)}
										</TableBody>
									</Table>
								</TableContainer>
								{userState.permissions?.length > 0 && (
									<CustomPagination
										total={userState.permissions.length}
										rowsPerPage={permissionsRowsPerPage}
										page={permissionsPage}
										handleChangePage={handleChangePermissionsPage}
										handleChangeRowsPerPage={handleChangePermissionsRowsPerPage}
										simple
									/>
								)}
							</HasAccess>
						</CardItem>
					</Grid>
				</Grid>
			</Grid>
			{/* MODALS */}
			{openChangeInfoModal && (
				<EditUserModal
					open={openChangeInfoModal}
					setOpen={setOpenChangeInfoModal}
				/>
			)}
		</>
	);
};

export default UserSettings;
