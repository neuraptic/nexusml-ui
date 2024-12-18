import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { DialogActions, Input } from '@mui/material';
import StandardModal from '../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../Components/Shared/Buttons/StandardButton';

// Form Validations
import { addOrganizationAppSchema } from '../../../../../../FormValidations';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

// Alerts
import { ORGANIZATION_APP_CREATED } from '../../../../../../AlertsList/organizationSettingsAlerts';
import { ADD_ALERT, REMOVE_ALERT } from '../../../../../../redux/alerts.slice';

// Services
import requestFactory from '../../../../../../services/request.factory';

// Redux
import { GET_ORGANIZATION_APPS } from '../../../../../../redux/organization.slice';

export const AddAppModal = (props) => {
	const { open, setOpen } = props;

	const dispatch = useDispatch();

	// Global States
	const organizationInfoState = useSelector((state) => state.organization.info);
	const userState = useSelector((state) => state.user);

	// Local States
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await addOrganizationAppSchema.fields[name].validate(value).catch((err) => {
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
			icon: null,
		},
		enableReinitialize: true,
		onSubmit: async (values) => {
			let hasError = false;
			await addOrganizationAppSchema.validate(values).catch((err) => {
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
					url: `/organizations/${organizationInfoState.id}/apps`,
					userState,
					data: values,
					dispatch,
				});

				if (res && res !== null) {
					dispatch(
						ADD_ALERT({ type: 'success', message: ORGANIZATION_APP_CREATED })
					);
					setTimeout(() => {
						dispatch(REMOVE_ALERT(ORGANIZATION_APP_CREATED));
					}, 2000);
					dispatch(
						GET_ORGANIZATION_APPS({
							organizationId: organizationInfoState.id,
							userState,
							dispatch,
						})
					);
					setOpen(false);
				}

				setButtonLoading(false);
			}
		},
	});

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Create a new APP:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div className={cssStyles.modal_from_section}>
						<Box sx={styles().dialogContentContainer}>
							{
								// todo: add upload logo
							}
							<Box sx={styles().dialogContent} style={{ maxWidth: '70%' }}>
								<div style={{ fontSize: '13px' }}>Name</div>
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
								<div style={{ fontSize: '13px' }}>Description</div>
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
							value="Create APP"
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

AddAppModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};
