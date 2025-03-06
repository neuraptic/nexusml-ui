import { useEffect, useState } from 'react';

function useKey(key) {
	// Local states
	const [isKeyPressed, setIsKeyPressed] = useState(false);

	const handleKeyDown = (event) => {
		if (event.key === key) {
			setIsKeyPressed(true);
		}
	};

	const handleKeyUp = (event) => {
		if (event.key === key) {
			setIsKeyPressed(false);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [key]);

	return isKeyPressed;
}

export default useKey;
