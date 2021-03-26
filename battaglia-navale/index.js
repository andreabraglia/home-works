
const express = require("express")
const app = new express()

const { W, H, field, ships, teams, PORT, seeder } = require("./assets")

;(() => seeder())()

app.use(express.json())
app.use("/fire", ({ query: { team, password, x, y } }, res, next) => {

  let status, msg
  if (!team || !password || typeof team !== "string" || typeof password !== "string") {
    status = 400
    msg = "Controlla le credenziali"

  } else if (!x || !y) {
    status = 400
    msg = "Controlla le coordinate"

  } else if (!teams[team]) {
    status = 401
    msg = "Prima di attaccare devi accreditarti"

  } else if (teams[team].password !== password) {
    status = 401
    msg = "Hai sbagliato la password"

  } else if ((new Date().getTime() - teams[team].lastFiredBullet) <= 1000) {
    status = 408
    msg = "Troppi tentativi (massimo una chiamata al secondo)"
    teams[team].score -= 1
  }

  if (status || msg)  {
    return res.status(status).send({ msg })
  }

  teams[team].lastFiredBullet = new Date().getTime()
  teams[team].firedBullets += 1
  next()

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
          ${row.map(cell => `<td class="${cell.ship ? "colpita" : "acqua"}">${cell.hit ? "X" : ""}</td>`).join("")}
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
                       text-align: center;
                    }
                    
                    td.colpita {
                      background-image: url("https://downloadwap.com/thumbs3/screensavers/d/3/abstract/explosion463802twilightwap.com.gif");
                      background-size: contain;
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

app.get("/score", ({ query: { team, password } }, res) => {
  const leaderboard = Object.values(teams)
    .sort(({ score: a }, { score: b }) => a > b ? -1 : 1)
    .map(({ team, score, killedShips }, i) => ({ team, score, killedShips, position: i }))

  if (teams[team]?.password === password) {
    res.send({ team: teams[team], leaderboard })
  } else {
    res.send({ teams, leaderboard })
  }
})

app.post("/signup", ({ body: { team, password } }, res) => {
  if (typeof team !== "string" || typeof password !== "string" || !team || !password) {
    return res.status(400).send({ msg: "Ricontrolla le credenziali" })
  }

  if (teams[team]) {
    res.status(400).send({ msg: `Ti sei già accreditato con il nome ${team}` })
  } else {
    teams[team] = {
      team, password, score: 0, killedShips: [], firedBullets: 0, lastFiredBullet: 0
    }
    res.status(200).send({ msg: "Accreditamento riuscito!", credentials: { team, password } })
  }
})


/*
+ Penalità:
*   Cella già colpita     => -2
*   Cella fuori dal campo => -20
*   Troppi tentativi       => -1
* Punti:
*   Nave colpita          => 1
*   Nave affondata        => 3
*/
app.get("/fire", ({ query: { x, y, team } }, res) => {
  const teamData = teams[team]

  if (x > W || y > H || x < 0 || y < 0) {
    teamData.score -= 20
    return res.status(400).send({ score: teamData.score, msg: "Sei un mona, sei andato fuori campo" })
  }

  const cell = field[y][x]

  if (cell.hit) {
    teamData.score -= 2
    res.status(400).send({ score: teamData.score, info: { x, y, team }, msg: "casella già colpita" })
  }

  cell.hit = true

  if (!cell.ship) {
    cell.hit = true
    return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "Acqua" })
  }

  let msg
  const firedShip = cell.ship
  firedShip.curHp--
  firedShip.killer = team
  teamData.killedShips.push({ name: firedShip.name, id: firedShip.name, x, y })

  if (!firedShip.curHp) {
    firedShip.alive = false
    teamData.score += 3
    msg = "Barca affondata"
  } else {
    teamData.score += 1
    msg = "Barca colpita"
  }

  res.status(200).send({ score: teamData.score, info: { x, y, team }, msg })
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

// eslint-disable-next-line no-console
app.listen(PORT, () => console.log("App listening on port %O", PORT))