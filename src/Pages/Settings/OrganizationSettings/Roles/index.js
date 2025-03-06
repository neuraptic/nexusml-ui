import { useState } from 'react';
import { useSelector } from 'react-redux';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import {
	IconButton,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import CardItem from '../../../../Components/Shared/CardItem';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import { CustomPagination } from '../../../../Components/Shared/CustomPagination';

// Modals
import { EditRoleModal, AddRoleModal } from './components/modals';

// Syles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

const Roles = () => {
	const organizationRolesState = useSelector(
		(state) => state.organization.roles
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [openCreateRoleModal, setOpenCreateRoleModal] = useState(false);
	const [openEditRoleModal, setOpenEditRoleModal] = useState(true);
	const [selectedRoleId, setSelectedRoleId] = useState('');

	const handleOpenCreateRoleModal = () => {
		setOpenCreateRoleModal(true);
	};

	const handleOpenEditRoleModal = (roleId) => {
		setSelectedRoleId(roleId);
		setOpenEditRoleModal(true);
	};

	const handleChangePage = (e, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(event.target.value);
		setPage(0);
	};

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="organization.read"
			renderAuthFailed={<AccessDenied />}
		>
			<CardItem
				type="noIcon"
				titlelink={
					<HasAccess
						roles={defaultRoles}
						permissions="organization.create"
						renderAuthFailed={
							<StandardButton type="disabled" value="Create role" />
						}
					>
						<StandardButton
							value="Create role"
							handleClick={handleOpenCreateRoleModal}
						/>
					</HasAccess>
				}
				title={
					<p style={styles().totalRoles}>{`Roles: ${
						organizationRolesState.length || '0'
					}`}</p>
				}
				elevation={measures.cardItemElevation}
				sx={{
					display: 'flex',
					padding: 1,
					marginBottom: 3,
				}}
			>
				<TableContainer
					sx={{
						marginTop: '12px',
					}}
				>
					<Table
						className={cssStyles.table_main}
						sx={{ minWidth: 650 }}
						size="small"
						aria-label="organization roles table"
					>
						<TableHead>
							<TableRow
								sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}
							>
								<TableCell sx={styles().tableTitle}>Id</TableCell>
								<TableCell sx={styles().tableTitle}>Name</TableCell>
								<TableCell sx={styles().tableTitle}>Description</TableCell>
								<TableCell sx={styles().tableTitle} align="center">
									Manage
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!organizationSettingsLoaderManager.roles &&
							organizationRolesState
								? organizationRolesState
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((role) => (
											<TableRow
												key={role.id}
												sx={{
													'&:lastChild td, &:lastChild th': {
														border: `0 !important`,
													},
												}}
											>
												<TableCell sx={styles().tableContent}>
													{role.id}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{role.name}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{role.description}
												</TableCell>
												<TableCell sx={styles().tableContent} align="center">
													<HasAccess
														roles={defaultRoles}
														permissions="organization.update"
														renderAuthFailed={
															<IconButton>
																<SettingsOutlinedIcon
																	sx={{ color: `${colors.gray} !important` }}
																/>
															</IconButton>
														}
													>
														<IconButton
															onClick={() => handleOpenEditRoleModal(role.id)}
														>
															<SettingsOutlinedIcon
																sx={{ color: `${colors.blue} !important` }}
															/>
														</IconButton>
													</HasAccess>
												</TableCell>
											</TableRow>
										))
								: [...Array(5)].map((e, i) => (
										<TableRow
											key={i}
											sx={{
												'&:lastChild td, &:lastChild th': {
													border: `0 !important`,
												},
											}}
										>
											{[...Array(3)].map(() => (
												<TableCell sx={styles().tableContent}>
													<Skeleton variant="text" />
												</TableCell>
											))}
											<TableCell
												align="center"
												sx={{
													...styles().tableContent,
													width: '100%',
													display: 'flex',
													justifyContent: 'center',
												}}
											>
												<Skeleton variant="circular" width={20} height={20} />
											</TableCell>
										</TableRow>
								  ))}
						</TableBody>
					</Table>
				</TableContainer>
				{organizationRolesState && organizationRolesState.length > 0 && (
					<CustomPagination
						total={organizationRolesState.length}
						rowsPerPage={rowsPerPage}
						page={page}
						handleChangePage={handleChangePage}
						handleChangeRowsPerPage={handleChangeRowsPerPage}
						simple
					/>
				)}
				<>
					{openCreateRoleModal && (
						<AddRoleModal
							open={openCreateRoleModal}
							setOpen={setOpenCreateRoleModal}
						/>
					)}
					{openEditRoleModal && (
						<EditRoleModal
							open={openEditRoleModal}
							setOpen={setOpenEditRoleModal}
							roleId={selectedRoleId || ''}
							handleSelectRoleId={setSelectedRoleId}
						/>
					)}
				</>
			</CardItem>
		</HasAccess>
	);
};

export default Roles;
