const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
app.use(cors());

/*
    - Parses JSON file with all the actions
    - Returns elements that we can loop through and add a stat via each one
        (Example: 3PT Made is 5 elements 
            - PTS +3 
            - 3PA +1
            - 3PM +1
            - FGA +1
            - FGM +1
        )
    - Element name should be same as one in our dictionary so we can just put it in the slot
*/
app.get("/parseGame", async (req, res) => {
    try {
        const apiToCall = req.headers.url.replace('urlMe', req.headers.gameid);
        const axiosResponse = await axios.get(apiToCall);
        const gameDate = axiosResponse.data.meta.time.split(" ")[0];
        const actions = axiosResponse.data.game.actions;
        
        const parsedActions = [];

        actions.forEach((action) => {
            if(action.actionType === '2pt' || action.actionType === '3pt') {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "PTS",
                    picId: action.personIdsFilter[0],
                    amount: action.shotResult === "Made" ? parseInt(action.actionType.charAt(0)) : 0
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    picId: action.personIdsFilter[0],
                    teamTricode: action.teamTricode,
                    actionType: 'FGA',
                    amount: 1
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: 'FGM',
                    picId: action.personIdsFilter[0],
                    amount: action.shotResult === "Made" ? 1 : 0
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "3PA",
                    picId: action.personIdsFilter[0],
                    amount: action.actionType === '3pt' ? 1 : 0
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    picId: action.personIdsFilter[0],
                    teamTricode: action.teamTricode,
                    actionType: '3PM',
                    amount: action.actionType === '3pt' && action.shotResult === "Made" ? 1 : 0
                });
            } 
            if(action.actionType === 'rebound' && action.qualifiers.length === 0) {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    picId: action.personIdsFilter[0],
                    teamTricode: action.teamTricode,
                    actionType: "REB",
                    amount: 1
                });
            }
            if (action.assistPlayerNameInitial !== undefined) {
                parsedActions.push({
                    name: action.assistPlayerNameInitial,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    picId: action.assistPersonId,
                    actionType: "AST",
                    amount: 1
                });
            } 
            if (action.actionType === "freethrow") {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "FTA",
                    amount: 1,
                    picId: action.personIdsFilter[0],
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "FTM",
                    amount: action.shotResult === "Made" ? 1 : 0,
                    picId: action.personIdsFilter[0],
                });
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "PTS",
                    amount: action.shotResult === "Made" ? 1 : 0,
                    picId: action.personIdsFilter[0],
                });
            } 
            if (action.actionType === "steal") {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "STL",
                    amount: 1,
                    picId: action.personIdsFilter[0],
                });
            } 
            if (action.actionType === "block") {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "BLK",
                    amount: 1,
                    picId: action.personIdsFilter[0],
                });
            } 
            if (action.actionType === "turnover") {
                parsedActions.push({
                    name: action.playerNameI,
                    period: action.period,
                    clock: action.clock,
                    teamTricode: action.teamTricode,
                    actionType: "TO",
                    amount: 1,
                    picId: action.personIdsFilter[0],
                });
            }
        });

        res.json({
            actions: parsedActions,
            date: gameDate,
            teams: getTeamNames(axiosResponse.data.game.actions)
        });
    } catch (err) {
        // console.log("Error fetching data:", err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// app.get("/parseGameMLB", async (req, res) => {
//     try {
//         const apiToCall = req.headers.url.replace('urlMe', req.headers.gameid);
//         const axiosResponse = await axios.get(apiToCall);
//         const gameDate = axiosResponse.data.meta.time.split(" ")[0];
//         const actions = axiosResponse.data.game.actions;
        
//         const parsedActions = [];

//         actions.forEach((action) => {
//             if(action.actionType === '2pt' || action.actionType === '3pt') {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "PTS",
//                     picId: action.personIdsFilter[0],
//                     amount: action.shotResult === "Made" ? parseInt(action.actionType.charAt(0)) : 0
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     picId: action.personIdsFilter[0],
//                     teamTricode: action.teamTricode,
//                     actionType: 'FGA',
//                     amount: 1
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: 'FGM',
//                     picId: action.personIdsFilter[0],
//                     amount: action.shotResult === "Made" ? 1 : 0
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "3PA",
//                     picId: action.personIdsFilter[0],
//                     amount: action.actionType === '3pt' ? 1 : 0
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     picId: action.personIdsFilter[0],
//                     teamTricode: action.teamTricode,
//                     actionType: '3PM',
//                     amount: action.actionType === '3pt' && action.shotResult === "Made" ? 1 : 0
//                 });
//             } 
//             if(action.actionType === 'rebound' && action.qualifiers.length === 0) {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     picId: action.personIdsFilter[0],
//                     teamTricode: action.teamTricode,
//                     actionType: "REB",
//                     amount: 1
//                 });
//             }
//             if (action.assistPlayerNameInitial !== undefined) {
//                 parsedActions.push({
//                     name: action.assistPlayerNameInitial,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     picId: action.assistPersonId,
//                     actionType: "AST",
//                     amount: 1
//                 });
//             } 
//             if (action.actionType === "freethrow") {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "FTA",
//                     amount: 1,
//                     picId: action.personIdsFilter[0],
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "FTM",
//                     amount: action.shotResult === "Made" ? 1 : 0,
//                     picId: action.personIdsFilter[0],
//                 });
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "PTS",
//                     amount: action.shotResult === "Made" ? 1 : 0,
//                     picId: action.personIdsFilter[0],
//                 });
//             } 
//             if (action.actionType === "steal") {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "STL",
//                     amount: 1,
//                     picId: action.personIdsFilter[0],
//                 });
//             } 
//             if (action.actionType === "block") {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "BLK",
//                     amount: 1,
//                     picId: action.personIdsFilter[0],
//                 });
//             } 
//             if (action.actionType === "turnover") {
//                 parsedActions.push({
//                     name: action.playerNameI,
//                     period: action.period,
//                     clock: action.clock,
//                     teamTricode: action.teamTricode,
//                     actionType: "TO",
//                     amount: 1,
//                     picId: action.personIdsFilter[0],
//                 });
//             }
//         });

//         res.json({
//             actions: parsedActions,
//             date: gameDate,
//             teams: getTeamNames(axiosResponse.data.game.actions)
//         });
//     } catch (err) {
//         // console.log("Error fetching data:", err);
//         res.status(500).json({ error: 'Failed to fetch data' });
//     }
// });

app.get('/mlbSchedule', async (req, res) => {
    
    const startDate = req.headers.startdate;
    const endDate = req.headers.enddate;
    const url = ` https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate=${startDate}&endDate=${endDate}&timeZone=America/New_York&gameType=E&&&gameType=R&&gameType=A&language=en`;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'startDate': startDate,
                'endDate': endDate,
                'sportId': 1,
                'timeZone': 'America/New_York',
                'gameType': 'R'
            }
        });
        // console.log('Received MLB schedule request', response);

        if (!response.ok) {
            throw new Error(`Failed to fetch schedule: ${response.statusText}`);
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching MLB schedule:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.get('/wnbaScedule', async (req, res) => {
    try {
        const response = await fetch('https://cdn.wnba.com/static/json/staticData/scheduleLeagueV2_1.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch schedule: ${response.statusText}`);
        }

        const data = await response.json();

        res.json(data);
    } catch (error) {
        console.error('Error fetching WNBA schedule:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
})

app.get("/getPlayersInGame/:urlId", async (req, res) => {
    try {
        const apiUrl = 'https://content-api-prod.nba.com/public/1/leagues/wnba/game/' + req.params.urlId;
        const axiosResponse = await axios.get(apiUrl);
        const parsedRes = axiosResponse.data;

        res.json(parsedRes);
    } catch (err) {
        // console.log("Error fetching data:", err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

/*
    1629483,     'Collier',
    'Napheesa',  'napheesa-collier',
    1611661324,  'lynx',
    'Minnesota', 'Lynx',
    'MIN',       '24',
    'F',         '6-1',
    '173',       'Connecticut',
    'USA',       2019,
    1,           6,
    1,           '2019',
    '2024',      pts 20,
    reb 10.2,        ast 3.7,
    'Season'
*/
app.get("/allPlayers", async (req, res) => {
    try {
        const axiosResponse = await axios.get('https://www.wnba.com/players?team=all&position=all&show-historic-players=fal');
        const html = axiosResponse.data;
        const $ = cheerio.load(html);
    
        const scriptContent = $('#__NEXT_DATA__').html();
        const jsonData = JSON.parse(scriptContent);
        const allPlayersData = jsonData.props.pageProps.allPlayersData;
        
        let playerArr = [];
        allPlayersData.forEach(data => {
            playerArr.push({
                picId: data[0],
                lastName: data[1],
                firstName: data[2],
                city: data[6],
                team: data[7],
                abbr: data[8],
                position: data[10],
                number: data[9],
                ppg: data[21],
                rpg: data[22],
                apg: data[23]
            })
        })        
        
        res.json(playerArr);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
})

const getTeamNames = (actions) => {
    let teamNames = [];
    let i = 0;

    while(teamNames.length < 2){
        let currentAction = actions[i];

        if(currentAction.teamTricode){
            const teamTriCode = teamNames.find(teamName => teamName === currentAction.teamTricode);
            if(teamTriCode === undefined){
                teamNames.push(currentAction.teamTricode)
            }
        }

        i++;
    }

    return teamNames;
}

app.listen(3001, () => {
    console.log("Server is on 3001");
});