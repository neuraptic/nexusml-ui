/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable no-nested-ternary */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// Manage roles & permissions
import { HasAccess } from '@permify/react-role';

// Components
import { Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CardItem from '../../../../Components/Shared/CardItem';
import { Loader } from '../../../../Components/Shared/Loader';
import { ConfirmationDialog } from '../../../../Components/Shared/ConfirmationDialog';
import AccessDenied from '../../../../Components/Core/AccessDenied';
import StandardButton from '../../../../Components/Shared/Buttons/StandardButton';
import CreateOrUpdateElementDialog from '../../../../Components/Core/Task/Dialogs/CreateOrUpdateElementDialog';
import FixedFlow from '../../../../Components/Core/Task/Schema/FixedFlow';

// Styles
import { measures } from '../../../../consts/sizes';
import CSSstyles from './styles.module.css';
import { styles } from './styles';

// Alerts
import { SCHEMA_NODE_DELETED } from '../../../../AlertsList/taskAlerts';

// Redux
// import { DELETE_SCHEMA_NODE, GET_SCHEMA } from '../../../../redux/schema.slice';
import { ADD_ALERT, REMOVE_ALERT } from '../../../../redux/alerts.slice';
import { DELETE_SCHEMA_ELEMENT } from '../../../../redux/schema.slice';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';
// import { colors } from '../../../../consts/colors';

// Services
import { elementTypeToIconMap } from '../../../../services/tasks';

export function TaskSchema() {
	const dispatch = useDispatch();

	const userState = useSelector((state) => state.user);

	const { currentTask: currentTaskState } = useSelector((state) => state.tasks);
	const schemaState = useSelector((state) => state.schema);

	const [openConfirm, setOpenConfirm] = useState(false);
	const [nodeToDeleteId, setNodeToDeleteId] = useState('');
	const [nodeToDeleteType, setNodeToDeleteType] = useState('');
	const [isDeleteLoading, setIsDeleteLoading] = useState(false);

	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState('create');
	const [newElementType, setNewElementType] = useState(null);
	const [elementToModify, setElementToModify] = useState(null);

	// Search states
	const [openSearchInput, setOpenSearchInput] = useState(false);
	const [openSearchOutput, setOpenSearchOutput] = useState(false);
	const [openSearchMetadata, setOpenSearchMetadata] = useState(false);

	const [filteredInputs, setFilteredInputs] = useState(
		schemaState.inputs || []
	);
	const [filteredOutputs, setFilteredOutputs] = useState(
		schemaState.outputs || []
	);
	const [filteredMetadata, setFilteredMetadata] = useState(
		schemaState.metadata || []
	);

	const [searchByInput, setSearchByInput] = useState('');
	const [searchByOutput, setSearchByOutput] = useState('');
	const [searchByMetadata, setSearchByMetadata] = useState('');

	useEffect(() => {
		setFilteredInputs(schemaState.inputs);
		setFilteredOutputs(schemaState.outputs);
		setFilteredMetadata(schemaState.metadata);
	}, [schemaState]);

	const handleOpenConfirmDialog = (type, id) => {
		setNodeToDeleteId(id);
		setNodeToDeleteType(type);
		setOpenConfirm(true);
	};

	const handleDeleteNode = async () => {
		setIsDeleteLoading(true);
		if (nodeToDeleteType && nodeToDeleteId) {
			await dispatch(
				DELETE_SCHEMA_ELEMENT({
					elementType: nodeToDeleteType,
					elementId: nodeToDeleteId,
					taskId: currentTaskState.uuid,
					dispatch,
					userState,
					schemaState,
				})
			);

			dispatch(
				ADD_ALERT({
					type: 'success',
					message: SCHEMA_NODE_DELETED(nodeToDeleteType),
				})
			);
			setTimeout(() => {
				dispatch(REMOVE_ALERT(SCHEMA_NODE_DELETED(nodeToDeleteType)));
			}, 2000);
			setOpenConfirm(false);
			setIsDeleteLoading(false);
			setNodeToDeleteId('');
			setNodeToDeleteType('');
		}
	};

	const handleCreateOrUpdateElement = (mode, elementType, element) => {
		setNewElementType(elementType);
		setElementToModify(element);
		setDialogMode(mode);
		setOpenCreateDialog(true);
	};

	const handleDeleteElement = async (elementType, element) => {
		handleOpenConfirmDialog(elementType, element.uuid);
	};

	// Search functionality
	const handleOpenSearchInput = () => setOpenSearchInput(!openSearchInput);
	const handleOpenSearchOutput = () => setOpenSearchOutput(!openSearchOutput);
	const handleOpenSearchMetadata = () =>
		setOpenSearchMetadata(!openSearchMetadata);

	const highlightMatches = (item, type) => {
		const lowerCaseItem = item.toLowerCase();
		const result = [];

		const searchText =
			type === 'inputs'
				? searchByInput
				: type === 'outputs'
				? searchByOutput
				: searchByMetadata;

		let currentIndex = 0;

		for (let i = 0; i < searchText.length; i += 1) {
			const char = searchText[i];
			const index = lowerCaseItem.indexOf(char.toLowerCase(), currentIndex);

			if (index !== -1) {
				result.push(<span key={i}>{item.substring(currentIndex, index)}</span>);
				result.push(
					<span key={`${i}-highlight`} style={styles.highlight}>
						{item.substring(index, index + char.length)}
					</span>
				);
				currentIndex = index + char.length;
			}
		}

		result.push(<span key="remaining">{item.substring(currentIndex)}</span>);

		return result;
	};

	useEffect(() => {
		if (!openSearchInput) {
			setSearchByInput('');
			setFilteredInputs(schemaState.inputs);
		}
		if (!openSearchOutput) {
			setSearchByOutput('');
			setFilteredOutputs(schemaState.outputs);
		}
		if (!openSearchMetadata) {
			setSearchByMetadata('');
			setFilteredMetadata(schemaState.metadata);
		}
	}, [openSearchInput, openSearchOutput, openSearchMetadata]);

	return (
		<HasAccess
			roles={defaultRoles}
			permissions="task.read"
			renderAuthFailed={<AccessDenied />}
		>
			<Grid container spacing={2}>
				<Grid item xs={12} md={4}>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							...styles.elementContainer,
							marginBottom: 3,
							height: '300px',
							'& > #title-container': {
								paddingLeft: '24px',
								paddingTop: '12px',
								paddingRight: '12px',
							},
						}}
						centerTitle
						titleSeparator
						type="noIcon"
						title="INPUTS"
						titlelink={
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<IconButton
									aria-label="fingerprint"
									color="primary"
									onClick={() => handleOpenSearchInput()}
								>
									<SearchIcon />
								</IconButton>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Add input" />
									}
								>
									<IconButton
										aria-label="fingerprint"
										color="primary"
										onClick={() =>
											handleCreateOrUpdateElement('create', 'inputs', null)
										}
									>
										<AddIcon />
									</IconButton>
									{/* <StandardButton
										value="Add input"
										handleClick={() =>
											handleCreateOrUpdateElement('create', 'inputs', null)
										}
									/> */}
								</HasAccess>
							</div>
						}
					>
						<Grid container sx={{ display: 'flex' }}>
							{openSearchInput && (
								<Grid container>
									<Grid key={uuidv4} item xs={12}>
										<div style={styles.searchContainer}>
											<div style={styles.searchIconWrapper}>
												<SearchIcon />
											</div>
											<input
												key={uuidv4}
												type="text"
												style={styles.styledInputBase}
												onChange={(e) => {
													const { value } = e.target;
													let filteredItems = [];
													filteredItems = schemaState.inputs.filter((item) =>
														item.display_name
															? item.display_name
																	.toLowerCase()
																	.includes(value.toLowerCase())
															: item.name
																	.toLowerCase()
																	.includes(value.toLowerCase())
													);

													setSearchByInput(value);
													setFilteredInputs(filteredItems);
												}}
												value={searchByInput}
												autoFocus
											/>
										</div>
									</Grid>
								</Grid>
							)}
							<Grid
								container
								sx={{
									maxHeight: '200px',
									overflowY: 'auto !important',
									overflowX: 'hidden',
									display: 'flex',
									flexWrap: 'wrap',
									alignContent: 'start',
									padding: '0px 6px',
								}}
							>
								{filteredInputs?.length === 0 && (
									<Grid
										key={uuidv4()}
										item
										xs={12}
										sx={{
											minWidth: '100% !important',
											height: '50px',
											padding: '6px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#00000055',
										}}
									>
										No inputs found
									</Grid>
								)}
								{isDeleteLoading && (
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
											marginTop: '12px',
										}}
									>
										<Loader local />
									</div>
								)}
								{!isDeleteLoading &&
									filteredInputs?.map((input) => (
										<Grid
											key={uuidv4()}
											item
											xs={12}
											sx={{
												...styles.elementComponent,
												height: '50px',
											}}
										>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												{elementTypeToIconMap[input.type]('input')}
											</Grid>
											<Grid
												item
												xs={9}
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'left',
													padding: '0px 6px',
												}}
											>
												<Grid item xs={12} sx={{ fontWeight: 'bold' }}>
													{highlightMatches(
														input.display_name
															? input.display_name
															: input.name,
														'inputs'
													)}
												</Grid>
												<Grid item xs={12} sx={{ fontSize: '0.7rem' }}>
													{input.description ? `-${input.description}` : ''}
												</Grid>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												<HasAccess
													roles={defaultRoles}
													permissions="task.update"
													renderAuthFailed={
														<IconButton disabled>
															<EditIcon />
														</IconButton>
													}
												>
													<IconButton
														sx={{ width: '25px', height: '25px' }}
														color="primary"
														onClick={() =>
															handleCreateOrUpdateElement(
																'update',
																'inputs',
																input
															)
														}
													>
														<EditIcon />
													</IconButton>
												</HasAccess>
											</Grid>
											<Grid item xs={1}>
												<HasAccess
													roles={defaultRoles}
													permissions="task.delete"
													renderAuthFailed={
														<IconButton disabled>
															<DeleteIcon />
														</IconButton>
													}
												>
													<IconButton
														sx={{ width: '25px', height: '25px' }}
														color="error"
														onClick={() => handleDeleteElement('inputs', input)}
													>
														<DeleteIcon />
													</IconButton>
												</HasAccess>
											</Grid>
										</Grid>
									))}
							</Grid>
						</Grid>
					</CardItem>
				</Grid>
				<Grid item xs={12} md={4}>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							...styles.elementContainer,
							marginBottom: 3,
							height: '300px',
							'& > #title-container': {
								paddingLeft: '24px',
								paddingTop: '12px',
								paddingRight: '12px',
							},
						}}
						centerTitle
						titleSeparator
						type="noIcon"
						title="OUTPUTS"
						titlelink={
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<IconButton
									aria-label="fingerprint"
									color="primary"
									onClick={() => handleOpenSearchOutput()}
								>
									<SearchIcon />
								</IconButton>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<IconButton aria-label="fingerprint" color="secondary">
											<AddIcon />
										</IconButton>
									}
								>
									<IconButton
										aria-label="fingerprint"
										color="primary"
										onClick={() =>
											handleCreateOrUpdateElement('create', 'outputs', null)
										}
									>
										<AddIcon />
									</IconButton>
								</HasAccess>
							</div>
						}
					>
						<Grid container sx={{ display: 'flex' }}>
							{openSearchOutput && (
								<Grid container>
									<Grid key={uuidv4} item xs={12}>
										<div style={styles.searchContainer}>
											<div style={styles.searchIconWrapper}>
												<SearchIcon />
											</div>
											<input
												key={uuidv4}
												type="text"
												style={styles.styledInputBase}
												// onBlur={() => setOpenSearchOutput(false)}
												onChange={(e) => {
													const { value } = e.target;
													let filteredItems = [];
													filteredItems = schemaState.outputs.filter((item) =>
														item.display_name
															? item.display_name
																	.toLowerCase()
																	.includes(value.toLowerCase())
															: item.name
																	.toLowerCase()
																	.includes(value.toLowerCase())
													);

													setSearchByOutput(value);
													setFilteredOutputs(filteredItems);
												}}
												value={searchByOutput}
												autoFocus
											/>
										</div>
									</Grid>
								</Grid>
							)}
							<Grid
								item
								sx={{
									height: '200px',
									overflowY: 'auto !important',
									overflowX: 'hidden',
									display: 'flex',
									flexWrap: 'wrap',
									alignContent: 'start',
									padding: '0px 6px',
								}}
							>
								{filteredOutputs?.length === 0 && (
									<Grid
										key={uuidv4()}
										item
										xs={12}
										sx={{
											minWidth: '100% !important',
											height: '50px',
											padding: '6px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#00000055',
										}}
									>
										No outputs found
									</Grid>
								)}

								{isDeleteLoading && (
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
											marginTop: '12px',
										}}
									>
										<Loader local />
									</div>
								)}

								{!isDeleteLoading &&
									filteredOutputs?.map((output) => (
										<Grid key={uuidv4()} item sx={styles.elementComponent}>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												{elementTypeToIconMap[output.type]('output')}
											</Grid>
											<Grid
												item
												xs={9}
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'left',
													padding: '0px 6px',
												}}
											>
												<Grid item xs={12} sx={{ fontWeight: 'bold' }}>
													{highlightMatches(
														output.display_name
															? output.display_name
															: output.name,
														'outputs'
													)}
												</Grid>
												<Grid item xs={12} sx={{ fontSize: '0.7rem' }}>
													{output.description ? `-${output.description}` : ''}
												</Grid>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												<HasAccess
													roles={defaultRoles}
													permissions="task.update"
													renderAuthFailed={
														<IconButton disabled>
															<EditIcon />
														</IconButton>
													}
												>
													<IconButton
														color="primary"
														sx={{ width: '25px', height: '25px' }}
														onClick={() =>
															handleCreateOrUpdateElement(
																'update',
																'outputs',
																output
															)
														}
													>
														<EditIcon />
													</IconButton>
												</HasAccess>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												<HasAccess
													roles={defaultRoles}
													permissions="task.delete"
													renderAuthFailed={
														<IconButton disabled>
															<DeleteIcon />
														</IconButton>
													}
												>
													<IconButton
														color="error"
														sx={{ width: '25px', height: '25px' }}
														onClick={() =>
															handleDeleteElement('outputs', output)
														}
													>
														<DeleteIcon />
													</IconButton>
												</HasAccess>
											</Grid>
										</Grid>
									))}
							</Grid>
						</Grid>
					</CardItem>
				</Grid>
				<Grid item xs={12} md={4}>
					<CardItem
						elevation={measures.cardItemElevation}
						sx={{
							...styles.elementContainer,
							marginBottom: 3,
							height: '300px',
							'& > #title-container': {
								paddingLeft: '24px',
								paddingTop: '12px',
								paddingRight: '12px',
							},
						}}
						centerTitle
						titleSeparator
						type="noIcon"
						title="METADATA"
						titlelink={
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<IconButton
									aria-label="fingerprint"
									color="primary"
									onClick={() => handleOpenSearchMetadata()}
								>
									<SearchIcon />
								</IconButton>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<IconButton aria-label="fingerprint" color="secondary">
											<AddIcon />
										</IconButton>
									}
								>
									<IconButton
										aria-label="fingerprint"
										color="primary"
										onClick={() =>
											handleCreateOrUpdateElement('create', 'metadata', null)
										}
									>
										<AddIcon />
									</IconButton>
									{/* <StandardButton
                value="Add input"
                handleClick={() =>
                  handleCreateOrUpdateElement('create', 'inputs', null)
                }
              /> */}
								</HasAccess>
							</div>
						}
					>
						<Grid container sx={{ display: 'flex' }}>
							{openSearchMetadata && (
								<Grid container>
									<Grid key={uuidv4} item xs={12}>
										<div style={styles.searchContainer}>
											<div style={styles.searchIconWrapper}>
												<SearchIcon />
											</div>
											<input
												key={uuidv4}
												type="text"
												style={styles.styledInputBase}
												// onBlur={() => setOpenSearchMetadata(false)}
												onChange={(e) => {
													const { value } = e.target;
													let filteredItems = [];
													filteredItems = schemaState.metadata.filter((item) =>
														item.display_name
															? item.display_name
																	.toLowerCase()
																	.includes(value.toLowerCase())
															: item.name
																	.toLowerCase()
																	.includes(value.toLowerCase())
													);

													setSearchByMetadata(value);
													setFilteredMetadata(filteredItems);
												}}
												value={searchByMetadata}
												autoFocus
											/>
										</div>
									</Grid>
								</Grid>
							)}
							<Grid
								container
								sx={{
									maxHeight: '200px',
									overflowY: 'auto !important',
									overflowX: 'hidden',
									display: 'flex',
									flexWrap: 'wrap',
									alignContent: 'start',
									padding: '0px 6px',
								}}
							>
								{filteredMetadata?.length === 0 && (
									<Grid
										key={uuidv4()}
										item
										xs={12}
										sx={{
											minWidth: '100% !important',
											height: '50px',
											padding: '6px',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
											color: '#00000055',
										}}
									>
										No metadata found
									</Grid>
								)}

								{isDeleteLoading && (
									<div
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'center',
											marginTop: '12px',
										}}
									>
										<Loader local />
									</div>
								)}

								{!isDeleteLoading &&
									filteredMetadata?.map((meta) => (
										<Grid
											key={uuidv4()}
											item
											xs={12}
											sx={styles.elementComponent}
										>
											<Grid
												item
												xs={1}
												sx={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												{elementTypeToIconMap[meta.type]('metadata')}
											</Grid>
											<Grid
												item
												xs={9}
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'left',
													padding: '0px 6px',
												}}
											>
												<Grid item xs={12} sx={{ fontWeight: 'bold' }}>
													{highlightMatches(
														meta.display_name ? meta.display_name : meta.name,
														'metadata'
													)}
												</Grid>
												<Grid item xs={12} sx={{ fontSize: '0.7rem' }}>
													{meta.description ? `-${meta.description}` : ''}
												</Grid>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												<HasAccess
													roles={defaultRoles}
													permissions="task.update"
													renderAuthFailed={
														<IconButton disabled>
															<EditIcon />
														</IconButton>
													}
												>
													<IconButton
														color="primary"
														sx={{ width: '25px', height: '25px' }}
														onClick={() =>
															handleCreateOrUpdateElement(
																'update',
																'metadata',
																meta
															)
														}
													>
														<EditIcon />
													</IconButton>
												</HasAccess>
											</Grid>
											<Grid
												item
												xs={1}
												sx={{ display: 'flex', alignItems: 'center' }}
											>
												<HasAccess
													roles={defaultRoles}
													permissions="task.delete"
													renderAuthFailed={
														<IconButton disabled>
															<DeleteIcon />
														</IconButton>
													}
												>
													<IconButton
														color="error"
														sx={{ width: '25px', height: '25px' }}
														onClick={() =>
															handleDeleteElement('metadata', meta)
														}
													>
														<DeleteIcon />
													</IconButton>
												</HasAccess>
											</Grid>
										</Grid>
									))}
							</Grid>
						</Grid>
					</CardItem>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<CardItem
							elevation={measures.cardItemElevation}
							sx={{
								...styles.elementContainer,
								padding: 1,
								marginBottom: 3,
								height: '548px',
							}}
							centerTitle
							type="noIcon"
							title="SCHEMA DIAGRAM"
						>
							<Grid
								container
								sx={{
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Grid item xs={12} lg={8}>
									<FixedFlow tmpSchema={schemaState.schema} />
								</Grid>
							</Grid>
						</CardItem>
					</Grid>
				</Grid>
			</Grid>
			<ConfirmationDialog
				className={CSSstyles.Delete_modal}
				title={`Delete ${nodeToDeleteType}?`}
				open={openConfirm}
				setOpen={setOpenConfirm}
				onConfirm={handleDeleteNode}
				isLoading={isDeleteLoading}
			>
				<>Are you sure you want to delete this {nodeToDeleteType}?</>
			</ConfirmationDialog>
			{openCreateDialog && (
				<CreateOrUpdateElementDialog
					openDialog={openCreateDialog}
					setOpenDialog={setOpenCreateDialog}
					mode={dialogMode}
					elementType={newElementType}
					prevElement={elementToModify}
				/>
			)}
		</HasAccess>
	);
}
