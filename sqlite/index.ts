/* eslint-disable no-console */
import express from "express"
import {
  signToken,
  refreshToken,
  errorHandler,
  countIps,
  startDB
} from "./utils"

import { join } from "path"

import type { LoginRequest, RowsType, RefreshTokenRequest, LogsRows } from "./types"
import type { Response, Request } from "express"

const app = express()
const PORT: number | string = process.argv.slice(2)[0] === "--port" ? process.argv.slice(2)[1] : 8080
const db = startDB()


app.use(express.json())
app.use(express.static(join(__dirname, "public")))

app.post("/login", ({ body: { user, password } }: LoginRequest, res: Response) => {
  if (user && password) {
    db.all("SELECT * FROM Users WHERE username = ? AND password = ?", user, password, (err: Error, rows: RowsType) => {
      if (err) {
        console.error("Login failed", err)
        res.status(500).send(err.message)

      } else if (rows.length) {
        console.log("Login succeeded", { rows })
        res.status(200).send({ ok: true, jwt: signToken(user) })

      } else {
        console.log("Login failed", { rows })
        res.status(401).send({ ok: false })
      }
    })

  } else {
    console.log("Login failed")
    res.status(401).send({ ok: false })
  }
})

app.post("/refreshToken", ({ body: { jwt } }: RefreshTokenRequest, res: Response) => {
  try {
    const newToken = refreshToken(jwt)
    res.send({ jwt: newToken })
  } catch (err) {
    res.status(400).send(err.message)
  }
})

app.get("/", (req: express.Request, res: express.Response) => {
  res.sendFile(join(__dirname, "index.html"))
})

app.get("/ip-info", (req: Request, res: Response) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip
  console.log(ip)
  db.run("INSERT INTO Logs VALUES(?, ?)", [ip, new Date().toISOString()], errorHandler)

  db.all("SELECT * FROM Logs WHERE ip = ?", ip, (err: Error, data: LogsRows[]) => {
    if (err) {
      res.status(500).send(err.stack)
    } else {
      console.log(data)
      res.send(countIps(data))
    }
  })
})

app.get("*", (req: express.Request, res: express.Response) => res.sendFile(join(__dirname, "index.html")))

app.listen(PORT, (): void => {
  // eslint-disable-next-line no-console
  console.log(`⚡️ [server]: Server is running at https://localhost:${PORT}/`)
})