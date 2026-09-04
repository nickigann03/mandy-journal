import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  items: defineTable({
    type: v.string(), // 'note', 'polaroid', 'audio', 'video', 'sticker'
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    
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
  }),
});
