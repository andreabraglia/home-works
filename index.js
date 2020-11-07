const express = require("express")
const handlebars = require("express-handlebars")
const app = new express()
const port = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080


const folder = {
  public: __dirname + "/public",
  layouts: __dirname + "/views/layouts",
  partials: __dirname + "/views/partials"
}

const badRequest = (message = "Bad request", status = 400) => {
  {
    status,
    message
  }
}

app.set("view engine", "handlebars")
app.engine(
  "handlebars",
  handlebars({
    layoutsDir: folder.layouts,
    extname: "hbs",
    defaultLayout: "index",
    partialsDir: folder.partials // Funziona anche senza
  })
)

app.use(require("body-parser").json())
app.use(express.static(folder.public))


app.get("/", (req, res) => {
  res.render("main", { about: true, projects: true, contact: true })
})

;[
  { path: "About", filler: { about: true } },
  { path: "Projects", filler: { projects: true } },
  { path: "Contact", filler: { contact: true } }
].forEach(({ path, filler }) => {
  app.get(`/${path}`, (_, res) => res.render("main", filler))
})


app.all("*", (_, res) => {
  res.send("<div style='margin: auto; text-align: center'><h1>404</h1> <br/> <h3>RESOURCE NOT FOUND</h3></div>")
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})