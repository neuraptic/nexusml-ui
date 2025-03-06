import React, { memo, useContext } from 'react';
import { Handle } from 'reactflow';

// Contexts
import ConfigContext from '../../../../Providers/ConfigContext';

/**
 * CustomGroupNode is a HOC that defines a custom node for the reactflow library. It is used to render a schema
 * group node, which groups inputs and metadata together for an arbitrary number of outputs, so it has two different
 * `<Handle/>`s for the inputs and metadata, and a single `<Handle/>` for the output.
 *
 * @param {Object} data
 * @return {JSX.Element} The rendered node.
 */

function CustomGroupNode() {
	const { appLogo } = useContext(ConfigContext);

	return (
		<>
			<Handle id="inputs" type="target" position="left" />
			<Handle id="metadata" type="target" position="bottom" />
			<img src={appLogo} alt="" style={{ width: '125px' }} />
			<Handle id="outputs" type="source" position="right" />
		</>
	);
}

export default memo(CustomGroupNode);
