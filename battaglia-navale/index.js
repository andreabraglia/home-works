
const express = require("express")
const app = new express()

const { W, H, field, ships, teams, PORT, seeder } = require("./assets")

;(() => seeder())()

// FOR TESTING PURPOSES
// teams.a = {
//   team: "a",
//   password: "a",
//   score: 0,
//   killedShips: [],
//   firedBullets: 0,
//   lastFiredBullet: new Date().getTime()
// }

app.use(express.json())
app.use("/fire", ({ query: { team, password, x, y } }, res, next) => {
  if (!team || !password || typeof team !== "string" || typeof password !== "string") {
    return res.status(400).send({ msg: "Controlla le credenziali" })
  } else if (!teams[team]) {
    return res.status(400).send({ msg: "Prima di attaccare devi accreditarti" })
  } else if (teams[team].password !== password) {
    return res.status(403).send({ msg: "Hai sbagliato la password" })
  }

  if ((-teams[team].lastFiredBullet + new Date().getTime()) <= 1000) {
    teams[team].score -= 1
    res.status(400).send({ msg: "Troppi tentativi (massimo una chiamata al secondo)" })
  } else {

    if (!x || !y) {
      return res.status(400).send({ msg: "controlla le credenziali" })
    }

    teams[team].lastFiredBullet = new Date().getTime()
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
  if (teams[team]?.password === password) {
    res.send(teams[team])
  } else {
    res.send(teams)
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
      team, password, score: 0, killedShips: [], firedBullets: 0, lastFiredBullet: new Date().getTime()
    }
    res.status(200).send({ msg: "Accreditamento riuscito!", credentials: { team, password } })
  }
})


/*
* Cella già colpita     => -2
* Cella fuori dal campo => -20
* Nave colpita          => 1
* Nave affondata        => 3
*/
app.get("/fire", ({ query: { x, y, team } }, res) => {
  const teamData = teams[team]


  if (x > W || y > H || x < 0 || y < 0) {
    teamData.score -= 20
    return res.status(400).send({ score: teamData.score, msg: "Sei un mona, sei andato fuori campo" })
  }

  const cell = field[y][x]

  if (cell.ship && !cell.hit) {
    cell.hit = true
    const firedShip = cell.ship
    if (firedShip.curHp === 1) {
      // NAVE AFFONDATA

      // Update ship data
      firedShip.alive = false
      firedShip.curHp = 0
      firedShip.killer = team
      // Update team data
      teamData.killedShips.push(firedShip)
      teamData.score += 3

      return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "barca affondata" })
    } else {
      // NAVE COLPITA
      firedShip.killer = team
      firedShip.curHp -= 1
      // Update team data
      teamData.killedShips.push(firedShip)
      teamData.score += 1

      return res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "barca colpita" })
    }

  } else if (cell.hit) {
    // CELLA GIA' COLPITA
    teamData.score -= 2
    res.status(400).send({ score: teamData.score, info: { x, y, team }, msg: "casella già colpita" })
  } else {
    cell.hit = true
    res.status(200).send({ score: teamData.score, info: { x, y, team }, msg: "acqua" })
  }
})

app.get("/admin", (req, res) => {
  res.send({ field, ships, teams })
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))