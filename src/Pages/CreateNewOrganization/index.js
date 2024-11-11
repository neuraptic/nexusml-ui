import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useFormik } from 'formik';

// Components
import { Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import StandardButton from '../../Components/Shared/Buttons/StandardButton';
import { TextInput } from '../../Components/Shared/Inputs';
import {
	CREATE_ORGANIZATION,
	GET_ORGANIZATION,
} from '../../redux/organization.slice';

// Styles
import styles from './styles';

// Form validations
import {
	completeOrganizationValidationSchema,
	completeProfileValidationSchema,
} from '../../FormValidations';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../redux/alerts.slice';
import { ORGANIZATION_CREATED } from '../../AlertsList/organizationSettingsAlerts';

// Redux
import { GET_USER } from '../../redux/user.slice';
import { APP_IS_LOADING } from '../../redux/loaders.slice';

// Contexts
import ConfigContext from '../../Providers/ConfigContext';

export const CreateNewOrganization = (props) => {
	const { setIsTopMenu } = props;

	const { appName, appLogoWithName, apiUrl } = useContext(ConfigContext);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth0();

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);
	const { info: organizationInfoState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [organizationInfoErrors, setOrganizationInfoErrors] = useState({
		address: '',
		domain: '',
		name: '',
		trn: '',
		mainError: '',
	});
	const [buttonLoading, setButtonLoading] = useState(false);

	useEffect(() => {
		setIsTopMenu(false);
		if (!isAuthenticated) navigate('/signin');
	}, []);

	useEffect(() => {
		if (
			organizationInfoState &&
			Object.keys(organizationInfoState).length > 0
		) {
			navigate('/dashboard');
		}
	}, [organizationInfoState]);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		const res = await completeProfileValidationSchema.fields[name]
			.validate(value)
			.catch((err) => {
				setOrganizationInfoErrors({
					...organizationInfoErrors,
					[name]: err.errors[0],
				});
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
		if (res !== undefined) {
			setOrganizationInfoErrors({ ...organizationInfoErrors, [name]: '' });
		}
	};

	const formik = useFormik({
		initialValues: {
			address: '',
			domain: '',
			name: '',
			trn: '',
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			let hasError = false;
			await completeOrganizationValidationSchema
				.validate(values)
				.catch((err) => {
					hasError = true;
					dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
					setTimeout(() => {
						dispatch(REMOVE_ALERT(err.errors[0]));
					}, 2000);
				});
			if (!hasError) {
				setButtonLoading(true);
				const res = await fetch(`${apiUrl}/organizations`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'content-type': 'application/json',
						cors: 'no-cors',
					},
					body: JSON.stringify(values),
				});

				let json = null;

				if (res.status === 201) {
					dispatch(
						ADD_ALERT({ type: 'success', message: ORGANIZATION_CREATED })
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_CREATED));
					}, 2000);
				}

				if (res) {
					json = await res.json();
				}

				if (json.error)
					setOrganizationInfoErrors({
						...organizationInfoErrors,
						mainError: res.error.message,
					});

				if (json && json !== null && !json.errors) {
					await dispatch(
						GET_USER({
							userState,
							navigate,
							apiUrl,
						})
					);
					await dispatch(
						GET_ORGANIZATION({
							userState,
							dispatch,
							navigate,
							data: values,
						})
					);
					await dispatch(
						CREATE_ORGANIZATION({
							userState,
							dispatch,
							navigate,
							data: values,
						})
					);
					dispatch(APP_IS_LOADING(true));
					navigate('/dashboard');
				}
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
								Company name
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.name}
								id="name"
								name="name"
								placeholder="H&M LLC"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={organizationInfoErrors.name !== ''}
								helperText={organizationInfoErrors.name}
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
								Company address
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.address}
								name="address"
								placeholder="1255 New Hampshire Ave NW"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={organizationInfoErrors.address !== ''}
								helperText={organizationInfoErrors.address}
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
								Company domain
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.domain}
								name="domain"
								placeholder="yourdomain.com"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={organizationInfoErrors.domain !== ''}
								helperText={organizationInfoErrors.domain}
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
								Company TRN number
							</Typography>

							<TextInput
								onChange={formik.handleChange}
								onBlur={(e) => handleValidate(e)}
								value={formik.values.trn}
								name="trn"
								placeholder="SP458622RE144"
								sx={{
									maxWidth: '300px',
									border: '1px solid #70707045',
									borderRadius: '5px',
									background: '#FAFBFD',
								}}
								error={organizationInfoErrors.trn !== ''}
								helperText={organizationInfoErrors.trn}
							/>
						</Grid>

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

CreateNewOrganization.propTypes = {
	setIsTopMenu: PropTypes.func,
};
