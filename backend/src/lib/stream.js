import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Stream_API_key OR Stream_API_SECRET is missing ");
}
export const chatClient = StreamChat.getInstance(apiKey, apiSecret);
//function to create or update user in stream
export const upsertStreamUser = async (userData) => {
  try {
    await chatClient.upsertUser(userData);
    console.log(`Stream user upserted successfully.`);
  } catch (err) {
    console.error("Error upserting Stream user:", err);
  }
};
//function to delete user from stream
export const deleteStreamUser = async (userId) => {
  try {
    await chatClient.deleteUser(userId);
    console.log(`Stream user  deleted successfully.`);
  } catch (err) {
    console.error("Error deleting Stream user:", err);
  }
};

//todo:add another method to generate token 
