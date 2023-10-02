import fetch from "node-fetch";
import { User } from "discord.js";
import axios from "axios";

const developers = [
    '983163377243271291',
    '1117933631512518716',
];

export default async function GetUserBadges(user: User) {
    const badges: string[] = [];

    const userData = await fetch(`https://japi.rest/discord/v1/user/${user.id}`);
    const { data } = await userData.json();
  
    if (data && data.public_flags_array) {
      const userBadges: string[] = data.public_flags_array;
  
      if (userBadges.includes('STAFF')) badges.push('<:DiscordStaff:1147591752853749952>');
      if (userBadges.includes('PARTNER')) badges.push('<:Partner:1147591769295425636>');
      if (userBadges.includes('TEAM_USER')) badges.push('<:ActiveDeveloper:1147591740165996584>');
      if (userBadges.includes('BUGHUNTER_LEVEL_1')) badges.push('<:BugHunter1:1147591747992563804>');
      if (userBadges.includes('BUGHUNTER_LEVEL_2')) badges.push('<:BugHunter2:1147591761653403728>');
      if (userBadges.includes('CERTIFIED_MODERATOR')) badges.push('<:CertifiedModerator:1147591750081314857>');
      if (userBadges.includes('EARLY_SUPPORTER')) badges.push('<:EarlySupporter:1147591757073219756>');
      if (userBadges.includes('HYPESQUAD_EVENTS')) badges.push('<:Hypesquad:1147591758662881351>');
      if (userBadges.includes('HOUSE_BRILLIANCE')) badges.push('<:Brilliance:1147591746935603371>');
      if (userBadges.includes('HOUSE_BRAVERY')) badges.push('<:Bravery:1147591744448364664>');
      if (userBadges.includes('HOUSE_BALANCE')) badges.push('<:Balance:1147591742795829278>');
      if (userBadges.includes('ACTIVE_DEVELOPER')) badges.push('<:ActiveDeveloper:1147591740165996584>')
      if (userBadges.includes('VERIFIED_BOT')) badges.push('<:VerifiedBot:1147591773938524190>')
      if (userBadges.includes('EARLY_VERIFIED_BOT_DEVELOPER')) badges.push('<:VerifiedBotDeveloper:1147591775532355689>')
    }

    if(!user.discriminator || user.discriminator === '0' || user.tag === `${user.username}#0`) {
        badges.push('<:newuser:1157177824361336922>');
    }

    if(!badges.length) {
        badges.push('No badges found.');
    }

    const stylarbadges = await axios.get(`https://stylar-dev.discordand.repl.co/api/user-badges/${user.id}`);
    if(stylarbadges.data.badges.includes('No badges found.')) {
        return badges.join(' ');
    } else {
        stylarbadges.data.badges.forEach((stylarbadge: string) => {
            badges.push(stylarbadge);
        });
        return badges.join(' ');
    }
}