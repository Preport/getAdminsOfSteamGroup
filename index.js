const Request = require('request')
const { JSDOM } = require('jsdom')
const SteamID = require('steamid')
/**
 * @enum EGroupRank
 */
const EGroupRank = {
    "Owners": 0,
    "Moderators": 1,
    "Both": 2
}
/**
 * 
 * @param {SteamID|string} groupID 
 * @param {EGroupRank} groupRank 
 * @param {string} steamAPIKey 
 * @param {Function} callback 
 * @param {Array<string>} cookies 
 */
function getMembers(groupID, groupRank, steamAPIKey, callback, cookies) {
    if (typeof groupID !== "string") {
        groupID = groupID.toString();
    }
    var link = "https://steamcommunity.com/" + (isNaN(groupID) ? "groups/" : "gid/") + groupID + "/members/?p=";
    var page = 1
    var members = []
    var gotAtLeastOne = true;
    var resAmt = 0;
    function makeRequest() {
        gotAtLeastOne = false;
        Request.get(link + page, {
            headers: {
                cookies: cookies?.join(';')
            }
        }, function (err, resp, body) {
            if (err) return callback(err);
            const dom = new JSDOM(body);
            const memberBlocks = dom.window.document.getElementsByClassName('member_block');
            for (member of memberBlocks) {
                const rank = member.children[0]?.title;
                if (!rank) continue;
                const isMod = rank.endsWith("Moderator");
                if (!isMod) gotAtLeastOne = true;
                if ((isMod && groupRank) || !(isMod || (groupRank & 1))) {
                    gotAtLeastOne = true;
                    const ids = member.children[1]?.children[0]?.href?.split('/');
                    if (ids[ids.length - 2] === "id") {
                        members.push(ids[ids.length - 1]);
                        resAmt++;
                    }
                    else members.push(new SteamID(ids[ids.length - 1]));
                }
            }
            if (!gotAtLeastOne) end()
            else {
                page++
                makeRequest()
            }
        })
    }
    makeRequest()
    function end() {
        if (resAmt == 0) return callback(null, members);
        function resolve() {
            if (--resAmt == 0) callback(null, members);
        }
        members.forEach(function (member, i) {
            if (typeof member == "string") {
                function getVan() {
                    getVanityUrl(member, steamAPIKey, function (err, stid64) {
                        if (err) {
                            if (!err.includes("429")) return callback(err);
                            else return setTimeout(getVan, 20000);
                        }
                        members[i] = new SteamID(stid64);
                        resolve();
                    })
                }
                getVan()
            }
        })
    }
}
function getVanityUrl(vanityURL, steamAPIKey, callback) {
    Request.get("https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=" + steamAPIKey + "&vanityurl=" + vanityURL, function (err, resp, body) {
        if (err) return callback(err);
        if (resp.statusCode.toString()[0] !== "2") return callback(new Error(resp.statusMessage + " Please Check Your API Key"));
        const jsbod = JSON.parse(body);
        callback(null, jsbod.response.steamid);
    })
}


module.exports = {
    getMembers,
    EGroupRank
}