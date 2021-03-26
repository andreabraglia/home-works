/* eslint-disable no-console */
const argv = require("simple-argv")

const fetch = require("node-fetch")

const team = argv.t || argv.team || argv.TEAM || "zebbi"
const password =  argv.p || argv.password || argv.PASSWORD || "zebbi"

const mine = (argv.game !== "gio")
const port = argv.port || argv.p || 8080
const domain = argv.domain || argv.d || "http://localhost"
const link = [domain, port].join(":")

let time = 1050

const login = async() => {
  try {
    let res
    if (mine) {
      res = await fetch(`${link}/signup`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({ team, password })
      })

      res = await res.json()
    } else {
      res = await fetch(`${link}/signup?name=${team}&password=${password}`)

      res = res.status === 200 ? { msg: "Accreditamento riuscito" } : res.status === 409 ? console.log("Già accreditato") : (() => {
        console.log("Accreditamento fallito"); process.exit(1)
      })()
    }


    console.log(res.msg, `credenziali: ${team} ${password} `)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
}

const hit = async({ x, y }) => {
  try {
    let res = await fetch(`${link}/fire?x=${x}&y=${y}&team=${team}&password=${password}`)
    res = await res.json()

    if (!mine) {
      res.msg = res.message
    }

    if (res.msg === "Troppi tentativi (massimo una chiamata al secondo)" || res.status === 408) {
      time += 5
    }

    console.log(`msg: ${res.msg}    score: ${res.score} \ncell: ${x}; ${y}`)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
  console.log()
}

const getField = async() => {
  try {
    let data = await fetch("http://localhost:8080/?format=json")
    data = await data.json()

    const tempField = data.field.map(row => row.filter(cell => !cell.hit))
    const endGame = !tempField.every(row => row.every(cell => !cell))

    if (endGame) {
      const field = tempField.filter(row => row.length > 0)
      const y = Math.floor(Math.random() * field.length)
      const x = Math.floor(Math.random() * field[y].length)
      const cell = field[y][x]
      hit(cell)

    } else {
      console.log("Tutte le caselle sono state colpite")
      process.exit(0)
    }
  } catch (err) {
    console.error(err.stack)
  }
}

;(async() => {
  console.log("configs:", { link, team, password, mine, time })
  console.log()
  const res = await login()
  console.log()
  setInterval(getField, time)
})()


