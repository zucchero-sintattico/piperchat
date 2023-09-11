export class NewMessage {
  type = 'new-message' as const
  from: string
  content: string
  constructor(data: { from: string; content: string }) {
    this.from = data.from
    this.content = data.content
  }
}
