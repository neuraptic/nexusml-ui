export const getAllColumns = ({ inputs, outputs, metadata, groups }) => {
	const simplifiedInputs = inputs.map((i) => ({
		name: i.element,
		label: i.name,
		dataType: i.value_type,
	}));
	const simplifiedOutputs = outputs.map((t) => ({
		name: t.element,
		label: t.name,
		dataType: t.value_type,
	}));
	const simplifiedMetadata = metadata.map((m) => ({
		name: m.element,
		label: m.name,
		dataType: m.value_type,
	}));
	const simplifiedGroups = groups.map((g) => ({
		name: g.element,
		label: g.name,
		dataType: g.value_type,
	}));

	return [
		...simplifiedInputs,
		...simplifiedOutputs,
		...simplifiedMetadata,
		...simplifiedGroups,
	];
};
