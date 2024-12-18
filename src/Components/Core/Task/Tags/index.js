import { CirclePicker } from 'react-color';
import PropTypes from 'prop-types';

// Components
import {
	Checkbox,
	Divider,
	Grid,
	Menu,
	MenuItem,
	Typography,
} from '@mui/material';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { CheckBox } from '@mui/icons-material';
import StandardButton from '../../../Shared/Buttons/StandardButton';
import { SearchInput } from '../../../Shared/Inputs/SearchInput';
import { TextInput } from '../../../Shared/Inputs/TextInput';

export const TagMenu = (props) => {
	const { open, setOpen, anchorEl, useState, useEffect } = props;

	const [openCreateTagMenu, setOpenCreateTagMenu] = useState(null);
	const [tagColor, setTagColor] = useState('#000000');

	useEffect(() => {
		if (open !== null) setOpen(!openCreateTagMenu);
	}, [openCreateTagMenu]);

	const handleReturnMainMenu = () => {
		setOpenCreateTagMenu(false);
	};

	const handleOpenCreateTagMenu = () => {
		setOpenCreateTagMenu(true);
		setOpen(false);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleCloseCreateTagMenu = () => {
		// setOpen(true);
		setOpenCreateTagMenu(false);
	};

	return (
		<>
			{
				// Tags main menu
			}
			<Menu
				anchorEl={anchorEl}
				id="main-tag-menu"
				open={open}
				onClose={handleClose}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							width: '300px',
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 150,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								left: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'left', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			>
				<Grid container sx={{ justifyContent: 'center', fontWeight: 'bold' }}>
					Tags
				</Grid>
				<Grid container sx={{ padding: '3px 6px' }}>
					<SearchInput />
				</Grid>
				<Grid
					container
					sx={{
						fontSize: 'small',
						padding: '3px 0px',
						paddingLeft: '6px',
					}}
				>
					Tags:
				</Grid>
				<MenuItem>
					<Grid item xs={1}>
						<Checkbox />
					</Grid>
					<Grid item xs={10} sx={{ paddingLeft: '6px' }}>
						<Typography variant="inherit" noWrap>
							{/* A very long text that overflows more than spected */}
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<FontAwesomeIcon
							icon={faPenToSquare}
							style={{
								cursor: 'pointer',
							}}
							onClick={(e) => {
								// handleClick(e);
							}}
						/>
					</Grid>
				</MenuItem>
				<MenuItem>
					<Grid item xs={1}>
						<CheckBox />
					</Grid>
					<Grid item xs={10} sx={{ paddingLeft: '6px' }}>
						<Typography variant="inherit" noWrap>
							A very long text that overflows more than spected
						</Typography>
					</Grid>
					<Grid item xs={1}>
						<FontAwesomeIcon
							icon={faPenToSquare}
							style={{
								cursor: 'pointer',
							}}
							onClick={(e) => {
								// handleClick(e);
							}}
						/>
					</Grid>
				</MenuItem>
				<Grid container sx={{ justifyContent: 'center', padding: '3px 0px' }}>
					<StandardButton
						value="Create new tag"
						handleClick={handleOpenCreateTagMenu}
					/>
				</Grid>
			</Menu>
			;
			{
				// Create tag menu
			}
			<Menu
				anchorEl={anchorEl}
				id="create-tag-menu"
				open={openCreateTagMenu}
				onClose={handleCloseCreateTagMenu}
				slotProps={{
					paper: {
						elevation: 0,
						sx: {
							width: '300px',
							overflow: 'visible',
							filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
							mt: 1.5,
							'& .MuiAvatar-root': {
								width: 150,
								height: 32,
								ml: -0.5,
								mr: 1,
							},
							'&::before': {
								content: '""',
								display: 'block',
								position: 'absolute',
								top: 0,
								left: 14,
								width: 10,
								height: 10,
								bgcolor: 'background.paper',
								transform: 'translateY(-50%) rotate(45deg)',
								zIndex: 0,
							},
						},
					},
				}}
				transformOrigin={{ horizontal: 'left', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
			>
				<Grid container>
					<Grid
						item
						xs={2}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							padding: '6px 0px',
						}}
					>
						<FontAwesomeIcon
							icon={faArrowLeft}
							style={{
								cursor: 'pointer',
							}}
							onClick={() => {
								handleReturnMainMenu();
							}}
						/>
					</Grid>
					<Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center' }}>
						Create tag
					</Grid>
				</Grid>
				<Divider />
				<Grid container sx={{ padding: '12px' }}>
					<Grid container>
						<Grid item xs={4}>
							Name:
						</Grid>
						<Grid item xs={8}>
							<TextInput value="" placeholder="Tag name" />
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={4}>
							Description:
						</Grid>
						<Grid item xs={8}>
							<TextInput value="" placeholder="Tag description" />
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs={12}>
							Color:
						</Grid>
						<Grid
							item
							xs={12}
							sx={{ display: 'flex', justifyContent: 'center' }}
						>
							<CirclePicker
								color={tagColor}
								onChange={(color) => {
									setTagColor(color.hex);
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
				<Grid container>
					<Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
						<StandardButton value="Create" />
					</Grid>
				</Grid>
			</Menu>
			;
		</>
	);
};

TagMenu.propTypes = {
	open: PropTypes.bool.isRequired,
	setOpen: PropTypes.func.isRequired,
	anchorEl: PropTypes.object.isRequired,
	useState: PropTypes.func.isRequired,
	useEffect: PropTypes.func.isRequired,
};
