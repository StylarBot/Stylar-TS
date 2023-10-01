export async function SortRoles(member: any): Promise<string> {
    await member.fetch();

    const allroles: string[] = [];

    member.roles.cache.forEach((role: any) => {
        allroles.push(`${role}`);
    });

    return allroles.join(', ');
}