// Components
import { Skeleton } from '@mui/material';

export const TaskCardSkeleton = () => (
	<Skeleton
		variant="rectangular"
		height={250}
		style={{ borderRadius: '12px' }}
	/>
);
