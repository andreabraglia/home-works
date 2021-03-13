const express = require("express")
const app = new express()
const port = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080
const publicDir = `${__dirname}/public`

app.use(express.json())
app.use(express.static(publicDir))

app.get("/", (req, res) => {
  res.sendStatus(200)
})