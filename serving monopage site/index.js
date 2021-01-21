const express = require("express")
const app = new express()
const port = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080
const publicDir = `${__dirname}/public`

const { readFileSync } = require("fs-extra")

const templateDir = `${__dirname}/templates`
const template = readFileSync(`${templateDir}/index.html`, "utf-8")


const { nomi, build } = require("./assets")

const coppie = [["example 1", "person 1"], ["example 2", "person 2"]]

app.use(require("body-parser").json())
app.use(express.static(publicDir))

app.post("/remove", ({ body: { nome } }, res) => {
  let result
  nome = nome.toUpperCase()
  const index = nomi.indexOf(nome)
  if (index >= 0) {
    nomi.splice(index, 1)
    result = nomi[Math.floor(Math.random() * nomi.length)]
    nomi.push(nome)
  } else {
    result = nomi[Math.floor(Math.random() * nomi.length)]
  }
  if (result) {
    nomi.splice(nomi.indexOf(result), 1)
    coppie.push([result, nome])
    res.send({ result })
  } else {
    res.send({ result: "I nomi sono finiti" })
  }
})

app.get("/getData", (_, res) => {
  res.send({ nomi })
})

app.get("/getNames", (_, res) => {
  res.send(
    build(template, { Title: "Nomi", list: nomi })
  )
})

app.get("/zebbiaml", (_, res) => {
  res.send({ coppie })
})

app.all("/", (_, res) => {
  res.sendFile(`${publicDir}/index.html`)
})

app.all("*", (_, res) => {
  res.sendFile(`${publicDir}/index.html`)
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})