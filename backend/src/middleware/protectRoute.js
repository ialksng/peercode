import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/stream.js";

export const protectRoute = [
  async (req, res, next) => {
    try {
      const { isAuthenticated, userId: clerkId } = getAuth(req);

      if (!isAuthenticated || !clerkId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      let user = await User.findOne({ clerkId });

      // A user may have signed up before the Clerk-to-Inngest webhook was configured.
      // Provision that account on its first authenticated API request as a fallback.
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);
        const email = clerkUser.primaryEmailAddress?.emailAddress;

        if (!email) {
          return res.status(422).json({ message: "Your Clerk account needs a verified email address" });
        }

        const name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || email.split("@")[0];
        user = await User.findOneAndUpdate(
          { clerkId },
          {
            $setOnInsert: {
              clerkId,
              email,
              name,
              profileImage: clerkUser.imageUrl || "",
            },
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        await upsertStreamUser({
          id: clerkId,
          name: user.name,
          image: user.profileImage,
        });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      return res.status(500).json({ message: "Could not load your PeerCode account" });
    }
  },
];
