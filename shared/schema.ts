import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["veterinarian", "owner"] }).notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  species: text("species").notNull(),
  breed: text("breed"),
  birthDate: timestamp("birth_date"),
  weight: text("weight"),
  microchip: text("microchip"),
  photo: text("photo"),
  recordNumber: text("record_number").unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const medicalRecords = pgTable("medical_records", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().references(() => pets.id),
  veterinarianId: varchar("veterinarian_id").notNull().references(() => users.id),
  type: text("type", { enum: ["consultation", "vaccination", "deworming", "examination", "certificate", "prescription"] }).notNull(),
  date: timestamp("date").notNull(),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  notes: text("notes"),
  documents: json("documents").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vaccinations = pgTable("vaccinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().references(() => pets.id),
  veterinarianId: varchar("veterinarian_id").notNull().references(() => users.id),
  vaccineName: text("vaccine_name").notNull(),
  laboratory: text("laboratory").notNull(),
  batch: text("batch"),
  expiryDate: timestamp("expiry_date"),
  applicationDate: timestamp("application_date").notNull(),
  pathogens: json("pathogens").$type<string[]>().default([]),
  nextDueDate: timestamp("next_due_date"),
  certificate: text("certificate"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dewormings = pgTable("dewormings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().references(() => pets.id),
  veterinarianId: varchar("veterinarian_id").notNull().references(() => users.id),
  product: text("product").notNull(),
  dose: text("dose"),
  applicationDate: timestamp("application_date").notNull(),
  nextDueDate: timestamp("next_due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const certificates = pgTable("certificates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().references(() => pets.id),
  veterinarianId: varchar("veterinarian_id").notNull().references(() => users.id),
  type: text("type", { enum: ["health", "export", "vaccination"] }).notNull(),
  issuedDate: timestamp("issued_date").notNull(),
  validUntil: timestamp("valid_until"),
  content: json("content"),
  pdfUrl: text("pdf_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  role: true,
  name: true,
});

export const insertPetSchema = createInsertSchema(pets).pick({
  ownerId: true,
  name: true,
  species: true,
  breed: true,
  birthDate: true,
  weight: true,
  microchip: true,
  photo: true,
  recordNumber: true,
});

export const insertMedicalRecordSchema = createInsertSchema(medicalRecords).pick({
  petId: true,
  veterinarianId: true,
  type: true,
  date: true,
  diagnosis: true,
  treatment: true,
  notes: true,
  documents: true,
});

export const insertVaccinationSchema = createInsertSchema(vaccinations).pick({
  petId: true,
  veterinarianId: true,
  vaccineName: true,
  laboratory: true,
  batch: true,
  expiryDate: true,
  applicationDate: true,
  pathogens: true,
  nextDueDate: true,
  certificate: true,
});

export const insertDewormingSchema = createInsertSchema(dewormings).pick({
  petId: true,
  veterinarianId: true,
  product: true,
  dose: true,
  applicationDate: true,
  nextDueDate: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).pick({
  petId: true,
  veterinarianId: true,
  type: true,
  issuedDate: true,
  validUntil: true,
  content: true,
  pdfUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPet = z.infer<typeof insertPetSchema>;
export type Pet = typeof pets.$inferSelect;
export type InsertMedicalRecord = z.infer<typeof insertMedicalRecordSchema>;
export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertVaccination = z.infer<typeof insertVaccinationSchema>;
export type Vaccination = typeof vaccinations.$inferSelect;
export type InsertDeworming = z.infer<typeof insertDewormingSchema>;
export type Deworming = typeof dewormings.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
