import { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { DialogActions, Input } from '@mui/material';
import StandardModal from '../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../Components/Shared/Buttons/StandardButton';

// Form validations
import { inviteUserValidationSchema } from '../../../../../../../FormValidations';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Alerts
import { ORGANIZATION_COLLABORATOR_ADDED } from '../../../../../../../AlertsList/organizationSettingsAlerts';

// Redux
import { GET_ORGANIZATION_COLLABORATORS } from '../../../../../../../redux/organization.slice';
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../redux/alerts.slice';

// Contexts
import ConfigContext from '../../../../../../../Providers/ConfigContext';

export const AddCollaboratorModal = (props) => {
	const { open, setOpen } = props;

	const { apiUrl } = useContext(ConfigContext);

	const dispatch = useDispatch();

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);
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
					`${apiUrl}/organizations/${organizationInfoState.id}/collaborators`,
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
						ADD_ALERT({
							type: 'success',
							message: ORGANIZATION_COLLABORATOR_ADDED,
						})
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_COLLABORATOR_ADDED));
					}, 2000);
					await dispatch(
						GET_ORGANIZATION_COLLABORATORS({
							organizationId: organizationInfoState.uuid,
							userState,
							dispatch,
						})
					);
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
			title="Add collaborator to organization:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							<div style={{ fontSize: '13px' }}>
								<p>
									Enter on the text field bellow the collaborator email that you
									want to add to your organization. You cannot add multiple
									collaborators at once.
								</p>

								<p>
									<b>Note:</b> This is only available for users that don't
									belong to your current organization.
								</p>

								<p>
									Also, you have to make sure that the user has previously
									created an account on the{' '}
									<a href="https://accounts.neuraptic.ai/">
										Neuraptic Identity Platform
									</a>{' '}
									and already belongs to an organization.
								</p>
							</div>
							<Box sx={{ ...styles().dialogContent, maxWidth: '70%' }}>
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
							value="Add collaborator"
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

AddCollaboratorModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
