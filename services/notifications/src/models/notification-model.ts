import { Schema, model } from 'mongoose'

const NotificationSchema = new Schema({
  from: String,
  to: {
    type: String,
    required: true,
  },
  messageId: {
    type: String,
    required: true,
  },
  notitificationType: {
    type: String,
    required: true,
  },
})

const NotificationEntity = model('Entity', NotificationSchema)

export { NotificationEntity }
