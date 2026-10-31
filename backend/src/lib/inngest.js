import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "peercode" });

const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      throw new Error("Clerk user.created event is missing a user ID or email address");
    }

    const userData = {
      clerkId: id,
      email,
      name: [first_name, last_name].filter(Boolean).join(" ") || email.split("@")[0],
      profileImage: image_url || "",
    };

    const newUser = await User.findOneAndUpdate(
      { clerkId: id },
      { $setOnInsert: userData },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

export const functions = [syncUser, deleteUserFromDB];
