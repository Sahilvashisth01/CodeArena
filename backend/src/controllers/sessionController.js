import { chatClient, streamClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    //extract data from request body
    const { problem, difficulty } = req.body;
    const userId = req.user._id;
    const clerkUserId = req.user.clerkId;
    //validate input
    if (!problem || !difficulty) {
      return res
        .status(400)
        .json({ msg: "Problem and difficulty are required" });
    }
    //generate a unique callId for stream video call
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    //create session in db
    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    //create stream video call
   await streamClient.video.call("default", callId).getOrCreate({
  data: {
    created_by: {
      id: clerkUserId, // ✅ MUST be an object
    },
    custom: {
      problem,
      difficulty,
      sessionId: session._id.toString(),
    },
  },
});

    //chat messaging
    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} Session`,
      created_by_id: clerkUserId,
      members: [clerkUserId],
    });
    //create the channel
    await channel.create();
    res.status(201).json({ session });
  } catch (err) {
    console.error("Error in  createSession controller:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getActiveSessions(_, res) {
  //no need of req here
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .sort({ createdAt: -1 }) //sort by latest created
      .limit(20); //latest 20 sessions

    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error in getActiveSessions controller:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getMyRecentSessions(req, res) {
  try {
    //get sessions where user is host or participant and status is completed
    const userId = req.user._id;
    //fetch sessions from db
    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participants: userId }], //host or participant
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (err) {
    console.error("Error in getMyRecentSessions controller:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function getSessionById(req, res) {
  //fetch session details by id
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      //populate host and participants details
      .populate("host", "name profileImage email clerkId")
      .populate("participants", "name profileImage email clerkId");

    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }

    res.status(200).json({ session });
  } catch (err) {
    console.error("Error in getSessionById controller:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function joinSession(req, res) {
  try {
    //extract session id from params
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    //find session by id
    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ msg: "Session not found" });
    }
    //check if session is already full - has a participant
    if (session.participants)
      return res.status(400).json({ msg: "Session is already full" });

    //add user to participants
    session.participants = userId;
    await session.save();
    //add user to stream chat channel
    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (err) {
    console.error("Error in joinSession controller:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
}

export async function endSession(req, res) {
    //only host can end the session
    try {
      const { id } = req.params;//session id
      const userId = req.user._id;
  
      //find session by id
      const session = await Session.findById(id);
      if (!session) {
        return res.status(404).json({ msg: "Session not found" });
      }
      //check if requester is host
      if (session.host.toString() !== userId.toString()) {
        return res.status(403).json({ msg: "Only host can end the session" });
      }
      //check if session is already completed
        if (session.status === "completed") {
            return res.status(400).json({ msg: "Session is already completed" });
        }

      //update session status to completed
      session.status = "completed";
      await session.save();

      //delete stream video call
      const call = streamClient.video.call("default", session.callId);
      await call.delete({hard: true});

      //delete stream chat channel
      const channel = chatClient.channel("messaging", session.callId);
      await channel.delete();
  
      res.status(200).json({ session, msg: "Session ended successfully" });
    } catch (err) {
      console.error("Error in endSession controller:", err);
      res.status(500).json({ msg: "Internal server error" });
    }
}
