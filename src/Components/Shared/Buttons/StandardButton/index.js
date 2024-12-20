import { useState } from 'react';
import PropTypes from 'prop-types';

// Components
import { Button, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CustomTooltip } from '../../CustomTooltip';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

function StandardButton(props) {
	const {
		type,
		variant,
		handleClick,
		handleChange,
		value,
		linkTo = null,
		close = null,
		loading,
		icon,
		id,
		name,
		accept,
		disabled,
		tooltip = null,
		multivalue = false,
	} = props;

	// Local states
	const [anchorDropdown, setAnchorDropdown] = useState(null);
	const openDropdown = Boolean(anchorDropdown);

	const handleLinkTo = () => {
		if (linkTo) window.location.replace(`https://${linkTo}`);
	};

	const handleClickDropdown = (event) => {
		setAnchorDropdown(event.currentTarget);
	};
	const handleCloseDropdown = (e) => {
		if (e.target.id) handleChange(e);
		setAnchorDropdown(null);
	};

	if (loading) {
		return (
			<LoadingButton loading variant="outlined" sx={styles().loadingButton}>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</LoadingButton>
		);
	}

	if (type === 'uploadFile') {
		if (loading) {
			return (
				<LoadingButton loading variant="outlined" sx={styles().loadingButton}>
					{value}
				</LoadingButton>
			);
		}

		if (multivalue)
			return (
				<Button
					variant="contained"
					component="label"
					sx={styles().button}
					startIcon={icon}
				>
					<Typography noWrap sx={{ ...styles().buttonTypography }}>
						{value}
					</Typography>
					<input
						hidden
						accept={accept}
						multiple
						type="file"
						onClick={handleClick}
						onChange={handleChange}
						id={id}
						name={name}
					/>
				</Button>
			);
		return (
			<Button
				variant="contained"
				component="label"
				sx={styles().button}
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
				<input
					hidden
					accept={accept}
					type="file"
					onClick={handleClick}
					onChange={handleChange}
					id={id}
					name={name}
				/>
			</Button>
		);
	}

	if (type === 'danger') {
		return (
			<Button
				className={cssStyles.danger_btn}
				onClick={() => {
					if (linkTo) handleLinkTo();
					if (handleClick) handleClick();
				}}
				variant="contained"
				color="error"
				size="small"
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}

	if (type === 'textButton') {
		return (
			<Button
				type="button"
				sx={styles().textButton}
				onClick={() => {
					if (linkTo) handleLinkTo();
					if (handleClick) handleClick();
				}}
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}

	if (type === 'disabled') {
		if (tooltip) {
			return (
				<Tooltip title={tooltip}>
					<Button
						sx={{ ...styles().button, ...styles().closeButton }}
						variant="contained"
						disabled
						startIcon={icon}
					>
						{value}
					</Button>
				</Tooltip>
			);
		}
		return (
			<Button
				sx={{ ...styles().button, ...styles().closeButton }}
				variant="contained"
				disabled
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}

	if (type === 'filled') {
		return (
			<Button
				sx={styles().button}
				onClick={() => {
					if (handleClick) handleClick();
				}}
				variant="contained"
				disabled={disabled || false}
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}

	if (type === 'with-icon') {
		return (
			<Button
				sx={styles().withIcon}
				onClick={() => {
					if (handleClick) handleClick();
				}}
				variant="contained"
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}

	if (type === 'submit') {
		return (
			<Button
				sx={styles().button}
				variant="contained"
				size="small"
				type="submit"
				onClick={() => {
					if (handleClick) handleClick();
				}}
				loading
				startIcon={icon}
			>
				<Typography noWrap sx={styles().buttonTypography}>
					{value}
				</Typography>
			</Button>
		);
	}
	if (type === 'icon') {
		if (variant === 'dropdown') {
			if (tooltip)
				return (
					<CustomTooltip title={tooltip}>
						<div>
							<Button
								sx={
									close !== null
										? {
												...styles().button,
												...styles().closeButton,
												padding: '6px !important',
												minWidth: '0px !important',
										  }
										: {
												...styles().button,
												padding: '6px !important',
												minWidth: '0px !important',
										  }
								}
								onClick={(e) => {
									if (linkTo) handleLinkTo();
									if (handleClick) handleClickDropdown(e);
								}}
								variant="contained"
								size="small"
								disabled={variant === 'disabled'}
							>
								{icon}
							</Button>
							<Menu
								anchorEl={anchorDropdown}
								open={openDropdown}
								onClose={handleCloseDropdown}
							>
								{value.map((val, index) => (
									<MenuItem
										key={index}
										id={val.value}
										onClick={(e) => handleCloseDropdown(e)}
									>
										{val.display}
									</MenuItem>
								))}
							</Menu>
						</div>
					</CustomTooltip>
				);
			return (
				<div>
					<Button
						sx={
							close !== null
								? {
										...styles().button,
										...styles().closeButton,
										padding: '6px !important',
										minWidth: '0px !important',
								  }
								: {
										...styles().button,
										padding: '6px !important',
										minWidth: '0px !important',
								  }
						}
						onClick={(e) => {
							if (linkTo) handleLinkTo();
							if (handleClick) handleClickDropdown(e);
						}}
						variant="contained"
						size="small"
						disabled={variant === 'disabled'}
					>
						{icon}
					</Button>
					<Menu
						anchorEl={anchorDropdown}
						open={openDropdown}
						onClose={handleCloseDropdown}
					>
						{value.map((val, index) => (
							<MenuItem
								key={index}
								id={val.value}
								onClick={(e) => handleCloseDropdown(e)}
							>
								{val.display}
							</MenuItem>
						))}
					</Menu>
				</div>
			);
		}

		if (tooltip)
			return (
				<CustomTooltip title={tooltip}>
					<div>
						<Button
							sx={
								close !== null || variant === 'disabled'
									? {
											...styles().button,
											...styles().closeButton,
											padding: '6px !important',
											minWidth: '0px !important',
									  }
									: {
											...styles().button,
											padding: '6px !important',
											minWidth: '0px !important',
									  }
							}
							onClick={() => {
								if (linkTo) handleLinkTo();
								if (handleClick) handleClick();
							}}
							variant="contained"
							size="small"
							disabled={variant === 'disabled'}
						>
							{icon}
						</Button>
					</div>
				</CustomTooltip>
			);

		return (
			<div>
				<Button
					sx={
						close !== null || variant === 'disabled'
							? {
									...styles().button,
									...styles().closeButton,
									padding: '6px !important',
									minWidth: '0px !important',
							  }
							: {
									...styles().button,
									padding: '6px !important',
									minWidth: '0px !important',
							  }
					}
					onClick={(e) => {
						if (linkTo) handleLinkTo();
						if (handleClick) handleClick(e);
					}}
					variant="contained"
					size="small"
					disabled={variant === 'disabled'}
				>
					{icon}
				</Button>
			</div>
		);
	}

	return (
		<Button
			sx={
				close !== null
					? { ...styles().button, ...styles().closeButton }
					: { ...styles().button }
			}
			onClick={() => {
				if (linkTo) handleLinkTo();
				if (handleClick) handleClick();
			}}
			variant="contained"
			size="small"
			startIcon={icon}
		>
			<Typography noWrap sx={styles().buttonTypography}>
				{value}
			</Typography>
		</Button>
	);
}

StandardButton.propTypes = {
	type: PropTypes.string,
	variant: PropTypes.string,
	tooltip: PropTypes.string,
	handleClick: PropTypes.func,
	linkTo: PropTypes.string,
	value: PropTypes.any,
	close: PropTypes.bool,
	loading: PropTypes.bool,
	icon: PropTypes.element,
	handleChange: PropTypes.func,
	id: PropTypes.string,
	name: PropTypes.string,
	accept: PropTypes.string,
	disabled: PropTypes.bool,
	multivalue: PropTypes.bool,
};

export default StandardButton;
