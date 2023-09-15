import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'

/**
 * JWT Token Info
 * @param username Username of the user
 * @param email Email of the user
 */
type UserJWTInfo = {
  username: string
  email: string
}

type UserInfo = {
  username: string
  email: string
}

/**
 * Augment Express Request
 * @param user User info embedded in the JWT Token
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    interface Request<P = unknown, ResBody = any, ReqBody = any, ReqQuery = qs.ParsedQs> {
      user: UserJWTInfo
    }
  }
}

const ACCESS_TOKEN_SECRET = process.env['ACCESS_TOKEN_SECRET'] || 'access'
const REFRESH_TOKEN_SECRET = process.env['REFRESH_TOKEN_SECRET'] || 'refresh'

/**
 * Generate a JWT Access Token for the user
 * @param user User to generate the token
 * @param expiresIn Expiration time, default 1 day
 * @returns JWT Access Token
 */
export const generateAccessToken = (user: UserInfo, expiresIn: string = '1d') => {
  return jwt.sign(
    { username: user.username, email: user.email } as UserJWTInfo,
    ACCESS_TOKEN_SECRET,
    { expiresIn: expiresIn }
  )
}

/**
 * Generate a JWT Refresh Token for the user
 * @param user User to generate the token
 * @param expiresIn Expiration time, default 1 week
 * @returns JWT Refresh Token
 */
export const generateRefreshToken = (user: UserInfo, expiresIn: string = '1w') => {
  return jwt.sign(
    { username: user.username, email: user.email } as UserJWTInfo,
    REFRESH_TOKEN_SECRET,
    { expiresIn: expiresIn }
  )
}

/**
 * Verify a JWT Access Token
 * @param token JWT Access Token
 * @returns Decoded JWT Access Token
 * @throws Error if the token is invalid
 * @throws Error if the token is expired
 */
export const verifyAccessToken = (token: string): UserJWTInfo => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as UserJWTInfo
}

export const decodeAccessToken = (token: string): UserJWTInfo => {
  return jwt.decode(token) as UserJWTInfo
}

export const isAccessTokenValid = (token: string): boolean => {
  try {
    jwt.verify(token, ACCESS_TOKEN_SECRET)
    return true
  } catch (e) {
    return false
  }
}
/**
 * Verify a JWT Refresh Token
 * @param token JWT Refresh Token
 * @returns Decoded JWT Refresh Token
 * @throws Error if the token is invalid
 * @throws Error if the token is expired
 */
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET)
}

/**
 * Middleware to check if the JWT Access Token is present and valid
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 * @returns 401 if the JWT Access Token is missing
 * @returns 401 if the JWT Access Token is invalid
 * @returns 401 if the JWT Access Token is expired
 */
export const JWTAuthenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies.jwt
  if (!accessToken) {
    res.status(401).json({ message: 'JWT Token Missing - Unauthorized' })
    return
  }
  try {
    req.user = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as UserJWTInfo
    next()
  } catch (e) {
    res.status(401).json({ message: 'JWT Token Invalid - Unauthorized', error: e })
    return
  }
}

/**
 * Middleware to check if the JWT Access Token is present and expired
 * This middleware is used to check if the user can refresh the token
 * @param req Express Request
 * @param res Express Response
 * @param next Express Next Function
 * @returns 401 if the JWT Access Token is missing
 * @returns 400 if the JWT Access Token is valid
 */
export const JWTRefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const accessToken = req.cookies.jwt
  if (!accessToken) {
    res.status(401).json({ message: 'JWT Token Missing - Unauthorized' })
    return
  }
  req.user = jwt.decode(accessToken) as UserJWTInfo
  next()
  return
}
