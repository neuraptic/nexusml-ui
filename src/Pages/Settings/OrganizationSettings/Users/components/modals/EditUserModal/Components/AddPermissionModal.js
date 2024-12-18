import { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';

// Components
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Checkbox, DialogActions, InputLabel } from '@mui/material';
import StandardModal from '../../../../../../../../Components/Shared/StandardModal';
import StandardButton from '../../../../../../../../Components/Shared/Buttons/StandardButton';

// Constants
import styles from './styles';
import cssStyles from '../styles.module.css';

// Form validations
import { addOrganizationUserPermissionsSchema } from '../../../../../../../../FormValidations';

// Alerts
import {
	ADD_ALERT,
	REMOVE_ALERT,
} from '../../../../../../../../redux/alerts.slice';

export const AddPermissionModal = (props) => {
	const { open, setOpen, handleAddUserPermissions } = props;

	const dispatch = useDispatch();

	// Local states
	const [buttonLoading, setButtonLoading] = useState(false);

	const handleValidate = async (e) => {
		const { name, value } = e.target;
		await addOrganizationUserPermissionsSchema.fields[name]
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
			action: '',
			allow: false,
			resource_type: '',
		},
		onSubmit: async (values) => {
			let hasError = false;
			await addOrganizationUserPermissionsSchema
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
				handleAddUserPermissions(values);
				setButtonLoading(false);
			}
		},
	});

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Create a new user permission:"
			content={
				<form onSubmit={formik.handleSubmit}>
					<div>
						<Box sx={styles().dialogContentContainer}>
							<div style={{ fontSize: '13px' }}>
								<p>
									Please fill in the following information to create a new
									permission. The permission will be granted to the user or role
									you selected automatically.
								</p>
							</div>
							<Box sx={styles().formInput}>
								<FormControl sx={{ width: 300 }}>
									<InputLabel id="action-label">Action *</InputLabel>
									<Select
										name="action"
										labelId="action-label"
										label="Action *"
										value={formik.values.action}
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
									>
										<MenuItem value="none">None</MenuItem>
										<MenuItem value="create">Create</MenuItem>
										<MenuItem value="read">Read</MenuItem>
										<MenuItem value="update">Update</MenuItem>
										<MenuItem value="delete">Delete</MenuItem>
										<MenuItem value="all">All</MenuItem>
									</Select>
								</FormControl>
							</Box>
							<Box sx={{ ...styles().formInput, maxWidth: '70%' }}>
								<Box style={{ marginLeft: 1, width: 300, display: 'flex' }}>
									<FormControl>
										<div>Allow</div>
										<div>
											<Checkbox
												name="allow"
												color="primary"
												sx={{ padding: '0px', paddingLeft: '6px' }}
												checked={formik.values.allow}
												onChange={formik.handleChange}
											/>
										</div>
									</FormControl>
								</Box>
							</Box>
							<Box sx={{ ...styles().formInput, maxWidth: '70%' }}>
								<FormControl sx={{ width: 300 }}>
									<InputLabel id="action-label">Resource type *</InputLabel>
									<Select
										name="resource_type"
										labelId="action-label"
										label="Action *"
										value={formik.values.resource_type}
										onChange={formik.handleChange}
										onBlur={(e) => handleValidate(e)}
									>
										<MenuItem value="none">None</MenuItem>
										<MenuItem value="all">All</MenuItem>
										<MenuItem value="organization">Organization</MenuItem>
										<MenuItem value="task">Task</MenuItem>
										<MenuItem value="file">File</MenuItem>
										<MenuItem value="ai_model">AI model</MenuItem>
										<MenuItem value="example">Example</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Box>
					</div>
					<DialogActions>
						<StandardButton
							className={cssStyles.light_blue_bg_btn}
							value="Add permission"
							type="submit"
							loading={buttonLoading}
						/>
						<StandardButton
							className={cssStyles.light_gray_bg_btn}
							value="Close"
							handleClick={setOpen}
							close
						/>
					</DialogActions>
				</form>
			}
		/>
	);
};

AddPermissionModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleAddUserPermissions: PropTypes.func,
};
