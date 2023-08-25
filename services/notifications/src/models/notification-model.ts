import { ClientProxy } from './client-proxy'

class NotifiableUsers {
  private users: Map<string, ClientProxy>

  constructor() {
    this.users = new Map<string, ClientProxy>()
  }

  public addUser(username: string, clientProxy: ClientProxy): void {
    this.users.set(username, clientProxy)
  }

  public removeUser(username: string): void {
    this.users.delete(username)
  }

  public sendIfPresent(username: string, data: object): void {
    this.users.get(username)?.send(data)
  }
}

export const notifiableUsers = new NotifiableUsers()
