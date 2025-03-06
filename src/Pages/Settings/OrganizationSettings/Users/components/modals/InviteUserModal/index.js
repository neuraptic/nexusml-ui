import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { DialogActions, Input } from '@mui/material';

// Modals
import StandardModal from '../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../Components/Shared/Buttons/StandardButton';

// Form validations
import { inviteUserValidationSchema } from '../../../../../../../FormValidations';

// Alerts
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../redux/alerts.slice';
import { ORGANIZATION_USER_INVITED } from '../../../../../../../AlertsList/organizationSettingsAlerts';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Contexts
import ConfigContext from '../../../../../../../Providers/ConfigContext';

export const InviteUserModal = (props) => {
	const { open, setOpen } = props;
	const { apiUrl } = useContext(ConfigContext);

	const dispatch = useDispatch();

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const organizationInfoState = useSelector((state) => state.organization.info);

	// Local states
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await inviteUserValidationSchema.fields[name]
			.validate(value)
			.catch((err) => {
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
	};

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			setButtonLoading(false);
			let hasError = false;
			await inviteUserValidationSchema.validate(values).catch((err) => {
				hasError = true;
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
			if (!hasError) {
				setButtonLoading(true);
				const res = await fetch(
					`${apiUrl}/organizations/${organizationInfoState.id}/users/invite`,
					{
						method: 'POST',
						headers: {
							Authorization: `Bearer ${accessToken}`,
							'content-type': 'application/json',
							cors: 'no-cors',
						},
						body: JSON.stringify(values),
					}
				);

				let json = null;

				if (res.status === 204) {
					dispatch(
						ADD_ALERT({ type: 'success', message: ORGANIZATION_USER_INVITED })
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_USER_INVITED));
					}, 2000);
					setOpen(false);
				}

				if (res) {
					json = await res.json();
				}

				if (json.error) {
					dispatch(ADD_ALERT({ type: 'error', message: json.error.message }));
				} else if (json.errors) {
					Object.keys(json.errors.json).forEach((error) => {
						dispatch(
							ADD_ALERT({
								type: 'error',
								message: json.errors.json[error][0],
							})
						);
					});
				} else {
					dispatch(
						ADD_ALERT({
							type: 'error',
							message:
								'An unexpected error has occurred. Contact contact@neuraptic.ai for support.',
						})
					);
				}
			}
			setButtonLoading(false);
		},
	});

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Add user to organization:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							<div style={{ fontSize: '13px' }}>
								<p>
									Enter on the text field bellow the user email that you want to
									add to your organization. You cannot add multiple users at
									once.
								</p>

								<p>
									<b>Note:</b> The user will be added to the organization only
									if it is not already a member of any other organization.
								</p>

								<p>
									Also, you have to make sure that the user has previously
									created an account on the{' '}
									<a href="https://accounts.neuraptic.ai/">
										Neuraptic Identity Platform
									</a>
									. If not, we will send an email to the user so that he can
									create an account, but you will have to repeat the process
									once he is registered.
								</p>
							</div>
							<Box sx={styles().dialogContent} style={{ maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>Email address</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="email"
										name="email"
										type="email"
										placeholder="Email"
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
										value={formik.values.email}
									/>
								</FormControl>
							</Box>
						</Box>
					</div>
					<DialogActions>
						<StandardButton
							className={cssStyles.light_blue_bg_btn}
							value="Invite user"
							type="submit"
							loading={buttonLoading}
						/>
						<StandardButton
							className={cssStyles.light_gray_bg_btn}
							value="Close"
							handleClick={() => setOpen(!open)}
							close
						/>
					</DialogActions>
				</form>
			}
		/>
	);
};

InviteUserModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
