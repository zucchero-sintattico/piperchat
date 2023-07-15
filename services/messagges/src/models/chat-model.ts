import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  sender: String,
  content: { type: String, required: true },
  //  visualizedFrom: [String],
  timecreated: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  name: { type: String, required: true },
  participants: { type: [String], required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
});

const ChannelSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  type: { type: String, required: true, default: "text" },
  description: String,
  creator: { type: String, required: true },
  members: { type: [String], required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
});

const ServerSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  description: String,
  creator: { type: String, required: true },
  members: { type: [String], required: true },
  channels: { type: [ChannelSchema] },
});

//auto random and univoque id of conversation
ConversationSchema.pre("save", async function (next) {
  const conversation = this;
  const conversationModel = model("Conversations", ConversationSchema);
  const idLength = 4;
  if (conversation.name == null) {
    var newId = Math.random()
      .toString(36)
      .substring(2, idLength + 2);

    while ((await conversationModel.findOne({ name: newId })) != null) {
      newId = Math.random()
        .toString(36)
        .substring(2, idLength + 2);
      console.log(newId);
    }
    conversation.name = newId;
  }
  next();
});

const Conversations = model("Conversations", ConversationSchema);
const Messages = model("Messages", MessageSchema);
const Channels = model("Channels", ChannelSchema);
const Servers = model("Servers", ServerSchema);

export { Conversations, Messages, Channels, Servers };
