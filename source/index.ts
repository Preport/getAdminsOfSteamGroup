import got from 'got'
import cheerio, { Cheerio, Element } from 'cheerio'
import cuint from 'cuint'

enum EGroupRank {
    "Owners" = 0,
    "Moderators" = 1,
    "Both" = 2
}
async function getMembers(groupID: string | number, groupRank: EGroupRank, cookies?: string[]) {
    const link = "https://steamcommunity.com/" + (isNaN(groupID as number) ? "groups/" : "gid/") + groupID + "/members/?p=";
    let page = 1;
    let members: {
        name: string,
        steamID64: string,
        rank: "Owner" | "Officer" | "Moderator"
    }[] = [];

    while (true) {
        const response = await got.get(link + page, {
            headers: {
                cookies: cookies,
            }
        })
        function addToArray(root: Cheerio<Element>, owner?: boolean) {
            const profiles = root.parent();
            profiles.each((i, e) => {
                members.push({
                    name: $('.linkFriend', e).text(),
                    steamID64: cuint.UINT64(parseInt(e.attribs['data-miniprofile']), 17825793).toString(),
                    rank: owner ? (i == 0 ? "Owner" : "Officer") : "Moderator"
                })
            })
        }
        const $ = cheerio.load(response.body);
        const admins = $('div.rank_icon[title^="Group O"]');
        const mods = !!groupRank ? $('div.rank_icon[title="Group Moderator"]') : null;

        if (groupRank != 1) addToArray(admins, true);
        if (!!groupRank) addToArray(mods);
        if ((admins.length + mods.length < 51) || (admins.length == 0 && !groupRank) || (admins.length == 0 && mods.length == 0)) break;
        page++;
    }
    return members
}
export default {
    EGroupRank,
    getMembers
}