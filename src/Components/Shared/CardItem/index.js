import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

// Components
import { Card, Skeleton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AppsIcon from '@mui/icons-material/Apps';
import { Box } from '@mui/system';

// Styles
import styles from './styles';
import cssStyles from './styles.module.css';

const CardItemLoader = (props) => {
	const { size } = props;
	const items = [...Array(size).keys()];

	return (
		<Box
			sx={{
				mx: 2,
				my: 2,
				gap: 1,
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{items.map((item, index) => (
				<Skeleton
					key={item + index}
					variant="rounded"
					height={60}
					sx={{ width: '100%' }}
				/>
			))}
		</Box>
	);
};

function CardItem(props) {
	const {
		type,
		title = null,
		titleimg,
		titleicon,
		titlelink,
		titleSeparator,
		children,
		sx,
		loading,
		loaderSize,
		closeIcon,
		open,
		setOpen,
	} = props;

	const date = format(new Date(), 'dd MMM HH:mm');

	if (type === 'task') {
		return (
			<Card
				className={cssStyles.equal_padding}
				{...props}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					...sx,
				}}
				title=""
			>
				<div style={styles().taskHeaderContainer}>
					{title !== null && (
						<div style={styles().taskIcon}>
							{titleicon && titleicon}
							{titleimg && <img src={titleimg} alt="title-img" />}
							{!titleicon && !titleimg && <AppsIcon />}
						</div>
					)}
					<div style={styles().taskTitleContainer}>
						<div style={styles().title}>{title}</div>
						<div style={styles().subTitle}>
							<AccessTimeOutlinedIcon fontSize="x-small" />
							Created at {date}
						</div>
					</div>
					{titlelink && <div style={styles().taskTitleLink}>{titlelink}</div>}
					{closeIcon && (
						<FontAwesomeIcon
							icon={faCircleXmark}
							style={{
								fontSize: '18px',
								color: 'red',
							}}
							onClick={setOpen(!open)}
						/>
					)}
				</div>
				{loading ? (
					<CardItemLoader size={loaderSize || 4} />
				) : (
					<div style={styles().content}>{children}</div>
				)}
			</Card>
		);
	}

	if (type === 'bigLeftIcon') {
		return (
			<Card
				className={cssStyles.equal_padding}
				{...props}
				sx={{
					width: '100%',
					display: 'flex',
					gap: 1,
					...sx,
				}}
				title=""
			>
				{title !== null && (
					<div style={styles().bigLeftIcon}>
						{titleicon && titleicon}
						{titleimg && <img src={titleimg} alt="title-img" />}
						{!titleicon && !titleimg && <AppsIcon />}
					</div>
				)}
				<div style={styles().bigLeftIconTitleContent}>
					<div style={styles().title}>{title}</div>
					{loading ? (
						<CardItemLoader size={loaderSize || 4} />
					) : (
						<div style={styles().content}>{children}</div>
					)}
				</div>
			</Card>
		);
	}

	if (type === 'noIcon')
		return (
			<Card
				className={cssStyles.equal_padding}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					...sx,
				}}
			>
				{title !== null && (
					<div style={styles().titleContainer} id="title-container">
						<div style={styles().title}>{title}</div>
						{titlelink && <div style={styles().titleLink}>{titlelink}</div>}
						{closeIcon && (
							<div style={styles().titleLink}>
								<FontAwesomeIcon
									icon={faCircleXmark}
									style={{
										fontSize: '25px',
										color: 'red',
										cursor: 'pointer',
									}}
									onClick={() => setOpen(!open)}
								/>
							</div>
						)}
					</div>
				)}
				{titleSeparator && <hr style={{ padding: '0px' }} />}
				{loading ? (
					<CardItemLoader size={loaderSize || 4} />
				) : (
					<div style={styles().content}>{children}</div>
				)}
			</Card>
		);

	if (!type)
		return (
			<Card
				className={cssStyles.equal_padding}
				{...props}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 1,
					...sx,
				}}
				title=""
			>
				{title !== null && (
					<div style={{ ...styles().titleContainer, padding: '6px 0px' }}>
						{titleicon && titleicon}
						{titleimg && <img src={titleimg} alt="title-img" />}
						{!titleicon && !titleimg && <AppsIcon />}
						<div style={styles().title}>{title}</div>
						{titlelink && <div style={styles().titleLink}>{titlelink}</div>}
					</div>
				)}
				{loading ? (
					<CardItemLoader size={loaderSize || 4} />
				) : (
					<div style={styles().content}>{children}</div>
				)}
			</Card>
		);
}

CardItem.propTypes = {
	children: PropTypes.any,
	sx: PropTypes.object,
	type: PropTypes.string,
	title: PropTypes.any,
	titleimg: PropTypes.string,
	titleicon: PropTypes.object,
	titlelink: PropTypes.object,
	titleSeparator: PropTypes.bool,
	loading: PropTypes.bool,
	loaderSize: PropTypes.string,
	closeIcon: PropTypes.any,
	open: PropTypes.bool,
	setOpen: PropTypes.func,
};

CardItemLoader.propTypes = {
	size: PropTypes.number,
};

export default CardItem;
