import { useSelector } from 'react-redux';
import { format } from 'date-fns';

// Manage roles and permissions
import { HasAccess } from '@permify/react-role';

// Components
import { FormControl, Grid, Input, Skeleton } from '@mui/material';
import PageRow from '../../../../Components/Shared/PageRow';
import Section from '../../../../Components/Shared/Section';
import AccessDenied from '../../../../Components/Core/AccessDenied';

// Syles
import styles from '../styles';
import cssStyles from '../styles.module.css';

// Consts
import { colors } from '../../../../consts/colors';
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

// Services
import { isEmptyObject } from '../../../../services/extraServices';

const Subscription = () => {
	const organizationSubscriptionState = useSelector(
		(state) => state.organization.subscription
	);
	const { organizationSettings: organizationSettingsLoaderManager } =
		useSelector((state) => state.loaders);

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="organization.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Grid
				item
				xs={12}
				sm={12}
				md={12}
				sx={{
					width: '100%',
					marginTop: '24px',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<PageRow
					column1={
						<Section title="Details">
							<span style={{ fontSize: 'small', color: colors.darkGray }}>
								This is your organization's subscription information.
							</span>
						</Section>
					}
					column2={
						<>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Plan name</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="trn"
												value={organizationSubscriptionState.plan.name}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Price</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="name"
												value={organizationSubscriptionState.plan.price}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Billing cycle</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="domain"
												value={organizationSubscriptionState.plan.billing_cycle}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Starts at</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="address"
												value={
													organizationSubscriptionState.start_at !== null
														? format(
																new Date(
																	organizationSubscriptionState.start_at
																),
																'dd MMMM yyyy HH:mm'
														  )
														: 'No date'
												}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Ends at</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="address"
												value={
													organizationSubscriptionState.end_at !== null
														? format(
																new Date(organizationSubscriptionState.end_at),
																'dd MMMM yyyy HH:mm'
														  )
														: 'No date'
												}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
							<div style={styles().organizationForm}>
								<div style={{ display: 'flex', flexDirection: 'column' }}>
									<div style={styles().boldTitle}>Cancel at</div>
									{isEmptyObject(organizationSubscriptionState) ||
									organizationSettingsLoaderManager.subscription ? (
										<Skeleton
											variant="rounded"
											width={350}
											height={30}
											sx={{ margin: '8px 0px' }}
										/>
									) : (
										<FormControl>
											<Input
												className={cssStyles.common_input_type}
												id="address"
												value={
													organizationSubscriptionState.cancel_at !== null
														? format(
																new Date(
																	organizationSubscriptionState.cancel_at
																),
																'dd MMMM yyyy HH:mm'
														  )
														: 'No date'
												}
												disabled
											/>
										</FormControl>
									)}
								</div>
							</div>
						</>
					}
				/>
			</Grid>
		</HasAccess>
	);
};

export default Subscription;
