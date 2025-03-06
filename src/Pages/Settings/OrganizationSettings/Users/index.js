import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

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
import { EditUserModal, InviteUserModal } from './components/modals';

// Syles
import styles from './styles';
import cssStyles from './styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { measures } from '../../../../consts/sizes';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

const Users = () => {
	// Global states
	const organizationUsersState = useSelector(
		(state) => state.organization.users
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	// Local states
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [openInviteUserModal, setOpenInviteUserModal] = useState(false);
	const [openEditUserModal, setOpenEditUserModal] = useState(false);

	const handleOpenInviteUserModal = () => {
		setOpenInviteUserModal(true);
	};

	const handleOpenEditUserModal = (userId) => {
		setSelectedUserId(userId);
		setOpenEditUserModal(true);
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
							<StandardButton type="disabled" value="Invite user" />
						}
					>
						<StandardButton
							value="Invite user"
							handleClick={handleOpenInviteUserModal}
						/>
					</HasAccess>
				}
				title={
					<p
						style={styles().totalUsers}
					>{`Users: ${organizationUsersState.totalUsers}`}</p>
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
						aria-label="organization users table"
					>
						<TableHead>
							<TableRow
								sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}
							>
								<TableCell sx={styles().tableTitle}>Id</TableCell>
								<TableCell sx={styles().tableTitle}>Email</TableCell>
								<TableCell sx={styles().tableTitle}>First name</TableCell>
								<TableCell sx={styles().tableTitle}>Last name</TableCell>
								<TableCell sx={styles().tableTitle} align="center">
									Manage
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{!organizationSettingsLoaderManager.users &&
							organizationUsersState
								? organizationUsersState.displayedUsers
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map((user) => (
											<TableRow
												key={uuidv4()}
												sx={{
													'&:lastChild td, &:lastChild th': {
														border: `0 !important`,
													},
												}}
											>
												<TableCell sx={styles().tableContent}>
													{user.id}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{user.email}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{user.first_name}
												</TableCell>
												<TableCell sx={styles().tableContent}>
													{user.last_name}
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
															onClick={() => handleOpenEditUserModal(user.id)}
														>
															<SettingsOutlinedIcon
																sx={{ color: `${colors.blue} !important` }}
															/>
														</IconButton>
													</HasAccess>
												</TableCell>
											</TableRow>
										))
								: [...Array(5)].map(() => (
										<TableRow
											key={uuidv4()}
											sx={{
												'&:lastChild td, &:lastChild th': {
													border: `0 !important`,
												},
											}}
										>
											{[...Array(4)].map(() => (
												<TableCell key={uuidv4()} sx={styles().tableContent}>
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
				{organizationUsersState &&
					organizationUsersState.totalUsers > 0 &&
					organizationUsersState.displayedUsers && (
						<CustomPagination
							total={organizationUsersState.totalUsers}
							rowsPerPage={rowsPerPage}
							page={page}
							handleChangePage={handleChangePage}
							handleChangeRowsPerPage={handleChangeRowsPerPage}
							simple
						/>
					)}
				<>
					{openInviteUserModal && (
						<InviteUserModal
							open={openInviteUserModal}
							setOpen={setOpenInviteUserModal}
						/>
					)}
					{openEditUserModal && (
						<EditUserModal
							open={openEditUserModal}
							setOpen={setOpenEditUserModal}
							userId={selectedUserId || ''}
							handleSelectUserId={setSelectedUserId}
						/>
					)}
				</>
			</CardItem>
		</HasAccess>
	);
};

export default Users;
