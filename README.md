# MMM-LeagueOfLegends-v2

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

The module works with the [Riot API](https://developer.riotgames.com/) to get the league data and presents it on your mirror.
In order to use the module you have to find your encrypted summoner ID [here](https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName).

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: "MMM-LeagueOfLegends-v2",
      position: "top_left",
      updateInterval: 10000, // 10 seconds
      apiKey: "RGAPI-7ff429d8-b283-42af-98a8-0adb38cf7418",
      encryptedSummonerId: "MqYhudzARMTl-qhePXLos_XUEhb3yAtg9nSo3NuHy8N5uzo",
    },
  ],
};
```

## Configuration options

| Option    | Description                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `option1` | _Required_ YOUR_API_KEY                                                                                 |
| `option2` | _Required_ YOUR_ENCRYPTED_SUMMONER_ID                                                                   |
| `option3` | _Optional_ fetchInteval <br><br>**Type:** `int`(milliseconds) <br>Default 6000 milliseconds (6 seconds) |
