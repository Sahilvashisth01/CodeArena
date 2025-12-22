import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  problem: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true,
  },
  host: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    required: true,
  },
  participants: {
    type: mongoose.Schema.Types.ObjectId, // Reference to User model
    ref: "User",
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
  //stream video callId
  callId: {
    type: String,
    default: ""

  }
}, { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
