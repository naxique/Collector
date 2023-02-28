export interface User {
  _id: string,
  username: string,
  description: string,
  collections: string[],
  email: string,
  isAdmin: boolean,
  token: string
}