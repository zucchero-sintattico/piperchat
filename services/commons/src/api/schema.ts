export interface RequestSchema {
  Params: Record<string, string>
  Body: Record<string, string>
}

export const EmptySchema: RequestSchema = {
  Params: {},
  Body: {},
}
