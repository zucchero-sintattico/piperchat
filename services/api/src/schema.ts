export interface RequestSchema {
  Params: Record<string, string>
  Body: Record<string, string>
  Query?: Record<string, string>
}

export const EmptySchema: RequestSchema = {
  Params: {},
  Body: {},
  Query: {},
}
