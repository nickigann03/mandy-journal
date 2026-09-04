import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
      
    if (existingUser) {
      // If they just picked a different avatar, we could update it, or just return existing
      if (existingUser.avatar !== args.avatar) {
        await ctx.db.patch(existingUser._id, { avatar: args.avatar });
        return { ...existingUser, avatar: args.avatar };
      }
      return existingUser;
    }
    
    const newUserId = await ctx.db.insert("users", {
      name: args.name,
      avatar: args.avatar,
      joinedAt: Date.now(),
    });
    return { _id: newUserId, name: args.name, avatar: args.avatar };
  },
});
