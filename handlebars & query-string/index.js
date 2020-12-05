const express = require("express")
const handlebars = require("express-handlebars")
const fetch = require("node-fetch")

const app = new express()
const port = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080


const folder = {
  public: __dirname + "/public",
  layouts: __dirname + "/views/layouts",
  partials: __dirname + "/views/partials"
}

const badRequest = (message = "Bad request", status = 400) => (
  {
    status,
    message
  }
)

app.set("view engine", "handlebars")
app.enable("view cache")
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

;[
  { path: "", filler: { about: true, projects: true, contact: true } },
  { path: "About", filler: { about: true } },
  {
    path: "Projects", filler: { projects: true }, callback: async (req, res) => {
      const page = req.query.page || 1
      try {
        let imgs = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=4`)
        imgs = await imgs.json()
        imgs = imgs.reduce((acc, obj, index) => {
          acc.push({ ...obj, index: !!(index % 2) })
          return acc
        }, [])
        res.render("main", { projects: true, imgs })
      } catch (err) {
        console.log(err)
        res.send(badRequest("Api image seems down", 500))
      }
    }
  },
  {
    path: "Query", callback: async ({ query = { help: false, option: "", value: "", offset: 0  }, headers, connection, socket }, res) => {
      const ip = headers["x-forwarded-for"] || connection.remoteAddress || socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)

      let { help, option, value, offset, ...others } = query

      others = Object.keys(others)
      if (help) {
        return res.render("documentation")
      } else if (others.length) {
        return res.render("documentation", { error: true, options: others })
      }

      const link = `https://pokeapi.co/api/v2/pokemon${option === "pokemon" ? "/" + value : `?limit=10&offset=${offset}` }`

      if (option === "pokemon") {
        let apiRes

        try {
          apiRes = await fetch(link)
          apiRes = await apiRes.json()
          apiRes = await fetch(apiRes.forms[0].url)
          apiRes = await apiRes.json()
        } catch (err) {
          console.error(err)
          console.dir(apiRes)
          return res.render("error")
        }


        const data = { name: apiRes.name, ...apiRes.pokemon }
        data.images = Object.keys(apiRes.sprites).reduce((acc, image,  index) => {
          acc.push({ image: apiRes.sprites[image], description: image, index: !!(index % 2) })
          return acc
        }, [])

        console.log("POKEMON INFO:", data)

        res.render("pokemon", { ...data })
      } else if (option === "listing") {
        let apiRes
        try {
          apiRes = await fetch(link)
          apiRes = await apiRes.json()
          console.log(apiRes)
          apiRes = apiRes.results
          return res.send({  yourIP: ip, apiRes })
        } catch (err) {
          console.error(err)
          console.dir(apiRes)
          return res.render("error")
        }

      } else {
        return res.render("documentation", { error: true, options: others })
      }
    }
  },
  { path: "Contact", filler: { contact: true } },
  {
    path: "Subscribe", method: "post", callback: ({ body }, res) => {
      console.log(body)
      res.send({ status: 200 })
    }
  }
].forEach(({ path, method, filler, callback }) => {
  app[method || "get"](`/${path}`, callback ? callback : (_, res) => res.render("main", filler))
})


app.all("*", (_, res) => {
  res.render("error")
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})