/* eslint-disable no-console */
const argv = require("simple-argv")
const fetch = require("node-fetch")

const getRandomCred = () => "xxxxxxxxxxxx4xx-- Zebbi & Co. --xx5xxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8)
  return v.toString(16)
})

const team = argv.t || argv.team || argv.TEAM || getRandomCred()
const password =  argv.p || argv.password || argv.PASSWORD || getRandomCred()

const mine = argv.game === "ab"

const port = argv.port || argv.p || 8080
const domain = argv.domain || argv.d || "http://93.42.249.207"

const link = [domain, port].join(":")

let time = argv.time === 0 ? 0 : argv.time ? argv.time : 1050

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
      res = await fetch(`${link}/signup?team=${team}&password=${password}`)

      res = res.status === 200 ? { msg: "Accreditamento riuscito" } : res.status === 409 ? { msg: "Già accreditato" } : (() => {
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

    if (res.msg === "Troppi tentativi (massimo una chiamata al secondo)" || res.status === 408 || res.status === 429) {
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
    let data = await fetch(`${link}/?format=json`)
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
  console.log("Configs: %O", { link, team, password, mine, time })
  console.log()
  await login()
  console.log()
  setInterval(getField, time)
})()
