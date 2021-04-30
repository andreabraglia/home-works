/* eslint-disable no-console */
const mysql = require("mysql2/promise")
const e = module.exports

let connection

e.createConnection = async([path, name, ...argv]) => {
  const {
    user = "root",
    host = "localhost",
    password,
    database = "Test"
  } = argv.reduce((acc, e, i) => {
    if (e[0] === "-") {
      e = e.replace(/-/g, "")
      acc[e] = ""
    } else {
      acc[argv[i - 1].replace(/-/g, "").toLowerCase()] = e
    }
    return acc
  }, { path, name })

  connection = await mysql.createConnection({
    host,
    user,
    password,
    database
  })
}

e.createTables = () => {
  `  CREATE TABLE IF NOT EXISTS Classi (
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
          await connection.execute((query).trim() + ";")
        } catch (err) {
          console.log({ query, err })
        }
      }
    })
  console.log("Table created!! \n")
}

const executeQuery = e.executeQuery = async(query, debug = false) => {
  try {
    query = query.trim().replace(/.$/, ";")
    const res = await connection.execute(query)
    console.assert(debug, { res, query })
    console.log({ query, executed: true })
  } catch (err) {
    console.log({ err, query })
  }
}

e.truncateTables = () => {
  `
  drop table Classi cascade;
  drop table Docenti cascade;
  drop table Insegnamenti cascade;
  drop table Materie cascade;
  drop table Valutazioni cascade;
  drop table Studenti cascade;`
    .split(";")
    .forEach(async query => {
      try {
        if (query) {
          await connection.execute(query)
        }
      } catch (e) {
        console.log(e.sqlMessage, query)
        process.exit(1)
      }
    })
  console.log("Table dropped!! \n")
}