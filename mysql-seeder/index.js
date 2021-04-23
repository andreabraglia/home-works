let [path, name, ...argv] = process.argv

argv = argv.reduce((acc, e, i) => {
  if (e[0] === "-") {
    e = e.replace(/-/g, "")
    acc[e] = ""
  } else {
    acc[argv[i - 1].replace(/-/g, "").toLowerCase()] = e
  }

  return acc
}, {})

const { username, password, database } = argv


const mysql = require("mysql2")

if (!password) {
  throw new Error("Non c'è la password")
}

const connection = mysql.createConnection({
  host: "localhost",
  user: username || "root",
  password,
  database: database || "Test"
})


;`  CREATE TABLE IF NOT EXISTS Classi (
        classe VARCHAR(255) PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS Studenti (
        classe  VARCHAR(255) REFERENCES Classi (classe),
        cognome VARCHAR(255),
        nome    VARCHAR(255) NOT NULL,
        PRIMARY KEY (classe, cognome)
    );
    CREATE TABLE IF NOT EXISTS Materie (
        sigla VARCHAR(255) PRIMARY KEY,
        nome  VARCHAR(255) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS Docenti (
        cognome VARCHAR(255) NOT NULL,
        nome    VARCHAR(255) NOT NULL,
        id      INT PRIMARY KEY AUTO_INCREMENT
    );
    CREATE TABLE IF NOT EXISTS Insegnamenti (
        idDocente    INT REFERENCES Docenti (id),
        siglaMateria VARCHAR(255) REFERENCES Materie (sigla),
        PRIMARY KEY (idDocente, siglaMateria)
    );
    CREATE TABLE IF NOT EXISTS Valutazioni (
        classeStudente  VARCHAR(255),
        cognomeStudente VARCHAR(255),
        siglaMateria    VARCHAR(255) NOT NULL REFERENCES Materie (sigla),
        data            DATE,
        voto            INT          NOT NULL,
        FOREIGN KEY (classeStudente, cognomeStudente) REFERENCES Studenti (classe, cognome)
    );`.split(";").forEach(async(query) => {
    if (query && query !== "") {
      try {
        await connection.promise().execute((query).trim() + ";")
      } catch (err) {
        console.log({ query, err })
      }
    }
  })

const faker = require("faker")

const classes = []
const names = []
const profs = []
const subjects = ["ENG", "ITA", "LAT", "FIL", "STO"]
const insegnamenti = {}
const surname_class = {}

const executeQuery = async(query) => {
  try {
    query = query.trim().replace(/.$/, ";")
    const res = await connection.promise().execute(query)
    // console.log({ query, res })
  } catch (err) {
    console.log({ err, query })
  }
}

const insertClasses = async(num) => {
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
  await executeQuery(query)
}

const insertStudents = async(num) => {
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

  await executeQuery(query)
}

const insertSubjects = async() => {
  const query = `
    INSERT INTO Materie 
        VALUES
            ("ENG", "Inglese"),
            ("ITA", "Italiano"),
            ("LAT", "Latino"),
            ("FIL", "Filosofia"),
            ("STO", "Storia");`

  await executeQuery(query)
}

const instertProfs = async(num) => {
  let i = 0
  while (i < num) {
    const name = faker.fake("\"{{name.firstName}}\", \"{{name.lastName}}\"")
    if (!profs.includes(name)) {
      profs.push(name)
      i++
    }
  }

  const query = profs.reduce((acc, name) =>
    acc += `(${name}, DEFAULT), `,
  "INSERT INTO Docenti VALUES")

  await executeQuery(query)
}

const instertInsegnamenti = async(num) => {
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
  await executeQuery(query)
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

  console.log(query)
  executeQuery(query)
}

(async() => {
  await insertClasses(5)
  await insertStudents(7)
  await insertSubjects()
  await instertProfs(5)
  await instertInsegnamenti(8)
  await insertGrades(2)
})()