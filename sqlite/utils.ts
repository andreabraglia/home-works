
import type { RunResult, Database } from "sqlite3"
import type { Secret } from "jsonwebtoken"
import type { CountObject, LogsRows, RowsType } from "./types"

import jwt from "jsonwebtoken"
const secret: Secret = process.argv.slice(2)[0] === "--secret" ? process.argv.slice(2)[1] : "12jiowfcmqd2093eswedfgtr54eswe3454erdsdc"
const expiresIn = "4h"

import sqlite3 from "sqlite3"
const db = new sqlite3.Database("./db.db3")

const refreshToken: (JWT: string) => string = (JWT: string): string => {
  const { user } = jwt.verify(JWT, secret) as { user: string }
  const token: string = jwt.sign(
    { user },
    secret,
    { algorithm: "HS512", expiresIn }
  )
  return token
}

const signToken = (user: string): string => {
  const token: string = jwt.sign(
    { user },
    secret,
    { algorithm: "HS512", expiresIn }
  )
  return token
}

const fillDB = (): string => {
  let query = "INSERT INTO Users VALUES"
  for (let i = 1; i < 11; i++) {
    query += `("username ${i}", "username ${i}")${i !== 10 ? ",\n" : ";"}`
  }
  return query
}


const errorHandler = (data: RunResult, err: Error): void => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

const parseDate = (date: string): string => date.replace("T", " ").replace("Z", "").replace(/[^.]*$/, "").replace(".", "")

const countIps = (data: LogsRows[]): CountObject =>
  data.reduce((acc: CountObject, { ip, timestamp }: LogsRows): CountObject => {
    acc.ip = acc.ip ? acc.ip : ip
    acc.dates.push(parseDate(timestamp))
    acc.count++
    return acc
  }, {
    ip: "",
    count: 0,
    dates: []
  })

const startDB = (): Database => {
  db.serialize(() => {
    `CREATE TABLE IF NOT EXISTS Users (
      username TEXT NOT NULL,
      password TEXT NOT NULL,
      UNIQUE(username, password)
    );


    CREATE TABLE IF NOT EXISTS Logs (
      ip TEXT NOT NULL,
      timestamp TEXT NOT NULL
    );`
      .split("\n\n")
      .forEach((query: string): void => {
        db.run(query, errorHandler)
      })
  })

  db.all("SELECT * FROM Users", (err: Error, data: RowsType): void => {
    if (!data.length) {
      db.run(fillDB())
    } else {
      return
    }
  })

  return db
}

export {
  signToken,
  refreshToken,
  fillDB,
  errorHandler,
  parseDate,
  countIps,
  startDB
}