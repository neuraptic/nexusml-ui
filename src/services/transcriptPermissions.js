export const transcriptPermissions = (props) => {
	const { permissions, organizationId } = props;
	/**
	 * PERMISSION PREFERENCES:
	 * 1-USER vs ROLE: User takes preference over role.
	 * 2-GENERIC vs RESOURCE-LEVEL: Resource level (that assigned to a specific resource) takes precedence over generic (that assigned to a certain type of resource).
	 * 3-GRANTED vs DENIED: Denied permission takes precedence over granted permission.
	 */

	const transcriptedPermissions = permissions.map((permission) => {
		let tmpPermission = '';

		if (permission.organization === organizationId)
			tmpPermission = `${permission.resource_type}.${permission.action}`;

		return tmpPermission;
	});

	return transcriptedPermissions;
};
