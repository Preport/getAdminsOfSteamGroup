const getAdminsOfSteamGroup = require('./index');

//!!!This test might/will fail if tradingcards get more admins or demote the current ones
getAdminsOfSteamGroup.getMembers('tradingcards', getAdminsOfSteamGroup.EGroupRank.Both, process.env.steamapikey, (err, members) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    if (members.length == 39 && !members.find(i => typeof i == "string")) process.exit(0)
    console.error("Member amount wasn't right ?");
    console.log(members)
    process.exit(2);
})