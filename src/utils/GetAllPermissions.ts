export async function GetAllPermissions(member: any): Promise<string[]> {
    const { permissions } = member;

    let allPermissions: string[] = [];

    const permissionsArray: string[] = permissions.toArray();

    permissionsArray.forEach((perm: string) => {
        allPermissions.push(perm);
    });

    return allPermissions;
}