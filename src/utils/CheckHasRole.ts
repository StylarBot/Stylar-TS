export async function CheckHasRole(member: any, role: any): Promise<boolean> {
    if(member.roles.has(role.id)) return true;
    else return false;
}