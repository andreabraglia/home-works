import type { Request } from "express"

export interface LoginRequest extends Request {
  body: {
    user: string
    password: string
  }
}

export type RowsType = {
  username: string
  password: string
}[]

export interface RefreshTokenRequest extends Request {
  body: {
    jwt: string
  }
}