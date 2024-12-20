import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Skeleton, TableCell, TableRow } from '@mui/material';

// Styles
import { colors } from '../../../../consts/colors';

function TableSkeleton({ colsNumber }) {
	return (
		<TableRow sx={{ borderBottom: `2px solid ${colors.lightBorderColor}` }}>
			{[...Array(colsNumber)].map(() => (
				<TableCell key={uuidv4()}>
					<Skeleton
						variant="text"
						style={{
							height: '12px',
							width: '80%',
						}}
					/>
				</TableCell>
			))}
		</TableRow>
	);
}

TableSkeleton.propTypes = {
	colsNumber: PropTypes.number,
};

export default TableSkeleton;
