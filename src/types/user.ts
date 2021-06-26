export type User = {
  _id: string,
  email: string,
  username: string,
  password: string,
  token?: string
}

export type UserCreate = Exclude<User, "_id">

export type UserUpdate = User & {
  email?: string,
  username?: string
}

export type UserLogin = Pick<User, "username" | "password">
