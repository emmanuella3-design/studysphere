import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"
export default defineSchema({
 ...authTables,
 profiles: defineTable({userId:v.string(),name:v.string(),country:v.optional(v.string()),educationLevel:v.optional(v.string()),school:v.optional(v.string()),subjects:v.array(v.string()),preferredLanguage:v.optional(v.string()),timeZone:v.optional(v.string()),goal:v.optional(v.string()),upcomingExams:v.array(v.string()),preferredStudyTimes:v.array(v.string()),onboardingComplete:v.boolean()}).index("by_user",["userId"]),
 studyPlans: defineTable({userId:v.string(),title:v.string(),date:v.string(),duration:v.number(),status:v.union(v.literal("planned"),v.literal("done"))}).index("by_user_date",["userId","date"]),
 assignments: defineTable({userId:v.string(),title:v.string(),course:v.string(),dueDate:v.string(),priority:v.union(v.literal("low"),v.literal("medium"),v.literal("high")),status:v.union(v.literal("todo"),v.literal("doing"),v.literal("done"))}).index("by_user",["userId"]),
 resources: defineTable({userId:v.string(),name:v.string(),type:v.string(),text:v.optional(v.string()),fileId:v.optional(v.string()),createdAt:v.number()}).index("by_user",["userId"]),
 progress: defineTable({userId:v.string(),subject:v.string(),minutes:v.number(),mastery:v.number(),updatedAt:v.number()}).index("by_user",["userId"]),
 groups: defineTable({ownerId:v.string(),name:v.string(),subject:v.string(),description:v.string(),members:v.array(v.string())}).index("by_owner",["ownerId"]),
 scholarships: defineTable({userId:v.string(),title:v.string(),provider:v.string(),deadline:v.string(),status:v.union(v.literal("saved"),v.literal("applied"))}).index("by_user",["userId"]),
 courses: defineTable({userId:v.string(),name:v.string(),discipline:v.string(),provider:v.string(),mode:v.string(),duration:v.string(),reason:v.optional(v.string()),addedAt:v.number()}).index("by_user",["userId"]),
})