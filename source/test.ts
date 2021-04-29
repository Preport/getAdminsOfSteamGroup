import getAdminsOfSteamGroup from './index';

//!!!This test might/will fail if tradingcards get more admins or demote the current ones
(async () => {
    const members = await getAdminsOfSteamGroup.getMembers('tradingcards', getAdminsOfSteamGroup.EGroupRank.Both)
    if (members.length == 39 && members.filter(m => m.rank == "Moderator").length === 23) {
        console.log(members);
        console.log("TEST WAS SUCCESSFUL")
        process.exit(0)
    }
    console.error("Member amount wasn't right ?");
    console.log(members)
    process.exit(2);
})()