import * as yup from 'yup';

export const sendSupportMessageSchema = yup.object({
	name: yup
		.string()
		.min(2, 'Name minimum length of 2 digist')
		.max(20, 'Name maximum length of 30 digist')
		.required('Name is required'),
	companyName: yup
		.string()
		.min(5, 'Company name minimum length of 5 digist')
		.max(30, 'Company name maximum length of 30 digist')
		.required('Company name is required'),
	message: yup
		.string()
		.min(5, 'Message minimum length of 20 characters')
		.max(300, 'Message maximum length of 300 characters')
		.required('Message is required'),
});
