# Get Admins Of Steam Group
### <p align="center">[![Build Status](https://travis-ci.com/Preport/getAdminsOfSteamGroup.svg?branch=main)](https://travis-ci.com/Preport/getAdminsOfSteamGroup)</p>
## Usage Example
```javascript
const getAdminsOfSteamGroup = require('getAdminsOfSteamGroup');

getAdminsOfSteamGroup.getMembers('tradingcards', getAdminsOfSteamGroup.EGroupRank.Both, /*YourSteamApiKey*/, (err, members) => {
    if(err)throw err;
});
```
## Enum
```javascript
EGroupRank {
    "Owners": 0,
    "Moderators": 1,
    "Both": 2
}
```
## Method
### getMembers(groupID, groupRank, steamAPIKey, callback[, cookies])
- `groupID` - Required. One of `SteamID` object, `groups64ID` or the part after `/groups/`
- `groupRank` - Required. typeof `EGroupRank`
- `steamAPIKey` - Required If admins have custom urls. You can omit `null` if you are sure they do not.
- `callback` - Required. Called after members are loaded
    - `err` - If an error occured, this is an `Error` object `null` otherwise.
    - `members` - Array of `SteamID` objects.
- `cookies` - Optional. `Array of cookies` to get members of private groups. Type:`key=value`
## SteamID Object
#### Refer to https://github.com/DoctorMcKay/node-steamid
