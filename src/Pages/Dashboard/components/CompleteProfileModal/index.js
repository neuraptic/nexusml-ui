import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { DialogActions, Input } from '@mui/material';
import StandardModal from '../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';

// Constants
import { completeProfileValidationSchema } from '../../../../FormValidations/organizationSettings';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';
import { ORGANIZATION_USER_INVITED } from '../../../../AlertsList/organizationSettingsAlerts';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Redux
import { GET_USER } from '../../../../redux/user.slice';

// Services
import requestFactory from '../../../../services/request.factory';

// Contexts
import ConfigContext from '../../../../Providers/ConfigContext';

export const CompleteProfileModal = (props) => {
	const { open, setOpen } = props;
	const { apiUrl } = useContext(ConfigContext);

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const organizationInfoState = useSelector((state) => state.organization.info);

	// Local states
	const [buttonLoading, setButtonLoading] = useState(false);

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
				const res = await requestFactory({
					type: 'POST',
					url: `/organizations/${organizationInfoState.id}/users/${userState.id}/confirm-invitation`,
					userState,
					data: { ...values, email: userState.email },
					dispatch,
				});

				if (res && res.ok) {
					await dispatch(GET_USER({ userState, dispatch, apiUrl }));
					dispatch(
						ADD_ALERT({ type: 'success', message: ORGANIZATION_USER_INVITED })
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_USER_INVITED));
					}, 2000);
					setOpen(false);
				} else {
					const res2 = await requestFactory({
						type: 'POST',
						url: `/organizations/${organizationInfoState.id}/users/${userState.id}/confirm-invitation`,
						userState,
						data: { ...values, email: userState.email },
						dispatch,
					});
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
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Complete your profile"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							<div style={{ fontSize: '13px' }}>
								<p>Before continue to the app, please, complete your profile</p>
							</div>
							<Box sx={styles().dialogContent} style={{ maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>First name</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="first_name"
										name="first_name"
										type="text"
										placeholder="First name"
										onChange={formik.handleChange}
										value={formik.values.first_name}
									/>
								</FormControl>
							</Box>
							<Box sx={{ ...styles().dialogContent, maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>Last name</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="last_name"
										name="last_name"
										type="text"
										placeholder="Last name"
										onChange={formik.handleChange}
										value={formik.values.last_name}
									/>
								</FormControl>
							</Box>
						</Box>
					</div>
					<DialogActions>
						<StandardButton
							className={cssStyles.light_blue_bg_btn}
							value="Complete profile"
							type="submit"
							loading={buttonLoading}
						/>
					</DialogActions>
				</form>
			}
		/>
	);
};

CompleteProfileModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
