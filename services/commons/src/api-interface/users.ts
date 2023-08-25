export interface User {
  username: string
}

export interface Messages {
  message: string
}

export interface Ok extends Messages {
  message: string
  createdUser: User
}

export interface Error extends Messages {
  message: string
}
