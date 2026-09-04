import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("items").collect();
  },
});

export const add = mutation({
  args: {
    type: v.string(),
    position: v.object({ x: v.number(), y: v.number() }),
    text: v.optional(v.string()),
    author: v.optional(v.string()),
    shape: v.optional(v.string()),
    color: v.optional(v.string()),
    hasPushpin: v.optional(v.boolean()),
    imageSrc: v.optional(v.string()),
    caption: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("items", args);
  },
});

export const updatePosition = mutation({
  args: {
    id: v.id("items"),
    position: v.object({ x: v.number(), y: v.number() }),
  },
  handler: async (ctx, args) => {
    const { id, position } = args;
    await ctx.db.patch(id, { position });
  },
});

export const updateContent = mutation({
  args: {
    id: v.id("items"),
    text: v.optional(v.string()),
    author: v.optional(v.string()),
    caption: v.optional(v.string()),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, rest);
  },
});

export const remove = mutation({
  args: { id: v.id("items") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
