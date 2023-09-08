export interface EventMessage {
  exchange: string
  routingKey: string
  data: object
}
