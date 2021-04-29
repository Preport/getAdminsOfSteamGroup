# Get Admins Of Steam Group
### <p align="center">[![Build Status](https://travis-ci.com/Preport/getAdminsOfSteamGroup.svg?branch=main)](https://travis-ci.com/Preport/getAdminsOfSteamGroup)</p>
## Usage Example
```typescript
const getAdminsOfSteamGroup = require('getAdminsOfSteamGroup'); // CommonJS
import getAdmins from 'getadminsofsteamgroup' //TypeScript


getAdmins.getMembers('tradingcards', getAdminsOfSteamGroup.EGroupRank.Both)
    .then(members => {
        //Pretty log members to console
        console.log(JSON.stringify(members, null, "\t"))
    })
    .catch(err => {
        console.error(err);
    })
```
## Types
```typescript
enum EGroupRank {
    "Owners": 0,
    "Moderators": 1,
    "Both": 2
}
type Members = {
    name: string,
    steamID64: string,
    rank: "Owner" | "Officer" | "Moderator"
}

```
## Method
### getMembers(groupID, groupRank[, cookies])
- `groupID` - Required. `groups64ID` or the part after `/groups/`
- `groupRank` - Required. typeof `EGroupRank`
- `cookies` - Optional. `Array of cookies` to get members of private groups. Type:`key=value`
- **Returns** `Promise<Members[]>` Array Of Members
