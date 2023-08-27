export interface RequestSchema {
  Params: Record<string, string>
  Body: Record<string, string>
}

export class EmptySchema implements RequestSchema {
  Params = {}
  Body = {}
}
