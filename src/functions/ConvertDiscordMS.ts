export default async function ConvertDiscordMS(unixtimestamp: number) {
    let ms;

    ms = Math.round(unixtimestamp / 1000);

    return ms;
}