export default async function GetAllPermissions(member) {
    const { permissions } = member;

    let allPermissions = [];

    const permissionsArray = permissions.toArray();

    permissionsArray.forEach((perm) => {
        allPermissions.push(perm)
    });

    return allPermissions;
}