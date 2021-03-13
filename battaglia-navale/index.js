
const express = require("express")
const app = new express()

const { W, H, S, field, ships, teams, PORT, seeder, ipBlackList } = require("./assets")

seeder()
console.log(field)

app.use(express.json())

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
    // html format field

    const formattedField =
      visibleField.map(row =>
        `<tr> 
          ${
  row.map(cell =>
    `<td>${cell.ship ? cell.ship.name : ""}</td>`)
    .join("")
}
          </tr>`
      )
        .join("")

    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>battaglia navale</title>
      <style>
        table, td, th {
          border: 1px solid black;
        }

        td {
          width: 40px;
          height: 40px;
        }
        
        table {
          width: 100%;
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
    </html>
    `)
  }
})

app.get("/score", (req, res) => {
  res.json([])
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

app.use("/fire", ({ ip, query: { team, password } }, res, next) => {
  const ips = Object.keys(ipBlackList)
  if (ips.includes(ip)) {
    if (ipBlackList[ip].time - Date.now() <= 1000) {
      res.status(400).send({ msg: "Troppi tentativi, sei stato blacklistato" })
    } else {
      if (teams?.team?.password === password) {
        next()
      } else {
        res.status(401).send({ msg: "Prima di attaccare devi accreditarti" })
      }
    }
  } else {
    ipBlackList[ip] = { time: Date.now() }
  }
})

// const ship = {
//   id,
//   name: faker.name.firstName(),
//   x: faker.random.number({ min: 0, max: vertical ? W - 1 : W - maxHp }),
//   y: faker.random.number({ min: 0, max: vertical ? H - maxHp : H - 1 }),
//   vertical,
//   maxHp,
//   curHp: 4,
//   alive: true,
//   killer: null
// }

app.get("/fire", ({ query: { x, y, team } }, res) => {
  /*
    TODO:
      1. segnare la cella come colpita
      2. segnare eventualmente la nave come colpita (ridurre gli hp e verificare se e' morta)
      3. assegnare il team sia alla cella che alla nave (eventuale)
      5. definire un punteggio conseguente all'attacco:
        c. punteggio positivo se spari su nave ma non la uccidi
        d. punteggio molto positivo se spari su nave e la uccidi
  */
  if (x > W || y > H || x < 0 || y < 0) {
    res.status(400).send({ msg: "Sei un mona, sei andato fuori campo" })
    // TODO: gestire lo score molto negativo x fuori campo
  }

  if (field[x][y].ship) {
    // TODO: gestire il copito

  } else if (field[x][y].hit) {
    res.status(400).send({ score: 0, info: { x, y, team }, msg: "casella già colpita" })
    // TODO: gestire lo score molto negativo x casella già colpita

  } else {
    res.status(200).send({ score: 0, info: { x, y, team }, msg: "acqua" })
  }
})

app.all("*", (req, res) => {
  res.sendStatus(404)
})

app.listen(PORT, () => console.log("App listening on port %O", PORT))