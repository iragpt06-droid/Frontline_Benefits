import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Questionnaire Response Schema
export const questionnaireResponses = pgTable("questionnaire_responses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  age: integer("age"),
  serviceYears: integer("service_years"),
  location: text("location"),
  zipCode: text("zip_code"),
  needs: text("needs").array(),
  branchOfService: text("branch_of_service"),
});

export const insertQuestionnaireSchema = createInsertSchema(questionnaireResponses).omit({
  id: true,
});

export type InsertQuestionnaire = z.infer<typeof insertQuestionnaireSchema>;
export type QuestionnaireResponse = typeof questionnaireResponses.$inferSelect;

// Resource Schema
export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // healthcare, housing, employment, mental-health, education
  organization: text("organization").notNull(),
  phone: text("phone"),
  email: text("email"),
  website: text("website"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  eligibility: text("eligibility").array(),
  tags: text("tags").array(),
  isNational: boolean("is_national").default(false),
  isCrisis: boolean("is_crisis").default(false),
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

// Category type for filtering
export const CATEGORIES = [
  "healthcare",
  "housing", 
  "employment",
  "mental-health",
  "education",
  "crisis",
] as const;

export type Category = typeof CATEGORIES[number];

// Need type for questionnaire
export const NEEDS = [
  "healthcare",
  "housing",
  "employment",
  "mental-health",
  "education",
  "legal-assistance",
  "financial-assistance",
  "family-support",
] as const;

export type Need = typeof NEEDS[number];

// Branch of service
export const BRANCHES = [
  "Army",
  "Navy",
  "Air Force",
  "Marine Corps",
  "Coast Guard",
  "Space Force",
  "National Guard",
  "Reserves",
] as const;

export type Branch = typeof BRANCHES[number];
