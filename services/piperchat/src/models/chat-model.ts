import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
  sender: String,
  content: { type: String, required: true },
  //  visualizedFrom: [String],
  timecreated: { type: Date, default: Date.now },
});

// Conversation is a direct chat between TWO users
const ConversationSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  participants: { type: [String], required: true, unique: true },
  messages: { type: [MessageSchema], required: true, default: [] },
});

// Channel is a chat between MULTIPLE users, it can be textual or vocal/audio
const ChannelSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  type: { type: String, required: true, default: "text" },
  description: String,
  creator: { type: String, required: true },
  messages: { type: [MessageSchema], required: true, default: [] },
});

const ServerSchema = new Schema({
  id: String,
  name: { type: String, required: true, unique: true },
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
  if (conversation.id == null) {
    var newId = Math.random()
      .toString(36)
      .substring(2, idLength + 2);

    while ((await conversationModel.findOne({ id: newId })) != null) {
      newId = Math.random()
        .toString(36)
        .substring(2, idLength + 2);
      console.log(newId);
    }
    conversation.id = newId;
  }
  next();
});

//auto random and univoque id of channel
ChannelSchema.pre("save", async function (next) {
  const channel = this;
  const channelModel = model("Channels", ChannelSchema);
  const idLength = 4;
  if (channel.id == null) {
    var newId = Math.random()
      .toString(36)
      .substring(2, idLength + 2);

    while ((await channelModel.findOne({ id: newId })) != null) {
      newId = Math.random()
        .toString(36)
        .substring(2, idLength + 2);
      console.log(newId);
    }
    channel.id = newId;
  }
  next();
});

//auto random and univoque id of server
ServerSchema.pre("save", async function (next) {
  const server = this;
  const serverModel = model("Servers", ServerSchema);
  const idLength = 4;
  if (server.id == null) {
    var newId = Math.random()
      .toString(36)
      .substring(2, idLength + 2);
    while ((await serverModel.findOne({ id: newId })) != null) {
      newId = Math.random()
        .toString(36)
        .substring(2, idLength + 2);
      console.log(newId);
    }
    server.id = newId;
  }
  next();
});

const Conversations = model("Conversations", ConversationSchema);
const Messages = model("Messages", MessageSchema);
const Channels = model("Channels", ChannelSchema);
const Servers = model("Servers", ServerSchema);

export { Conversations, Messages, Channels, Servers };
