import { defaultRoles } from '../consts/rolesAndPermissions';

const checkIsAuthorized = async ({
	isAuthorized,
	setCanCreate = null,
	setCanUpdate = null,
	setCanDelete = null,
	permission,
}) => {
	const create = await isAuthorized(defaultRoles, permission);
	const update = await isAuthorized(defaultRoles, permission);
	const del = await isAuthorized(defaultRoles, permission);
	if (setCanCreate && create) setCanCreate(create);
	if (setCanUpdate && update) setCanUpdate(update);
	if (setCanDelete && del) setCanDelete(del);
};

export default checkIsAuthorized;
