export async function GetKeyPermissions(member: any): Promise<string[]> {
    const { permissions } = member;

    let keyPermissions: string[] = [];

    const permissionsArray: string[] = permissions.toArray();

    permissionsArray.forEach((perm: string) => {
        switch(perm) {
            case 'Administrator': { keyPermissions.push(perm) } break;
            case 'BanMembers': { keyPermissions.push(perm) } break;
            case 'DeafenMembers': { keyPermissions.push(perm) } break;
            case 'KickMembers': { keyPermissions.push(perm) } break;
            case 'ManageChannels': { keyPermissions.push(perm) } break;
            case 'ManageGuild': { keyPermissions.push(perm) } break;
            case 'ManageRoles': { keyPermissions.push(perm) } break;
            case 'ManageMessages': { keyPermissions.push(perm) } break;
            case 'MentionEveryone': { keyPermissions.push(perm) } break;
            case 'ModerateMembers': { keyPermissions.push(perm) } break;
            case 'MuteMembers': { keyPermissions.push(perm) } break;
            case 'ViewAuditLog': { keyPermissions.push(perm) } break;
        }
    });

    return keyPermissions;
}