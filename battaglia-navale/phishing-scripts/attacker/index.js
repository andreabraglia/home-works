/* eslint-disable no-console */
const argv = require("simple-argv")

const fetch = require("node-fetch")
console.log(argv)
const team = argv.t || argv.team || argv.TEAM || "username"
const password =  argv.p || argv.password || argv.PASSWORD || "password"

const dA = "http://93.71.167.50:80"

const time = 1050

const login = async() => {
  try {
    let res = await fetch(`${dA}/signup?team=${team}&password=${password}`)

    res = res.status === 200 ? { msg: "Accreditamento riuscito" } : res.status === 409 ? { msg: "Già accreditato" } : (() => {
      console.log("Accreditamento fallito"); process.exit(1)
    })()

    console.log(res.msg, `credenziali: ${team} ${password} `)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
}

const hit = async({ x, y }) => {
  try {
    let res = await fetch(`${dA}/fire?x=${x}&y=${y}&team=${team}&password=${password}`)
    res = await res.json()

    console.log(`msg: ${res.message}    score: ${res.score} \ncell: ${x}; ${y}`)
  } catch (err) {
    console.error(err.stack)
    process.exit(1)
  }
  console.log()
}

const getField = async() => {
  try {
    let data = await fetch(`${dA}/?format=json`)
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
      console.log()
      console.log("Tutte le caselle sono state colpite")
      process.exit(0)
    }
  } catch (err) {
    console.error(err.stack)
  }
}

;(async() => {
  console.log("configs:", { team, password })
  console.log()

  await login()
  console.log()

  setInterval(getField, time)
})()