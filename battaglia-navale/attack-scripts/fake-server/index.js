const faker = require("faker")
const express = require("express")
const app = new express()
const { join } = require("path")
require("dotenv").config()

const teams = {}
const field = []
const ships = []
const cred = []

const {
  PORT = 8080,
  W = 50,
  H = 50,
  S = 8000,
  FIRE_LIMIT = 1000
} = process.env

// const gameStatus = {
//   active: true,
//   startTime: new Date().getTime(),
//   endTime: null
// }
//
// for (let y = 0; y < H; y++) {
//   const row = []
//   for (let x = 0; x < W; x++) {
//     row.push({
//       team: null,
//       x,
//       y,
//       ship: null,
//       hit: false
//     })
//   }
//   field.push(row)
// }
//
// let id = 1
// for (let i = 0; i < S; i++) {
//   const maxHp = faker.random.number({ min: 1, max: 6 })
//   const vertical = faker.random.boolean()
//   console.log({ vertical, maxHp })
//
//   const ship = {
//     id,
//     name: faker.name.firstName(),
//     x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
//     y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
//     vertical,
//     maxHp,
//     curHp: maxHp,
//     killer: null
//   }
//
//   let found = false
//   for (let e = 0; e < ship.maxHp; e++) {
//     const x = ship.vertical ? ship.x : ship.x + e
//     const y = ship.vertical ? ship.y + e : ship.y
//     if (field[y][x].ship) {
//       found = true
//       break
//     }
//   }
//
//   if (!found) {
//     for (let e = 0; e < ship.maxHp; e++) {
//       const x = ship.vertical ? ship.x : ship.x + e
//       const y = ship.vertical ? ship.y + e : ship.y
//       field[y][x].ship = ship
//     }
//
//     ships.push(ship)
//     id ++
//   }
// }

// const getVisibleField = () => {
//   return field.map(row => row.map(cell => ({
//     x: cell.x,
//     y: cell.y,
//     hit: cell.hit,
//     team: cell.team,
//     ship: cell.hit ?
//       cell.ship ? {
//         id: cell.ship.id,
//         name: cell.ship.name,
//         alive: cell.ship.curHp > 0,
//         killer: cell.ship.killer
//       } : null
//       : null
//   })))
// }
//
// const getVisibleShip = () => {
//   return ships.map(ship => ({
//     id: ship.id,
//     name: ship.name,
//     alive: ship.curHp > 0,
//     killer: ship.killer
//   }))
// }
//
// const getScores = () => {
//   return Object.values(teams).map(({
//     name,
//     score,
//     killedShips,
//     firedBullets,
//     lastFiredBullet
//   }) => ({
//     name,
//     score,
//     killedShips,
//     firedBullets,
//     lastFiredBullet
//   }))
// }
//
// const renderField = visibleField => {
//   return `
//     <table>
//       <tbody>
//         ${visibleField.map(
//     row => `
//           <tr>
//             ${row.map(cell => `
//               <td class="${[
//     cell.hit ? "hit" : null,
//     cell.hit && cell.ship ? "ship" : null,
//     cell.ship?.killer ? "killed" : null
//   ].filter(e => e).join(" ")}">${cell.ship ? cell.team.name : ""}</td>`
//   ).join("")}
//           </tr>`)
//     .join("")}
//       </tbody>
//     </table>
//   `
// }
//
// const renderScores = score => {
//   return `
//     <h1>SCORES</h1>
//     <ol>
//       ${score
//     .sort((a, b) => b.score - a.score)
//     .map(({ name, score, firedBullets, killedShips }) => `<li>${name} - score: ${score} - kills: ${killedShips.length} - fired bullets: ${firedBullets}</li>`)
//     .join("")
// }
//     </ol>
//   `
// }

app.use(express.static(join(__dirname, "./public")))

app.get("/signup", ({ query: { team: teamName, password } }, res) => {

  teams[teamName] = {
    name: teamName,
    password,
    score: 0,
    killedShips: [],
    firedBullets: 0,
    lastFiredBullet: 0
  }

  cred.push({ [teamName]: password })
  console.log("Credentials: %O", { name: teamName, password })
  res.sendStatus(200)
})

app.get("/fire", ({ query: { x, y, team: teamName, password } }, res) => {
  let message, score
  if (typeof x === "undefined" || typeof y === "undefined" || x >= W || x < 0 || y >= H || y < 0) {
    message = "OUT_OF_FIELD"
    score = -10
  }

  const messages = {
    WATER: 0,
    ALREADY_HIT: -5,
    HIT: 10,
    KILL: 50
  }

  message = Object.keys(messages)[Math.floor(Math.random() * Object.keys(messages).push("WATER", "WATER"))] || "WATER"
  score = messages[message]

  res.sendStatus(200)


  // TODO:
  //  - Se si vuole aumentare il tempo:
  //      res.json({
  //        time: 2000, // 2 sec.
  //      })
  //  - Se si vuole mandare un fake messaggio con un fake score:
  //      res.json({
  //        message,
  //        score
  //      })

})

app.get("/admin", (_, res) => res.send({ teams }))

app.listen(PORT, () => console.log("App listening on port %O", PORT))