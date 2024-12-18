import * as yup from 'yup';

export const completeProfileValidationSchema = yup.object({
	first_name: yup
		.string()
		.min(3, 'First name minimum length of 3 digist')
		.max(64, 'First name maximum length of 64 digist')
		.required('First name is required'),
	last_name: yup
		.string()
		.min(3, 'Last name minimum length of 3 digist')
		.max(64, 'Last name maximum length of 64 digist')
		.required('Last name is required'),
});

export const completeOrganizationValidationSchema = yup.object({
	address: yup
		.string()
		.min(3, 'First name minimum length of 3 digist')
		.max(64, 'First name maximum length of 64 digist')
		.required('First name is required'),
	domain: yup
		.string()
		.min(3, 'Last name minimum length of 3 digist')
		.max(64, 'Last name maximum length of 64 digist')
		.required('Last name is required'),
	name: yup
		.string()
		.min(3, 'Last name minimum length of 3 digist')
		.max(64, 'Last name maximum length of 64 digist')
		.required('Last name is required'),
	trn: yup
		.string()
		.min(3, 'Last name minimum length of 3 digist')
		.max(64, 'Last name maximum length of 64 digist')
		.required('Last name is required'),
});

export const inviteUserValidationSchema = yup.object({
	email: yup.string().email('Invalid email').required('Email is required'),
});

export const addOrganizationUserPermissionsSchema = yup.object({
	action: yup.string().required('Action is required'),
	allow: yup.boolean(),
	resource_type: yup.string().required('Resource type is required'),
});

export const addOrganizationRoleSchema = yup.object({
	name: yup.string().required('Name is required'),
	description: yup.string().required('Description is required'),
});

export const addOrganizationAppSchema = yup.object({
	name: yup.string().required('Name is required'),
	description: yup.string().required('Description is required'),
});

export const editUserInfoValidationSchema = yup.object({
	first_name: yup
		.string()
		.min(3, 'First name minimum length of 3 digist')
		.max(64, 'First name maximum length of 64 digist')
		.required('First name is required'),
	last_name: yup
		.string()
		.min(3, 'Last name minimum length of 3 digist')
		.max(64, 'Last name maximum length of 64 digist')
		.required('Last name is required'),
});
