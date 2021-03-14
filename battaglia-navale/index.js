
const express = require("express")
const app = new express()

const { W, H, S, field, ships, teams, PORT, seeder } = require("./assets")
;(() => seeder())()

app.use(express.json())
app.use("/fire", ({ query: { team, password } }, res, next) => {

  if (!team || !password || typeof team !== "string" || typeof password !== "string") {
    return res.status(400).send({ msg: "Controlla le credenziali" })
  } else if (!teams[team]) {
    return res.status(400).send({ msg: "Prima di attaccare devi accreditarti" })
  } else if (teams[team].password !== password) {
    return res.status(403).send({ msg: "Hai sbagliato la password" })
  }

  if ((teams[team].time - Date.now()) <= 1000) {
    res.status(400).send({ msg: "Troppi tentativi (massimo una chiamata al secondo)" })
  } else {
    teams[team].lastFiredBullet = Date.now()
    teams[team].firedBullets += 1
    next()
  }
})


app.get("/", ({ query: { format } }, res) => {
  const visibleField = field.map(row => row.map(cell => ({
    x: cell.x,
    y: cell.y,
    hit: cell.hit,
    team: cell.team,
    ship: cell.hit ?
      cell.ship ? { id: cell.ship.id, name: cell.ship.name, alive: cell.ship.alive, killer: cell.ship.killer } : null
      : null
  })))

  const visibleShipInfo = ships.map(ship => ({
    id: ship.id,
    name: ship.name,
    alive: ship.alive,
    killer: ship.killer
  }))

  if (format === "json") {
    res.json({
      field: visibleField,
      ships: visibleShipInfo
    })
  } else {
    const formattedField =
      visibleField.map(row =>
        `<tr> 
          ${row.map(cell => `<td class="${cell.ship ? cell.ship.name : "acqua"}"></td>`).join("")}
          </tr>`
      ).join("")

    res.send(
      `<!DOCTYPE html>
              <html lang="it">
                <head>
                  <title>battaglia navale</title>
                  <style>
                    body {
                      width: 100%;
                      height: 100%;
                      margin: 0;
                      padding: 0;
                      align-content: center;
                    }
                    
                    table, td, th {
                      border: 1px solid white;
                    }
                    
                    td {
                       width: 40px;
                       height: 40px;
                    }
                    
                    td.acqua {
                      background-image:url('https://i.gifer.com/GPyH.gif');
                      background-size: contain;
                    }

                    table {
                      width: 80%;
                      margin: 3% auto;
                      border-collapse: collapse;
                    }
                  </style>
                </head>
                <body>
                  <table>
                    <tbody>
                      ${formattedField}
                    </tbody>
                  </table>
                </body>
              </html>`
    )
  }
})

app.get("/score", ({ query: { team = "" } }, res) => {
  if (team) {
    res.send(teams[team])
  } else {
    res.send(teams)
  }
})

app.post("/signup", ({ body: { name, password } }, res) => {
  if (typeof name !== "string" || typeof password !== "string" || !name || !password) {
    res.status(400).send({ msg: "Ricontrolla le credenziali" })
  }
  if (teams[name]) {
    res.status(400).send({ msg: `Ti sei già accreditato con il nome ${name}` })
  } else {
    teams[name] = {
      name, password, score: 0, killedShips: [], firedBullets: 0, lastFiredBullet: null
    }
    res.status(200).send({ msg: "Accreditamento riuscito!", credentials: { name, password } })
  }
})

app.get("/fire", ({ query: { x, y, team } }, res) => {
  const teamData = teams[team]

  if (x > W || y > H || x < 0 || y < 0) {
    teamData.score -= 20
    return res.status(400).send({ score: teamData.score, msg: "Sei un mona, sei andato fuori campo" })
  }

  const cell = field[x][y]

  if (cell.ship && !cell.hit) {
    cell.hit = true
    const firedShip = cell.ship
    if (firedShip.curHp === (firedShip.maxHp - 1)) {
      // Update ship data
      firedShip.alive = false
      firedShip.curHp = 0
      firedShip.killer = team
      // Update team data
      teamData.killedShips.push(firedShip)
      teamData.score += 15

      return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "barca affondata" })
    } else {
      firedShip.killer = team
      firedShip.curHp -= 1
      // Update team data
      teamData.killedShips.push(firedShip)
      teamData.score += 10

      return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "barca colpita" })
    }

  } else if (cell.hit) {
    teamData.score -= 8
    res.status(400).send({ score: teamData.score, info: { x, y, team }, msg: "casella già colpita" })
  } else {
    cell.hit = true
    res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "acqua" })
  }
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))