// import { Inngest } from "inngest";
// import { connectDB } from "./db.js";
// import User from "../models/User.js";
// import { upsertStreamUser, deleteStreamUser } from "./stream.js";

// export const inngest = new Inngest({ id: "CodeArena" });
// //function to sync user from clerk to our db
// const syncUser = inngest.createFunction(
//   { id: "sync-user" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {
//     await connectDB();

//     const { id, email_addresses, first_name, last_name, image_url } =
//       event.data;

//     const newUser = {
//       clerkId: id,
//       email: email_addresses[0]?.email_address,
//       name: `${first_name || ""} ${last_name || ""}`,
//       profileImage: image_url,
//     };
//     //save user to db
//     await User.create(newUser);

//     //also create user in stream
//     await upsertStreamUser({
//       id: newUser.clerkId.toString(),
//       name: newUser.name,
//       image: newUser.profileImage,
//     });
//   }
// );
// //function to delete user from our db when deleted from clerk
// const deleteUserFromDB = inngest.createFunction(
//   { id: "delete-user" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {
//     await connectDB();

//     const { id } = event.data;
//     await User.deleteOne({ clerkId: id });

//     //also delete user from stream
//     await deleteStreamUser(id.toString());
//   }
// );

// export const functions = [syncUser, deleteUserFromDB];
import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "CodeArena" });

const syncUser = inngest.createFunction(
  { id: "sync-user", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`,
      profileImage: image_url,
    };
    await User.create(newUser);
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUserFromDB];