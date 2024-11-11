import PropTypes from 'prop-types';

import styles from './styles';

function Section({ title, children }) {
	return (
		<div style={styles().sectionContainer}>
			<div style={styles().sectionTitle}>{title}</div>
			<div style={styles().sectionContent}>{children}</div>
		</div>
	);
}

Section.propTypes = {
	children: PropTypes.object,
	title: PropTypes.any,
};

export default Section;
