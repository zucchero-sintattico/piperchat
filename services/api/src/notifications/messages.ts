export class NewMessage {
  type = 'new-message' as const
  data: {
    from: string
    content: string
  }
  constructor(from: string, content: string) {
    this.data = {
      from,
      content,
    }
  }
}
