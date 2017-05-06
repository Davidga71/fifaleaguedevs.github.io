var results = require('../../_data/results.json');
var fs = require('fs');

const TYPEOF_UNDEFINED = 'undefined';
const WIN_POINTS = 3;
const DRAWN_POINTS = 1;
const LOST_POINTS = 0;
var table = {};

for (round in results) {
    addRoundResults(results[round]);
}

table = sortTable(table);
fs.writeFileSync('../../_data/table.json', JSON.stringify(table, null, 2));


function addRoundResults(round) {
    for (index in round) {
        var result = round[index];
        if (result.score1 > result.score2) {
            addTeamInfo(result.team1, WIN_POINTS, result.score1, result.score2);
            addTeamInfo(result.team2, LOST_POINTS, result.score2, result.score1);
        } else if (result.score1 < result.score2) {
            addTeamInfo(result.team1, LOST_POINTS, result.score1, result.score2);
            addTeamInfo(result.team2, WIN_POINTS, result.score2, result.score1);
        } else {
            addTeamInfo(result.team1, DRAWN_POINTS, result.score1, result.score2);
            addTeamInfo(result.team2, DRAWN_POINTS, result.score2, result.score1);
        }
    }
}

function addTeamInfo(teamName, points, goalFor, goalAgainst) {
    if (typeof table[teamName] == TYPEOF_UNDEFINED) {
        table[teamName] = getEmptyData();
    }
    var team = table[teamName];
    team.played++;
    team.points += points;
    team.goalFor += goalFor;
    team.goalAgainst += goalAgainst;
    team.goalDifference = team.goalFor - team.goalAgainst;
    if (points == WIN_POINTS) {
        team.won++;
    } else if (points == LOST_POINTS) {
        team.lost++;
    } else {
        team.drawn++;
    }

}

function sortTable(table) {

    var tableArray = tableToArray(table);
    tableArray.sort(function (team1, team2) {
        team1 = team1[1];
        team2 = team2[1];
        if (team1.points > team2.points) {
            return -1;
        }

        if (team2.points > team1.points) {
            return 1;
        }

        if (team1.goalDifference > team2.goalDifference) {
            return -1;
        }

        if (team2.goalDifference > team1.goalDifference) {
            return 1;
        }

        if (team1.goalAgainst > team2.goalAgainst) {
            return -1;
        }

        if (team2.goalAgainst > team1.goalAgainst) {
            return 1;
        }

        return 0;
    });

    return arrayToTable(tableArray);
}

function tableToArray(table) {
    var tableArray = [];
    for (var key in table) tableArray.push([key, table[key]]);
    return tableArray;
}

function arrayToTable(tableArray) {
    var table = {};
    for (var key in tableArray) table[tableArray[key][0]] = tableArray[key][1];
    return table;
}

function getEmptyData() {
    return {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        points: 0,
        goalFor: 0,
        goalAgainst: 0,
        goalDifference: 0
    }
}