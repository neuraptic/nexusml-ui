import PropTypes from 'prop-types';
import { useEffect } from 'react';

// Components
import { Input, TextField } from '@mui/material';

export const TextEditor = (props) => {
	const {
		currentElement,
		currentElementValueType,
		currentValue,
		setCurrentValue,
		name = null,
		disabled = false,
	} = props;

	useEffect(() => {
		if (currentElement) setCurrentValue(currentElement.value);
	}, [currentElement || currentValue]);

	const handleChange = (e) => {
		if (!name) setCurrentValue(e.target.value);
		else setCurrentValue(name, e.target.value);
	};

	if (
		currentElementValueType === 'float' ||
		currentElementValueType === 'integer'
	) {
		return (
			<Input
				disabled={disabled}
				value={currentValue}
				onChange={handleChange}
				type="number"
				sx={{ width: '100%', backgroundColor: 'white' }}
			/>
		);
	}

	return (
		<TextField
			multiline
			rows={5}
			maxRows={10}
			inputProps={{ maxLength: 32000 }}
			value={currentValue}
			onChange={handleChange}
			disabled={disabled}
			sx={{ width: '100%', backgroundColor: 'white' }}
		/>
	);
};

TextEditor.propTypes = {
	currentElement: PropTypes.object,
	currentElementValueType: PropTypes.string,
	currentValue: PropTypes.any,
	setCurrentValue: PropTypes.func,
	name: PropTypes.string,
	disabled: PropTypes.bool,
};
