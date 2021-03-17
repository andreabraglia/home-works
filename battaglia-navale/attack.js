const express = require("express")
const app = new express()

const argv = require("simple-argv")
const port = argv.PORT || argv.port || 8000

const fetch = require("node-fetch")

const team = argv.team || argv.TEAM || "zebbi"
const password =  argv.password || argv.PASSWORD || "zebbi"

const login = async() => {
  try {
    let res = await fetch("http://localhost:8080/signup", {
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ team, password })
    })

    res = await res.json()

    console.log(res)
  } catch (err) {
    console.error(err.stack)
  }
}

const hit = async(cell) => {
  try {
    let res = await fetch(`http://localhost:8080/fire?x=${cell.x}&y=${cell.y}&team=${team}&password=${password}`)
    res = await res.json()

    console.log(res)
  } catch (err) {
    console.error(err.stack)
  }

  // console.log(res)
  //   .then(res => res.json())
  //   .then(data => console.log(data))
  //   .catch(err => console.error(err))
}

const getField = async() => {
  try {
    let data = await fetch("http://localhost:8080/?format=json")
    data = await data.json()
    console.log(data)
    const tempField = data.field.map(row => row.filter(cell => !cell.hit))
    const endGame = !tempField.every(row => row.every(cell => !cell))
    if (endGame) {
      const field = tempField.filter(row => row.length > 0)
      const yRandom = Math.floor(Math.random() * field.length)
      const xRandom = Math.floor(Math.random() * field[yRandom].length)
      const cell = field[yRandom][xRandom]
      hit(cell)
    } else {
      console.log("Tutte le caselle sono state colpite")
    }
  } catch (err) {
    console.error(err)
  }
}
;(async() => {
  const res = await login()
})()

setInterval(getField, 1001)

app.get("/score", (req, res) => {
  fetch("http://localhost:8080/score", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ team, password })
  })
    .then(json => json.json())
    .then(data => res.json({ data }))
})

app.listen(port, () => console.log("Listening on port", port))
