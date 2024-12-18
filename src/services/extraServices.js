// COPY PAYLOAD TO CLIPBOARD
export const copyTextToClipboard = (payload) => {
	// Select the text field
	payload.select();
	payload.setSelectionRange(0, 99999); // For mobile devices

	// Copy the text inside the text field
	navigator.clipboard.writeText(payload.value);

	// Alert the copied text
	alert(payload.value);
};

export const generateRandomColor = () => Math.random().toString(16).substr(-6);

export const getCookieByName = (name) => {
	// Split the cookie string into individual cookies
	const cookies = document.cookie.split(';');

	// Iterate over the cookies to find the one with the given name
	for (let i = 0; i < cookies.length; i += 1) {
		const cookie = cookies[i].trim();

		// Check if the cookie starts with the desired name
		if (cookie.startsWith(`${name}=`)) {
			// Extract and return the cookie value
			return cookie.substring(name.length + 1);
		}
	}

	// Return null if the cookie with the given name was not found
	return null;
};

export const isEmptyObject = (value) =>
	value !== null &&
	typeof value === 'object' &&
	!Array.isArray(value) &&
	Object.keys(value).length === 0;
