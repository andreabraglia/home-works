const faker = require("faker")
const { createConnection, createTables, executeQuery, truncateTables } = require("./utils")

const classes = []
const names = []
const profs = []
const subjects = ["ENG", "ITA", "LAT", "FIL", "STO"]
const insegnamenti = {}
const surname_class = {}

const insertClasses = (num) => {
  let query = "INSERT INTO Classi VALUES "
  let letter = "A"
  for (let i = 1; i <= num; i++) {
    const tmp =  `${i <= 5 ? i : i - (Math.trunc(i / 5) * 5) }${letter}`
    query += `("${tmp}"), `
    classes.push(tmp)
    if (i > 5) {
      letter = String.fromCharCode(letter.charCodeAt() + 1)
    }
  }
  executeQuery(query)
  console.log("Classi seeded!! \n")
}

const insertStudents = (num) => {
  let i = 0
  while (i < num) {
    const name = faker.fake("\"{{name.firstName}}\", \"{{name.lastName}}\"")

    if (!names.includes(name)) {
      names.push(name)
      i++
    }
  }

  const query = names.reduce((acc, name, i) => {
    const surname = name.split(",")[0]
    const tmpClass = classes[i < classes.length ? i : i - (Math.trunc(i / 5) * 5)]
    surname_class[surname] = tmpClass

    acc += `("${tmpClass}", ${name}), `
    return acc
  },
  "INSERT INTO Studenti VALUES")

  executeQuery(query)
  console.log("Studenti seeded!! \n")
}

const insertSubjects = () => {
  const query = `
    INSERT INTO Materie 
        VALUES
            ("ENG", "Inglese"),
            ("ITA", "Italiano"),
            ("LAT", "Latino"),
            ("FIL", "Filosofia"),
            ("STO", "Storia");`

  executeQuery(query)
  console.log("Materie seeded!! \n")
}

const insertProfs = (num) => {
  let i = 0
  while (i < num) {
    const name = faker.fake("\"{{name.firstName}}\", \"{{name.lastName}}\"")
    if (!profs.includes(name)) {
      profs.push(name)
      i++
    }
  }

  const query = profs.reduce((acc, name) => acc += `(${name}, DEFAULT), `, "INSERT INTO Docenti VALUES")

  executeQuery(query)
  console.log("Docenti seeded!! \n")
}

const insertInsegnamenti = (num) => {
  let i = 0
  const maxID = profs.length || 7
  let query = "INSERT INTO Insegnamenti VALUES "
  while (i < num) {
    const subj = subjects[Math.floor(Math.random() * subjects.length)]
    const profId = Math.floor(Math.random() * maxID)

    if (insegnamenti[subj] !== profId) {
      insegnamenti[subj] = profId
      query += `("${profId}", "${subj}"), `
      i++
    }
  }

  executeQuery(query)
  console.log("Insegnamenti seeded!! \n")

}

const insertGrades = (num) => {
  let i = 0
  let query = "INSERT INTO Valutazioni VALUES"
  while (i < num) {
    const tmpQuery = names.reduce((acc, surname) => {
      const grade = Math.floor(Math.random() * 10)
      surname = surname.split(",")[0]
      const tmpClass = surname_class[surname]
      const date = faker.date.between(`${2001 - Number(tmpClass[0])}-09-07`, "2021-06-07").toISOString().split("T")[0]
      const subj = subjects[Math.floor(Math.random() * subjects.length)]
      acc += `("${tmpClass}", ${surname}, "${subj}", "${date}", ${grade}), `
      i++
      return acc
    }, "")
    i++
    query += tmpQuery
  }

  executeQuery(query)
  console.log("Valutazioni seeded!! \n")
}

(async() => {
  try {
    await createConnection(process.argv)
    truncateTables()
    createTables()
    insertClasses(5)
    insertStudents(7)
    insertSubjects()
    insertProfs(5)
    insertInsegnamenti(8)
    insertGrades(2)
    process.exit(0)
  } catch (err) {
    console.error(err)
  }
})()