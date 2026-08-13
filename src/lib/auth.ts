import jwt from 'jsonwebtoken'
import { parse, serialize } from 'cookie'

const SECRET = process.env.AUTH_SECRET || 'fallback_secret_do_not_use_in_prod'

export function signToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '1d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET)
  } catch (error) {
    return null
  }
}

export function getCookieHeader(name: string, value: string, maxAge: number = 86400) {
  return serialize(name, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}
