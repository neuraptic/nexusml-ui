import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// Components
import {
	Chip,
	FormControl,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
} from '@mui/material';
import { Box } from '@mui/system';
import StandardButton from '../../../../../../../../Components/Shared/Buttons/StandardButton';
import StandardModal from '../../../../../../../../Components/Shared/StandardModal';

// Styles
import cssStyles from '../styles.module.css';

export const AddRoleModal = (props) => {
	const { open, setOpen, handleAddUserRoles, currentRoles } = props;

	// Global states
	const { roles: organizationRolesState } = useSelector(
		(state) => state.organization
	);

	// Local states
	const [rolesList, setRolesList] = useState([]);
	const [selectedRoles, setSelectedRoles] = useState([]);

	useEffect(() => {
		setSelectedRoles([]);
		if (open) {
			const tmpRoles = organizationRolesState.filter((orgRole) => {
				if (currentRoles.some((role) => role.id === orgRole.id)) return false;
				return true;
			});

			setRolesList(tmpRoles);
		}
	}, [open]);

	const handleChange = (e) => {
		setSelectedRoles(
			typeof e.target.value === 'string'
				? e.target.value.split(',')
				: e.target.value
		);
		const tmpRoles = rolesList.filter(
			(role) => !e.target.value.includes(role.name)
		);
		setRolesList(tmpRoles);
	};

	return (
		<StandardModal
			open={open}
			setOpen={setOpen}
			title="Add roles:"
			content={
				<FormControl sx={{ m: 1, width: 300 }}>
					<InputLabel id="demo-multiple-chip-label">Roles</InputLabel>
					<Select
						labelId="demo-multiple-chip-label"
						id="demo-multiple-chip"
						multiple
						fullWidth
						value={selectedRoles}
						onChange={handleChange}
						input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
						renderValue={(selected) => (
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
								{selected.map((value) => (
									<Chip key={value} label={value} />
								))}
							</Box>
						)}
						MenuProps={{
							PaperProps: {
								style: {
									maxHeight: 48 * 4.5 + 8,
									width: 250,
								},
							},
						}}
					>
						{rolesList.map((role) => (
							<MenuItem key={role.id} value={role.name}>
								{role.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			}
			actions={
				<div style={{ display: 'flex', gap: '12px' }}>
					<StandardButton
						type="filled"
						value="Add Roles"
						handleClick={() => handleAddUserRoles(selectedRoles)}
						disabled={selectedRoles.length === 0}
					/>
					<StandardButton
						className={cssStyles.light_gray_bg_btn}
						value="Close"
						handleClick={setOpen}
						close
					/>
				</div>
			}
		/>
	);
};

AddRoleModal.propTypes = {
	open: PropTypes.bool,
	setOpen: PropTypes.func,
	handleAddUserRoles: PropTypes.func,
	currentRoles: PropTypes.array,
};
