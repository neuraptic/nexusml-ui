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

// Form validations
import { editUserInfoValidationSchema } from '../../../../FormValidations';

// Redux
import { SET_USER_INFO } from '../../../../redux/user.slice';

// Alerts
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';
import { USER_MODIFIED } from '../../../../AlertsList/organizationSettingsAlerts';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Contexts
import ConfigContext from '../../../../Providers/ConfigContext';

export const EditUserModal = (props) => {
	const { open, setOpen } = props;
	const { apiUrl } = useContext(ConfigContext);

	const dispatch = useDispatch();

	// Global states
	const { accessToken } = useSelector((state) => state.user);
	const userState = useSelector((state) => state.user);

	// Local states
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await editUserInfoValidationSchema.fields[name]
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
			first_name: userState.first_name,
			last_name: userState.last_name,
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			setButtonLoading(false);
			let hasError = false;
			await editUserInfoValidationSchema.validate(values).catch((err) => {
				hasError = true;
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
			if (!hasError) {
				setButtonLoading(true);
				const res = await fetch(`${apiUrl}/myaccount`, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${accessToken}`,
						'content-type': 'application/json',
						cors: 'no-cors',
					},
					body: JSON.stringify(values),
				});

				let json = null;

				if (res.status === 200) {
					dispatch(SET_USER_INFO(values));
					dispatch(ADD_ALERT({ type: 'success', message: USER_MODIFIED }));
					setTimeout(() => {
						dispatch(REMOVE_ALERT(USER_MODIFIED));
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
				}
			}
			setButtonLoading(false);
		},
	});

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Modify user info:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							<Box sx={{ ...styles().dialogContent, maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>First name</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="first_name"
										name="first_name"
										type="text"
										placeholder="First name"
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
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
										onBlur={(e) => handleValidate(e)}
										value={formik.values.last_name}
									/>
								</FormControl>
							</Box>
						</Box>
					</div>
					<DialogActions>
						<StandardButton
							className={cssStyles.light_blue_bg_btn}
							value="Save"
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

EditUserModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
