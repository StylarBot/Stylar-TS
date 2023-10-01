export async function GetPresence(member: any): Promise<string> {
    const { presence } = member;
    let status: string;

    if (!presence) {
        status = ':grey_question:';
    } else {
        switch (presence.status) {
            case 'online':
                status = '<:online:1156062892932743208>';
                break;
            case 'offline':
                status = '<:offline:1156058510333857804>';
                break;
            case 'idle':
                status = '<:idle:1156062959399874620>';
                break;
            case 'dnd':
                status = '<:dnd:1156063004375392276>';
                break;
            default:
                status = ':grey_question:';
                break;
        }
    }

    return status;
}