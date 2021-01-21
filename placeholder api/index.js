const express = require("express")
const app = new express()
const port = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080
const publicDir = `${__dirname}/public`

const { badRequest, getComments, getPosts, templateHtml } = require("./utils")

let posts
(async function() {
  posts = await getPosts()
}())

app.use(require("body-parser").json())
app.use(express.static(publicDir))

app.get("/post/:id", async({ params: { id = null } }, res) => {
  if (!id || isNaN(+id)) {
    badRequest("The ID you choose is not a number", 400)
  } else {
    const post = { comments: await getComments(id), ...posts[id] }
    res.send(templateHtml({ post }))
  }
})

app.get("/", (_, res) => {
  if (Object.keys(posts)) {
    res.send(templateHtml(posts))
  } else {
    badRequest("JSON-placeholder API doesn't responds, try later", 500)
  }
})

app.all("*", (_, res) => {
  if (Object.keys(posts)) {
    res.send(templateHtml(posts))
  } else {
    badRequest("JSON-placeholder API doesn't responds, try later", 500)
  }
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})