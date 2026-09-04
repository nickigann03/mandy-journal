import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    type: v.string(), // 'note', 'polaroid', 'audio', 'video', 'sticker'
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    creatorName: v.optional(v.string()),
    creatorAvatar: v.optional(v.string()),
    
    // Note specific
    text: v.optional(v.string()),
    author: v.optional(v.string()),
    shape: v.optional(v.string()),
    color: v.optional(v.string()),
    hasPushpin: v.optional(v.boolean()),
    
    // Polaroid & Sticker specific
    imageSrc: v.optional(v.string()), 
    caption: v.optional(v.string()),
    
    // Media specific
    title: v.optional(v.string()),
    
    // Resizable and Frameless support
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    hasFrame: v.optional(v.boolean()),
    // Music specific
    url: v.optional(v.string()),
    // Open When specific
    prompt: v.optional(v.string()),
    isOpen: v.optional(v.boolean()),
  }),
});
