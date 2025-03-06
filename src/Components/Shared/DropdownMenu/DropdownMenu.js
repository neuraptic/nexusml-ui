import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// Components
import { Menu, MenuItem } from '@mui/material';

// Styles
import styles from './styles';

function DropdownMenu(props) {
	const { anchorEl, setAnchorEl, menuItems, anchorOrigin, transformOrigin } =
		props;

	const navigate = useNavigate();

	const open = Boolean(anchorEl);

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	return (
		<Menu
			id="basic-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={handleCloseMenu}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
			anchorOrigin={anchorOrigin}
			transformOrigin={transformOrigin}
		>
			{menuItems &&
				menuItems.length > 0 &&
				menuItems.map((item) => (
					<MenuItem
						key={uuidv4()}
						onClick={() => {
							handleCloseMenu();
							if (item.link) navigate(item.link);
						}}
						sx={styles().menuContainer}
					>
						{item.image && (
							<img
								src={item.image}
								alt={item.title}
								style={styles().menuImage}
							/>
						)}
						{item.title && <div style={styles().title}>{item.title}</div>}
					</MenuItem>
				))}
		</Menu>
	);
}

DropdownMenu.propTypes = {
	menuItems: PropTypes.array,
	anchorEl: PropTypes.object,
	setAnchorEl: PropTypes.func,
	anchorOrigin: PropTypes.object,
	transformOrigin: PropTypes.object,
};

export default DropdownMenu;
