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
app.engine("handlebars", handlebars({ layoutsDir: folder.layouts }))

app.use(require("body-parser").json())
app.use(express.static(folder.public))


app.get("/", (req, res) => {
  res.render("main", { layout : "index" })
})
app.all("*", (_, res) => {
  res.sendFile(`${folder.public}/index.html`)
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})