const feedback = document.getElementById("res")
const button = document.getElementById("confirm-button")
const table = document.getElementById("coppie")

const call = (event) => {

  let nome = document.getElementById("name").value

  event.preventDefault()

  if (!nome) {
    return feedback.innerText = "Perfavore inserisci un nome"
  }

  fetch("http://localhost:8080/remove", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      nome
    })
  })
    .then(res => res.json())
    .then(({ result }) => {
      feedback.innerText = "Il nome sorteggiato è: " + result
      button.disabled = true
      nome = " "
    })
    .catch(console.log)
}

const mostraNomi = () => {
  fetch("http://localhost:8080/zebbiaml")
    .then(res => res.json())
    .then(({ coppie }) => {
      console.log(coppie)
      const data =
        coppie.reduce((acc, e) => {
          acc +=
          `<tr>
            <td>${e[0]}</td>
            <td>${e[1]}</td>
          </tr>`

          return acc
        }, "")
      table.innerHTML = "<tr><td>COPPIE:</td></tr>" + data
    }).catch((err) => {
      table.innerHTML =
        `<tr>
          <td>IL SERVER L'È MORT:</td>
        </tr>
        <tr>
          <td>${err.message}</td>
          <td>${err.stack}</td>
        </tr>`
    })
}