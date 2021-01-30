
import jwt, { Secret } from "jsonwebtoken"
const secret: Secret = process.argv.slice(2)[0] === "--secret" ? process.argv.slice(2)[1] : "12jiowfcmqd2093eswedfgtr54eswe3454erdsdc"
const expiresIn = "4h"

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

export {
  signToken,
  refreshToken,
  fillDB
}