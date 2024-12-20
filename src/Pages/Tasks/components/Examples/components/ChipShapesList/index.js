import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Components
import { Box } from '@mui/system';
import {
	Collapse,
	IconButton,
	List,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

// Styles
import styles from './styles';
import { colors } from '../../../../../../consts/colors';

// Services
import {
	addObjectSelectionFromShapeChips,
	onDeleteShape,
} from '../../Editors/ImageFileEditor.services';
import { imageShapeToThumbnail } from '../../../../../../services/imageShapeToThumbnail';

const ChipShapesList = (props) => {
	const {
		selectedShape,
		setSelectedShape,
		editor,
		currentElementShapes,
		imageUrl,
		onDeleteShapeProps,
	} = props;

	// Local states
	const [showAnomalyList, setShowAnomalyList] = useState(true);

	useEffect(() => {
		if (showAnomalyList && currentElementShapes?.length > 0) {
			currentElementShapes.forEach((shape) => {
				imageShapeToThumbnail({ shape, imageUrl });
			});
		}
	}, [currentElementShapes, showAnomalyList, onDeleteShape]);

	useEffect(() => {
		addObjectSelectionFromShapeChips({
			editor,
			selectedShape,
		});
	}, [selectedShape]);

	const handleSelectShape = (shapeUUID) => {
		setSelectedShape(shapeUUID);
	};

	const handleDeleteShape = (shapeUUID) => {
		if (selectedShape)
			onDeleteShape({
				...onDeleteShapeProps,
				selectedShapeOutput: shapeUUID,
			});
	};

	return (
		<List
			component="nav"
			subheader={
				<Box
					onClick={() => setShowAnomalyList(!showAnomalyList)}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					{showAnomalyList ? <ExpandLess /> : <ExpandMore />}
					<Typography
						variant="body1"
						component="div"
						sx={{
							width: '100%',
							fontWeight: 'bold',
							color: 'text.primary',
						}}
					>
						Shapes list:
					</Typography>
				</Box>
			}
			sx={{
				mt: 2,
			}}
		>
			<Collapse in={showAnomalyList} timeout="auto" unmountOnExit>
				{currentElementShapes && currentElementShapes.length > 0 && (
					<Box sx={styles().shapesChipsContainer}>
						<TableContainer component={Paper}>
							<Table aria-label="simple table">
								<TableHead>
									<TableRow
										sx={{
											borderBottom: `2px solid ${colors.lightBorderColor}`,
										}}
									>
										<TableCell
											sx={styles().tableTitle}
											align="center"
											width={100}
										>
											Shape preview
										</TableCell>
										<TableCell
											sx={styles().tableTitle}
											align="center"
											width={100}
										>
											Delete
										</TableCell>
									</TableRow>
								</TableHead>
								{currentElementShapes.map((shape) => (
									<TableBody>
										<TableRow
											key={shape.uuid}
											sx={{
												cursor: 'pointer',
												backgroundColor:
													selectedShape === shape.uuid ||
													selectedShape === shape.id
														? colors.ligthBlue
														: 'none',
												'&:hover': {
													backgroundColor: colors.ligthBlue,
												},
											}}
											onClick={() => handleSelectShape(shape.uuid)}
										>
											<TableCell sx={styles().tableTitle} align="center">
												{imageUrl && shape.polygon && (
													<canvas id={shape.uuid} width={50} height={50} />
												)}
											</TableCell>
											<TableCell sx={styles().tableTitle} align="center">
												<IconButton
													style={{ margin: 0, padding: 0 }}
													onClick={() => handleDeleteShape(shape.uuid)}
												>
													<DeleteForeverOutlinedIcon sx={{ height: '20px' }} />
												</IconButton>
											</TableCell>
										</TableRow>
									</TableBody>
								))}
							</Table>
						</TableContainer>
					</Box>
				)}
			</Collapse>
		</List>
	);
};

export default ChipShapesList;

ChipShapesList.propTypes = {
	selectedShape: PropTypes.string,
	setSelectedShape: PropTypes.func,
	editor: PropTypes.object,
	currentElementShapes: PropTypes.array,
	imageUrl: PropTypes.string,
	onDeleteShapeProps: PropTypes.object,
};
