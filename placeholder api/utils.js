const fetch = require("node-fetch")
const e = module.exports

e.getPosts = async _ => {
  try {
    let res = await fetch("https://jsonplaceholder.typicode.com/posts")
    res = await res.json()

    res =
      res.reduce((acc, e) => {
        if (e) {
          acc[e.id] = e
        }
        return acc
      }, {})

    return res
  } catch (err) {
    console.error(err)
    return []
  }
}

e.getComments = async (id) => {
  try {
    let res = await fetch(`https://jsonplaceholder.typicode.com/post/${id}/comments`)
    res = await res.json()
    return res
  } catch (err) {
    console.error(err)
  }
}


e.badRequest = (message = "Bad request", status = 400) => (
  {
    status,
    message
  }
)

e.templateHtml = posts => `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1" crossorigin="anonymous">
      <link rel="stylesheet" href="/index.css">
      <title>Zebbi & Co.</title>
    </head>
    <body style="background: #001a38">
    ${template(posts)}
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js" integrity="sha384-ygbV9kiqUc6oa4msXn9868pTtWMgiQaeYH7/t7LECLbyPA2x65Kgf80OJFdroafW" crossorigin="anonymous"></script>
    </body>
  </html>`

const templateComments = comments => {
  const raw =  comments.reduce((acc, e, i) => {
    acc +=`
      <div class="accordion-item">
        <h2 class="accordion-header" id="flush-heading-${i}">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse-${i}" aria-expanded="false" aria-controls="flush-collapse-${i}">
            Comment ${e.id}
          </button>
        </h2>
        <div id="flush-collapse-${i}" class="accordion-collapse collapse" aria-labelledby="flush-heading-${i}" data-bs-parent="#accordionFlushExample">
          <div class="accordion-body">
            <h5 class="card-title text-uppercase">${e.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted">${e.email}</h6>
            <p class="card-text">${e.body}</p>
          </div>
        </div>
      </div>
      `
    return acc
  }, "")
  const accordion = `<div class="accordion accordion-flush" id="accordionFlushExample">${raw}</div>`
  return accordion
}

const template = posts =>
  Object.keys(posts).reduce((acc, e) => {
      acc += `
        <div class="card mx-auto" style="width: 80%; margin-top: 5%;">
          <div class="card-body">
            <h5 class="card-title text-uppercase">${posts[e].title}</h5>
            <h6 class="card-subtitle mb-2 text-muted">User ${posts[e].userId}</h6>
            <p class="card-text">${posts[e].body}</p>
            ${posts[e].comments ? templateComments(posts[e].comments): "" }
          </div>
        </div>
      `
      return acc
    }, "")