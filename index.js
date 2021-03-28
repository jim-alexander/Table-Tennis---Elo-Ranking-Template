// Libraries
const Elo = require('arpad')
const { cloneDeep } = require('lodash')
const fs = require('fs')

// Input Data
const games = require('./games.json')

const elo = new Elo()

// Temp Object
let players = {}

// Player Ranking pre games
let initial_rank = {
  'Tom S': 720,
  'Daniel M': 700,
  'Andy T': 680,
  'Jim A': 550,
  'Tim G': 400,
  'Pat A': 400
}

games.forEach(({ winner, loser }) => {
  let newPlayer = { score: 400, points: { won: 0, lost: 0 }, games: { played: 0, won: 0, lost: 0 } }
  if (!players[winner.name]) {
    players[winner.name] = cloneDeep(newPlayer)
    initial_rank[winner.name] && (players[winner.name].score = initial_rank[winner.name]) //Check player has initial score
  }
  if (!players[loser.name]) {
    players[loser.name] = cloneDeep(newPlayer)
    initial_rank[loser.name] && (players[loser.name].score = initial_rank[loser.name]) //Check player has initial score
  }

  // Score
  players[winner.name].score = elo.newRatingIfWon(players[winner.name].score, players[loser.name].score)
  players[loser.name].score = elo.newRatingIfLost(players[loser.name].score, players[winner.name].score)

  // Career points won & lost || (Every game played)
  players[winner.name].points.won += winner.points
  players[loser.name].points.won += loser.points

  players[winner.name].points.lost += loser.points
  players[loser.name].points.lost += winner.points

  // Career games played
  players[winner.name].games.played++
  players[loser.name].games.played++

  // Career games won / lost
  players[winner.name].games.won++
  players[loser.name].games.lost++
})

console.log(players)

fs.writeFileSync('leaderboard.json', JSON.stringify(players))
