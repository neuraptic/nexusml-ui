import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// Manage roles & permissions
import { HasAccess, usePermify } from '@permify/react-role';

// Components
import {
	Box,
	Collapse,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemText,
	Typography,
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import CreateOrUpdateElementDialog from '../Dialogs/CreateOrUpdateElementDialog';
import StandardButton from '../../../Shared/Buttons/StandardButton';
import CreateOrUpdateGroupDialog from '../Dialogs/CreateOrUpdateGroupDialog';
import { Loader } from '../../../Shared/Loader';

// Consts
import { defaultRoles } from '../../../../consts/rolesAndPermissions';

// Services
import checkIsAuthorized from '../../../../services/checkIsAuthorized';

// eslint-disable-next-line react/display-name

/**
 * NodeSidebar component renders the helper sidebar that is used to create, update and delete all the schema elements of
 * the task (inputs, outputs, groups and metadata). It also allows the user to select one of the schema templates to
 * redefine the schema of the task.
 *
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
function NodeSidebar(props) {
	const { handleOpenConfirmDialog, isDeleteLoading } = props;

	const { schema: schemaState } = useSelector((state) => state.schema);

	const [showInputs, setShowInputs] = useState(false);
	const [showOutputs, setShowOutputs] = useState(false);
	const [showMetadata, setShowMetadata] = useState(false);
	const [showGroups, setShowGroups] = useState(false);

	const [openCreateDialog, setOpenCreateDialog] = useState(false);
	const [dialogMode, setDialogMode] = useState('create');
	const [newElementType, setNewElementType] = useState(null);
	const [elementToModify, setElementToModify] = useState(null);
	const [canUpdate, setCanUpdate] = useState(false);

	/**
	 * This function is triggered when the drag event is performed by the user by start dragging one of the schema elements
	 * that can be later dropped on the canvas. It sets the element data to a data transfer slot used by the
	 * react-flow-rendered library in order to identify later on the element that is being dragged.
	 *
	 * @param event
	 * @param {string} nodeType
	 * @param {Object} element
	 */
	const onDragStart = (event, nodeType, element) => {
		let data = {
			id: element.id,
			type: nodeType,
			name: element.name,
		};

		data = JSON.stringify(data);
		event.dataTransfer.setData('application/reactflow', data);
		event.dataTransfer.effectAllowed = 'move';
	};

	/**
	 * This function sets the visibility of the input/output/metadata/group sections of the sidebar on or off, depending
	 * on the previous state.
	 *
	 * @param {string} type
	 */
	const handleShow = (type) => {
		switch (type) {
			case 'inputs':
				setShowInputs(!showInputs);
				break;
			case 'outputs':
				setShowOutputs(!showOutputs);
				break;
			case 'metadata':
				setShowMetadata(!showMetadata);
				break;
			case 'groups':
				setShowGroups(!showGroups);
				break;
			default:
				break;
		}
	};

	/**
	 * This function is called when the user clicks either on the "Add <element>" button or on the edit icon button of
	 * one of the schema elements. It sets the dialog mode to either "update" or "create" and the new element type to
	 * the one of the element that is being edited/created. It also controls the visibility of the dialog.
	 *
	 * @param {string} mode
	 * @param {string} elementType
	 * @param {Object} element
	 */
	const handleCreateOrUpdateElement = (mode, elementType, element) => {
		setNewElementType(elementType);
		setElementToModify(element);
		setDialogMode(mode);
		setOpenCreateDialog(true);
	};

	/**
	 * This function is triggered when the user clicks on the remove button of one of the schema elements. It removes
	 * the element from the server and updates the schema.
	 *
	 * @param {string} elementType
	 * @param {Object} element
	 */
	const handleDeleteElement = async (elementType, element) => {
		handleOpenConfirmDialog(elementType, element.id);
	};

	const { isAuthorized } = usePermify();

	useEffect(() => {
		checkIsAuthorized({
			isAuthorized,
			setCanUpdate,
			permission: 'task.update',
		});
	}, []);

	return (
		<>
			<Box
				sx={{
					p: 2,
					height: '90%',
					maxHeight: '70vh',
					overflowY: 'auto',
				}}
			>
				<Typography
					variant="h6"
					component="div"
					sx={{
						fontWeight: 'bold',
						color: 'text.primary',
					}}
				>
					Templates
				</Typography>
				<Typography
					variant="body"
					component="div"
					sx={{
						color: 'text.primary',
					}}
				>
					No templates available.
				</Typography>

				<List
					component="nav"
					subheader={
						<Typography
							variant="h6"
							component="div"
							sx={{
								fontWeight: 'bold',
								color: 'text.primary',
							}}
						>
							Schema elements
						</Typography>
					}
					sx={{
						mt: 3,
					}}
				>
					<ListItemButton
						key="expand-inputs"
						onClick={() => handleShow('inputs')}
					>
						{showInputs ? <ExpandLess /> : <ExpandMore />}
						<ListItemText primary="Inputs" />
					</ListItemButton>
					<Collapse in={showInputs} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								sx={{ pl: 4, display: 'flex', justifyContent: 'center' }}
								key="create-new-input"
							>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Create task" />
									}
								>
									<StandardButton
										value="Create new input"
										handleClick={() =>
											handleCreateOrUpdateElement('create', 'inputs', null)
										}
									/>
								</HasAccess>
							</ListItem>
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
								schemaState.inputs?.map((input, index) => (
									<ListItem sx={{ pl: 4 }} key={index}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '100%',
												height: '60px',
												cursor: canUpdate ? 'move' : 'pointer',
												border: '1px dashed #ccc',
												borderRadius: '5px',
												'&:hover': {
													backgroundColor: 'background.default',
												},
											}}
											draggable={canUpdate}
											onDragStart={(event) =>
												canUpdate && onDragStart(event, 'input', input)
											}
										>
											<HasAccess
												roles={defaultRoles}
												permissions="task.delete"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															right: '-3px',
														}}
													>
														<RemoveCircleIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() => handleDeleteElement('inputs', input)}
													sx={{
														position: 'absolute',
														top: '-10px',
														right: '-3px',
													}}
												>
													<RemoveCircleIcon />
												</IconButton>
											</HasAccess>
											<HasAccess
												roles={defaultRoles}
												permissions="task.update"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															left: '13px',
														}}
													>
														<EditIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() =>
														handleCreateOrUpdateElement(
															'update',
															'inputs',
															input
														)
													}
													sx={{
														position: 'absolute',
														top: '-10px',
														left: '13px',
													}}
												>
													<EditIcon />
												</IconButton>
											</HasAccess>
											<Typography
												variant="body1"
												component="div"
												sx={{
													p: 1,
													color: 'text.primary',
												}}
											>
												{input.display_name ? input.display_name : input.name}
											</Typography>
										</Box>
									</ListItem>
								))}
						</List>
					</Collapse>
					{
						// Outputs
					}
					<ListItemButton
						key="expand-outputs"
						onClick={() => handleShow('outputs')}
					>
						{showOutputs ? <ExpandLess /> : <ExpandMore />}
						<ListItemText primary="Outputs" />
					</ListItemButton>
					<Collapse in={showOutputs} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								sx={{ pl: 4, display: 'flex', justifyContent: 'center' }}
								key="create-new-input"
							>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Create task" />
									}
								>
									<StandardButton
										value="Create new output"
										handleClick={() =>
											handleCreateOrUpdateElement('create', 'outputs', null)
										}
									/>
								</HasAccess>
							</ListItem>
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
								schemaState.outputs?.map((output, index) => (
									<ListItem key={index} sx={{ pl: 4 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '100%',
												height: '60px',
												cursor: canUpdate ? 'move' : 'pointer',
												border: '1px dashed #ccc',
												borderRadius: '5px',
												'&:hover': {
													backgroundColor: 'background.default',
												},
											}}
											draggable={canUpdate}
											onDragStart={(event) =>
												canUpdate && onDragStart(event, 'output', output)
											}
										>
											<HasAccess
												roles={defaultRoles}
												permissions="task.delete"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															right: '-3px',
														}}
													>
														<RemoveCircleIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() => handleDeleteElement('outputs', output)}
													sx={{
														position: 'absolute',
														top: '-10px',
														right: '-3px',
													}}
												>
													<RemoveCircleIcon />
												</IconButton>
											</HasAccess>
											<HasAccess
												roles={defaultRoles}
												permissions="task.update"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															left: '13px',
														}}
													>
														<EditIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() =>
														handleCreateOrUpdateElement(
															'update',
															'outputs',
															output
														)
													}
													sx={{
														position: 'absolute',
														top: '-10px',
														left: '13px',
													}}
												>
													<EditIcon />
												</IconButton>
											</HasAccess>
											<Typography
												variant="body1"
												component="div"
												sx={{
													p: 1,
													color: 'text.primary',
												}}
											>
												{output.display_name
													? output.display_name
													: output.name}
											</Typography>
										</Box>
									</ListItem>
								))}
						</List>
					</Collapse>
					{
						// Metadata
					}
					<ListItemButton
						key="expand-metadata"
						onClick={() => handleShow('metadata')}
					>
						{showMetadata ? <ExpandLess /> : <ExpandMore />}
						<ListItemText primary="Metadata" />
					</ListItemButton>
					<Collapse in={showMetadata} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								sx={{ pl: 4, display: 'flex', justifyContent: 'center' }}
								key="create-new-input"
							>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Create task" />
									}
								>
									<StandardButton
										value="Create new metadata"
										handleClick={() =>
											handleCreateOrUpdateElement('create', 'metadata', null)
										}
									/>
								</HasAccess>
							</ListItem>
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
								schemaState.metadata?.map((metadata, index) => (
									<ListItem sx={{ pl: 4 }} key={index}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '100%',
												height: '60px',
												cursor: canUpdate ? 'move' : 'pointer',
												border: '1px dashed #ccc',
												borderRadius: '5px',
												'&:hover': {
													backgroundColor: 'background.default',
												},
											}}
											draggable={canUpdate}
											onDragStart={(event) =>
												canUpdate && onDragStart(event, 'metadata', metadata)
											}
										>
											<HasAccess
												roles={defaultRoles}
												permissions="task.delete"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															right: '-3px',
														}}
													>
														<RemoveCircleIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() =>
														handleDeleteElement('metadata', metadata)
													}
													sx={{
														position: 'absolute',
														top: '-10px',
														right: '-3px',
													}}
												>
													<RemoveCircleIcon />
												</IconButton>
											</HasAccess>
											<HasAccess
												roles={defaultRoles}
												permissions="task.update"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															left: '13px',
														}}
													>
														<EditIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() =>
														handleCreateOrUpdateElement(
															'update',
															'metadata',
															metadata
														)
													}
													sx={{
														position: 'absolute',
														top: '-10px',
														left: '13px',
													}}
												>
													<EditIcon />
												</IconButton>
											</HasAccess>
											<Typography
												variant="body1"
												component="div"
												sx={{
													p: 1,
													color: 'text.primary',
												}}
											>
												{metadata.display_name
													? metadata.display_name
													: metadata.name}
											</Typography>
										</Box>
									</ListItem>
								))}
						</List>
					</Collapse>
					{
						//  Groups
					}
					<ListItemButton
						key="expand-groups"
						onClick={() => handleShow('groups')}
					>
						{showGroups ? <ExpandLess /> : <ExpandMore />}
						<ListItemText primary="Groups" />
					</ListItemButton>
					<Collapse in={showGroups} timeout="auto" unmountOnExit>
						<List component="div" disablePadding>
							<ListItem
								sx={{ pl: 4, display: 'flex', justifyContent: 'center' }}
								key="create-new-input"
							>
								<HasAccess
									roles={defaultRoles}
									permissions="task.create"
									renderAuthFailed={
										<StandardButton type="disabled" value="Create task" />
									}
								>
									<StandardButton
										value="Create new group"
										handleClick={() =>
											handleCreateOrUpdateElement('create', 'groups', null)
										}
									/>
								</HasAccess>
							</ListItem>
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
								schemaState.groups?.map((group, index) => (
									<ListItem key={index} sx={{ pl: 4 }}>
										<Box
											sx={{
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												width: '100%',
												height: '60px',
												cursor: canUpdate ? 'move' : 'pointer',
												border: '1px dashed #ccc',
												borderRadius: '5px',
												'&:hover': {
													backgroundColor: 'background.default',
												},
											}}
											draggable={canUpdate}
											onDragStart={(event) =>
												canUpdate && onDragStart(event, 'group', group, index)
											}
										>
											<HasAccess
												roles={defaultRoles}
												permissions="task.delete"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															right: '-3px',
														}}
													>
														<RemoveCircleIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() => handleDeleteElement('groups', group)}
													sx={{
														position: 'absolute',
														top: '-10px',
														right: '-3px',
													}}
												>
													<RemoveCircleIcon />
												</IconButton>
											</HasAccess>
											<HasAccess
												roles={defaultRoles}
												permissions="task.update"
												renderAuthFailed={
													<IconButton
														disabled
														sx={{
															position: 'absolute',
															top: '-10px',
															left: '13px',
														}}
													>
														<EditIcon />
													</IconButton>
												}
											>
												<IconButton
													color="primary"
													onClick={() =>
														handleCreateOrUpdateElement(
															'update',
															'groups',
															group
														)
													}
													sx={{
														position: 'absolute',
														top: '-10px',
														left: '13px',
													}}
												>
													<EditIcon />
												</IconButton>
											</HasAccess>
											<Typography
												variant="body1"
												component="div"
												sx={{
													p: 1,
													color: 'text.primary',
												}}
											>
												{group.display_name ? group.display_name : group.name}
											</Typography>
										</Box>
									</ListItem>
								))}
						</List>
					</Collapse>
				</List>
			</Box>
			{openCreateDialog &&
				(newElementType === 'groups' ? (
					<CreateOrUpdateGroupDialog
						mode={dialogMode}
						openDialog={openCreateDialog}
						setOpenDialog={setOpenCreateDialog}
						prevGroup={elementToModify}
					/>
				) : (
					<CreateOrUpdateElementDialog
						openDialog={openCreateDialog}
						setOpenDialog={setOpenCreateDialog}
						mode={dialogMode}
						elementType={newElementType}
						prevElement={elementToModify}
					/>
				))}
		</>
	);
}

export default NodeSidebar;

NodeSidebar.propTypes = {
	handleOpenConfirmDialog: PropTypes.func,
	isDeleteLoading: PropTypes.bool,
};
