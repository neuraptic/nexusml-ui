/* eslint-disable */
import { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

// Components
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Snackbar,
	TextField,
} from '@mui/material';
import { SketchPicker } from 'react-color';

// Alerts
import MuiAlert from '@mui/material/Alert';
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';

const Alert = forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CreateOrUpdateCategoryDialog(props) {
	const {
		openCreateOrUpdateCategoryDialog,
		handleCloseCreateOrUpdateCategoryDialog,
		category,
		handleCreateCategoryElement,
		elementCategories,
		setElementCategories,
	} = props;

	const dispatch = useDispatch();

	// Local states
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [categoryName, setCategoryName] = useState('');
	const [categoryCaption, setCategoryCaption] = useState('');
	const [categoryDescription, setCategoryDescription] = useState('');
	const [categoryColor, setCategoryColor] = useState('#0073ff');
	const [showColorPicker, setShowColorPicker] = useState(false);

	useEffect(() => {
		if (category) {
			setCategoryName(category.name);
			setCategoryCaption(category.display_name);
			setCategoryDescription(category.description);
			setCategoryColor(category.color);
		}
	}, [category]);

	const handleConfirm = () => {
		if (categoryName !== '') {
			if (!elementCategories.find((cat) => cat.name === categoryName)) {
				handleCreateCategoryElement({
					name: categoryName,
					display_name: categoryCaption,
					description: categoryDescription,
					color: categoryColor.replace('#', ''),
				});
			} else {
				dispatch(
					ADD_ALERT({ type: 'warning', message: 'Duplicated category name' })
				);
				setTimeout(() => {
					dispatch(REMOVE_ALERT('Duplicated category name'));
				}, 2000);
			}
		} else {
			dispatch(
				ADD_ALERT({ type: 'warning', message: 'Category name is required' })
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT('Category name is required'));
			}, 2000);
		}

		setCategoryName('');
		setCategoryCaption('');
		setCategoryDescription('');
		setCategoryColor('#0073ff');
	};

	const handleSnackbarClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}
		setSnackbarOpen(false);
	};

	return (
		<>
			<Dialog
				open={openCreateOrUpdateCategoryDialog}
				onClose={() => handleCloseCreateOrUpdateCategoryDialog(false)}
				aria-labelledby="form-dialog-title"
				PaperProps={{
					sx: {
						overflowY: 'visible',
					},
				}}
			>
				<DialogTitle id="form-dialog-title">Create new category</DialogTitle>
				<DialogContent>
					<TextField
						id={'categoryName'}
						label={'Name'}
						value={categoryName}
						fullWidth
						required
						sx={{
							mt: 2,
						}}
						onChange={(event) => setCategoryName(event.target.value)}
					/>
					<TextField
						id={'categoryCaption'}
						label={'Caption'}
						value={categoryCaption}
						fullWidth
						sx={{
							mt: 2,
						}}
						onChange={(event) => setCategoryCaption(event.target.value)}
					/>
					<TextField
						id={'categoryDescription'}
						label={'Description'}
						value={categoryDescription}
						fullWidth
						sx={{
							mt: 2,
						}}
						onChange={(event) => setCategoryDescription(event.target.value)}
					/>
					<Box
						onClick={() => {
							setShowColorPicker(true);
						}}
						sx={{
							p: '5px',
							mt: 2,
							border: '1px solid #e0e0e0',
							width: '100px',
							height: '30px',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Box
							sx={{
								backgroundColor: categoryColor,
								borderRadius: '5px',
								width: '95px',
								height: '15px',
							}}
						/>
					</Box>
					{showColorPicker && (
						<Box
							sx={{
								position: 'absolute',
								zIndex: 9999,
							}}
						>
							<Box
								onClick={() => {
									setShowColorPicker(false);
								}}
								sx={{
									position: 'fixed',
									top: '0',
									left: '0',
									right: '0',
									bottom: '0',
								}}
							/>
							<SketchPicker
								color={categoryColor}
								onChange={(color) => {
									setCategoryColor(color.hex);
								}}
							/>
						</Box>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => handleCloseCreateOrUpdateCategoryDialog(false)}
						color="primary"
					>
						{'Cancel'}
					</Button>
					<Button
						onClick={() => {
							handleConfirm();
						}}
						color="primary"
					>
						{'Create'}
					</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={4000}
				onClose={handleSnackbarClose}
			>
				<Alert onClose={handleSnackbarClose} severity="error">
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</>
	);
}

CreateOrUpdateCategoryDialog.propTypes = {
	openCreateOrUpdateCategoryDialog: PropTypes.bool,
	handleCloseCreateOrUpdateCategoryDialog: PropTypes.func,
	category: PropTypes.object,
	handleCreateOrUpdateCategory: PropTypes.func,
	elementCategories: PropTypes.array,
	setElementCategories: PropTypes.func,
};

export default CreateOrUpdateCategoryDialog;
