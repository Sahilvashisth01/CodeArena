import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        //use clerk id for stream not mongodb id => it should match th id w have in the stream dashboard
        const token=chatClient.createToken(req.user.clerkId);
        res.status(200).json({ 
        token,
        userId:req.user.clerkId,
        userName:req.user.name,
        userImage:req.user.image
        });
    } catch (error) {
        console.error("Error creating Stream token:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
}