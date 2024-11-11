import { useState } from 'react';
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
import { addOrganizationRoleSchema } from '../../../../../../../FormValidations';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Services
import requestFactory from '../../../../../../../services/request.factory';

// Alerts
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../redux/alerts.slice';
import { ORGANIZATION_ROLE_CREATED } from '../../../../../../../AlertsList/organizationSettingsAlerts';

// Redux
import { GET_ORGANIZATION_ROLES } from '../../../../../../../redux/organization.slice';

export const AddRoleModal = (props) => {
	const { open, setOpen } = props;

	const dispatch = useDispatch();

	// Global states
	const organizationInfoState = useSelector((state) => state.organization.info);
	const userState = useSelector((state) => state.user);

	// Local states
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await addOrganizationRoleSchema.fields[name]
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
			name: '',
			description: '',
		},
		enableReinitialize: true,
		onSubmit: async (values, { resetForm }) => {
			let hasError = false;
			await addOrganizationRoleSchema.validate(values).catch((err) => {
				hasError = true;
				dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
				setTimeout(() => {
					dispatch(REMOVE_ALERT(err.errors[0]));
				}, 2000);
			});
			if (!hasError) {
				setButtonLoading(true);
				await requestFactory({
					type: 'POST',
					url: `/organizations/${organizationInfoState.id}/roles`,
					userState,
					data: values,
					dispatch,
				})
					.then(() => {
						dispatch(
							ADD_ALERT({ type: 'success', message: ORGANIZATION_ROLE_CREATED })
						);
						setTimeout(() => {
							dispatch(REMOVE_ALERT(ORGANIZATION_ROLE_CREATED));
						}, 2000);
						setOpen(false);
						dispatch(
							GET_ORGANIZATION_ROLES({
								organizationId: organizationInfoState.id,
								userState,
								dispatch,
							})
						);
					})
					.catch((err) => {
						dispatch(ADD_ALERT({ type: 'warning', message: err.errors[0] }));
						setTimeout(() => {
							dispatch(REMOVE_ALERT(err.errors[0]));
						}, 2000);
					});
				setButtonLoading(false);
				resetForm();
			}
		},
	});

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Create role:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							<div style={{ fontSize: '13px' }}>
								<p>
									You're trying to add a new role to your organization. Please
									fill in the following fields (all fields showing as red are
									required), and click on the "Create" button.
								</p>
							</div>
							<Box sx={styles().dialogContent} style={{ maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>Name:</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="name"
										name="name"
										type="name"
										placeholder="Name"
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
										value={formik.values.name}
									/>
								</FormControl>
							</Box>
							<Box sx={styles().dialogContent} style={{ maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>Description:</div>
								<FormControl>
									<Input
										className={cssStyles.common_input_type}
										id="description"
										name="description"
										type="description"
										placeholder="Description"
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
										value={formik.values.description}
									/>
								</FormControl>
							</Box>
						</Box>
					</div>
					<DialogActions>
						<StandardButton
							className={cssStyles.light_blue_bg_btn}
							value="Add role"
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

AddRoleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
