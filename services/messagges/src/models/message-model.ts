import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
  id: String,
  participants: { type: [String], required: true },
  isAGroup: { type: Boolean, default: false },
  groupName: String,
});

const MessageSchema = new Schema({
  sender: String,
  content: { type: String, required: true },
  visualizedFrom: [String],
  timecreated: { type: Date, default: Date.now },
  conversationID: { type: String, required: true },
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

ConversationSchema.pre("save", async function (next) {
  const conversation = this;
  if (conversation.isAGroup && conversation.groupName == null) {
    next(new Error("Group name is required"));
  } else {
    next();
  }
});

const Conversations = model("Conversations", ConversationSchema);
const Messages = model("Messages", MessageSchema);

export { Conversations, Messages };
