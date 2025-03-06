import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';

// Components
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import StandardButton from '../../Components/Shared/Buttons/StandardButton';
import { TextInput } from '../../Components/Shared/Inputs';

// Styles
import styles from './styles';
import { completeProfileValidationSchema } from '../../FormValidations';
import { ADD_ALERT, REMOVE_ALERT } from '../../redux/alerts.slice';

// Alerts
import { ORGANIZATION_USER_INVITED } from '../../AlertsList/organizationSettingsAlerts';

// Contexts
import ConfigContext from '../../Providers/ConfigContext';

export const CompleteProfile = () => {
	const dispatch = useDispatch();

	const { appName, appLogoWithName, apiUrl } = useContext(ConfigContext);

	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);
	const { info: organizationInfoState } = useSelector(
		(state) => state.organization
	);

	const [userInfoErrors, setUserInfoErrors] = useState({
		first_name: '',
		last_name: '',
	});
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		const res = await completeProfileValidationSchema.fields[name]
			.validate(value)
			.catch((err) => {
				setUserInfoErrors({
					...userInfoErrors,
					[name]: err.errors[0],
				});
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
		if (res !== undefined) {
			setUserInfoErrors({ ...userInfoErrors, [name]: '' });
		}
	};

	const formik = useFormik({
		initialValues: {
			first_name: '',
			last_name: '',
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			let hasError = false;
			await completeProfileValidationSchema.validate(values).catch((err) => {
				hasError = true;
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});

			if (!hasError) {
				setButtonLoading(true);
				const res = await fetch(
					`/organizations/${organizationInfoState.id}/users/confirm-invitation`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'content-type': 'application/json',
							cors: 'no-cors',
						},
						body: JSON.stringify({ ...values, email: userState.email }),
					}
				);

				if (res && res.ok) {
					dispatch(
						ADD_ALERT({ type: 'success', message: ORGANIZATION_USER_INVITED })
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_USER_INVITED));
					}, 2000);
				} else {
					const res2 = await fetch(
						`${apiUrl}/organizations/${organizationInfoState.id}/users/confirm-invitation`,
						{
							method: 'POST',
							headers: {
								Authorization: `Bearer ${accessToken}`,
								'content-type': 'application/json',
								cors: 'no-cors',
							},
							body: JSON.stringify({ ...values, email: userState.email }),
						}
					);
					if (res2) {
						dispatch(
							ADD_ALERT({ type: 'success', message: 'User added succesfully' })
						);
						setTimeout(() => {
							dispatch(REMOVE_ALERT(ORGANIZATION_USER_INVITED));
						}, 2000);
					}
				}
				setButtonLoading(false);
			}
		},
	});

	return (
		<Grid container sx={{ height: '85vh' }}>
			<Grid item xl={4} lg={4} xs={12} md={12} sm={12}>
				<Box sx={styles().pageTitleContainer}>
					<img src={appLogoWithName} alt="" style={{ height: '15vh' }} />
					<div
						style={{
							marginLeft: '6px',
							display: 'flex',
							flexDirection: 'column',
							lineHeight: '3.5rem',
							fontFamily: 'Montserrat-Regular',
						}}
					>
						<div style={{ fontSize: '6rem' }}>{appName}</div>
					</div>
				</Box>
			</Grid>

			<Grid item xl={8} lg={8} xs={12} md={12} sm={12}>
				<form onSubmit={formik.handleSubmit}>
					<Box
						sx={{
							...styles().contentContainer,
							pt: {
								xl: '195px',
								lg: '195px',
								xs: '40px',
								md: '30px',
								sm: '30px',
							},
							pl: {
								xl: '157px',
								lg: '157px',
								md: '40px',
								sm: '40px',
								xs: '40px',
							},
						}}
					>
						<Grid
							item
							display="flex"
							xs={12}
							md={6}
							flexDirection="column"
							sx={{ gap: '7px' }}
						>
							<Typography
								sx={{
									fontSize: 13,
									letterSpacing: '0.14px',
									color: '#545454',
									fontWeight: 700,
								}}
							>
								First name
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.first_name}
								id="first_name"
								name="first_name"
								placeholder="First name"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={userInfoErrors.first_name !== ''}
								helperText={userInfoErrors.first_name}
							/>
						</Grid>
						<Grid
							item
							display="flex"
							xs={12}
							md={6}
							flexDirection="column"
							sx={{ gap: '7px' }}
						>
							<Typography
								sx={{
									fontSize: 13,
									letterSpacing: '0.14px',
									color: '#545454',
									fontWeight: 700,
								}}
							>
								Last name
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.last_name}
								name="last_name"
								placeholder="1255 New Hampshire Ave NW"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={userInfoErrors.last_name !== ''}
								helperText={userInfoErrors.last_name}
							/>
						</Grid>

						{
							// Marketing
						}
						<Grid container>
							<Box display="flex" flexDirection="column" sx={{ gap: '13px' }}>
								<Box sx={{ mt: '25px' }}>
									<StandardButton
										value="Submit"
										type="submit"
										loading={buttonLoading}
									/>
								</Box>
							</Box>
						</Grid>
					</Box>
				</form>
			</Grid>
		</Grid>
	);
};
