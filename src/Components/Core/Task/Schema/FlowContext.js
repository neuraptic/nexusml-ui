import { useMemo, createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const FlowActionsContext = createContext({
	onRemoveEdgeButtonClick: () => {},
	onRemoveNodeButtonClick: () => {},
	onModifyNodeButtonClick: () => {},
	onOpenNodeButtonClick: () => {},
	selectedElement: null,
});

/**
 * This hook returns the FlowActionsContext provider that receives the actions that has to be used by the rest
 * of the react-flow-rendered static components as props.
 *
 * @param props
 * @returns {JSX.Element}
 *
 * @component
 * @category Flow
 */
function FlowActionsProvider(props) {
	const {
		onRemoveEdgeButtonClick,
		onRemoveNodeButtonClick,
		onModifyNodeButtonClick,
		onOpenNodeButtonClick,
		selectedElement,
		children,
	} = props;

	const value = useMemo(() => ({
		onRemoveEdgeButtonClick,
		onRemoveNodeButtonClick,
		onModifyNodeButtonClick,
		onOpenNodeButtonClick,
		selectedElement,
	}));

	return (
		<FlowActionsContext.Provider value={value}>
			{children}
		</FlowActionsContext.Provider>
	);
}

/**
 * This hook returns the FlowActionsContext consumer in order to be used by the rest of the application, concretely by the
 * react-flow-rendered static components.
 *
 * @returns {FlowActionsContext} flowActionsContext - The FlowActionsContext consumer.
 *
 * @component
 * @category Flow
 */
function useFlowActions() {
	const context = useContext(FlowActionsContext);
	if (context === undefined) {
		throw new Error('useFlowActions must be used within a FlowActionsProvider');
	}
	return context;
}

export { FlowActionsProvider, useFlowActions };

FlowActionsProvider.propTypes = {
	onRemoveEdgeButtonClick: PropTypes.any,
	onRemoveNodeButtonClick: PropTypes.any,
	onModifyNodeButtonClick: PropTypes.any,
	onOpenNodeButtonClick: PropTypes.any,
	selectedElement: PropTypes.any,
	children: PropTypes.any,
};
