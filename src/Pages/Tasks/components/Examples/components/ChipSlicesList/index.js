import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

// Redux
import { DELETE_SLICE } from '../../../../../../redux/examples.slice';

// Consts
import { colors } from '../../../../../../consts/colors';

const ChipSlicesList = (props) => {
	const { currentCellId, selectedSlice, setSelectedSlice, slicesState } = props;

	const dispatch = useDispatch();

	// Global states
	const userState = useSelector((state) => state.user);
	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const { uuid: currentExampleUUID } = useSelector(
		(state) => state.examples.currentExample
	);

	// Local states
	const [showSlicesList, setShowSlicesList] = useState(true);

	const handleSelectSlice = (sliceUUID) => {
		setSelectedSlice(sliceUUID);
	};

	const handleDeleteSlice = (sliceUUID) => {
		dispatch(
			DELETE_SLICE({
				taskId: currentTaskState.uuid,
				exampleId: currentExampleUUID,
				userState,
				dispatch,
				sliceUUID,
			})
		);

		setSelectedSlice(null);
	};

	return (
		<List
			component="nav"
			subheader={
				<Box
					onClick={() => setShowSlicesList(!showSlicesList)}
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					{showSlicesList ? <ExpandLess /> : <ExpandMore />}
					<Typography
						variant="body1"
						component="div"
						sx={{
							width: '100%',
							fontWeight: 'bold',
							color: 'text.primary',
						}}
					>
						Slices list:
					</Typography>
				</Box>
			}
			sx={{
				mt: 2,
			}}
		>
			<Collapse in={showSlicesList} timeout="auto" unmountOnExit>
				{slicesState && slicesState.length > 0 && (
					<Box sx={styles().slicesChipsContainer}>
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
											Start index
										</TableCell>
										<TableCell
											sx={styles().tableTitle}
											align="center"
											width={100}
										>
											End index
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
								{slicesState.map(
									(slice) =>
										slice.element === currentCellId && (
											<TableBody key={slice.uuid}>
												<TableRow
													sx={{
														cursor: 'pointer',
														backgroundColor:
															selectedSlice === slice.uuid
																? colors.ligthBlue
																: 'none',
														'&:hover': {
															backgroundColor: colors.ligthBlue,
														},
													}}
													key={slice.uuid}
													onClick={() => handleSelectSlice(slice.uuid)}
												>
													<TableCell sx={styles().tableTitle} align="center">
														<div style={{ padding: '0px 12px' }}>
															{slice.start_index}
														</div>
													</TableCell>
													<TableCell sx={styles().tableTitle} align="center">
														<div style={{ padding: '0px 12px' }}>
															{slice.end_index}
														</div>
													</TableCell>
													<TableCell sx={styles().tableTitle} align="center">
														<IconButton
															style={{ margin: 0, padding: 0 }}
															onClick={() => handleDeleteSlice(slice.uuid)}
														>
															<DeleteForeverOutlinedIcon
																sx={{ height: '20px' }}
															/>
														</IconButton>
													</TableCell>
												</TableRow>
											</TableBody>
										)
								)}
							</Table>
						</TableContainer>
					</Box>
				)}
			</Collapse>
		</List>
	);
};

export default ChipSlicesList;

ChipSlicesList.propTypes = {
	currentCellId: PropTypes.string,
	selectedSlice: PropTypes.string,
	setSelectedSlice: PropTypes.func,
	slicesState: PropTypes.array,
};
