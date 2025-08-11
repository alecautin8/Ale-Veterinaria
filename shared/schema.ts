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
  rut: text("rut").unique(), // Chilean RUT for owners
  phone: text("phone"),
  address: text("address"),
  commune: text("commune"), // Chilean commune
  emergencyContact: text("emergency_contact"),
  emergencyPhone: text("emergency_phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pets = pgTable("pets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ownerId: varchar("owner_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  species: text("species", { enum: ["Canino", "Felino", "Ave", "Conejo", "Otro"] }).notNull(),
  breed: text("breed"),
  sex: text("sex", { enum: ["Macho", "Hembra"] }),
  birthDate: timestamp("birth_date"),
  weight: text("weight"),
  color: text("color"),
  microchip: text("microchip"),
  photo: text("photo"),
  recordNumber: text("record_number").unique(),
  sterilized: boolean("sterilized").default(false),
  sterilizationDate: timestamp("sterilization_date"),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  currentMedications: text("current_medications"),
  diet: text("diet"),
  activityLevel: text("activity_level"),
  anamnesis: text("anamnesis"), // Remote anamnesis
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
  // Detailed consultation fields
  chiefComplaint: text("chief_complaint"),
  symptoms: text("symptoms"),
  symptomDuration: text("symptom_duration"),
  recentChanges: text("recent_changes"),
  currentMedications: text("current_medications"),
  allergies: text("allergies"),
  eliminationHabits: text("elimination_habits"),
  currentDiet: text("current_diet"),
  activityLevel: text("activity_level"),
  environment: text("environment"),
  // Physical examination
  temperature: text("temperature"),
  heartRate: text("heart_rate"),
  respiratoryRate: text("respiratory_rate"),
  capillaryRefillTime: text("capillary_refill_time"),
  physicalFindings: text("physical_findings"),
  // Diagnosis and plan
  presumptiveDiagnosis: text("presumptive_diagnosis"),
  differentialDiagnosis: text("differential_diagnosis"),
  diagnosticPlan: text("diagnostic_plan"),
  therapeuticPlan: text("therapeutic_plan"),
  followUp: text("follow_up"),
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

// New table for detailed examination orders and results
export const examinations = pgTable("examinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  petId: varchar("pet_id").notNull().references(() => pets.id),
  veterinarianId: varchar("veterinarian_id").notNull().references(() => users.id),
  type: text("type", { enum: ["order", "result"] }).notNull(),
  examType: text("exam_type", { 
    enum: ["hemograma", "bioquimica", "orina", "coprologico", "radiografia", "ecografia", "cultivo", "citologia", "histopatologia", "otros"] 
  }).notNull(),
  date: timestamp("date").notNull(),
  urgency: text("urgency", { enum: ["normal", "urgente", "emergencia"] }).default("normal"),
  fastingRequired: boolean("fasting_required").default(false),
  instructions: text("instructions"),
  observations: text("observations"),
  results: text("results"),
  interpretation: text("interpretation"),
  recommendations: text("recommendations"),
  fileUrl: text("file_url"),
  fileName: text("file_name"),
  laboratoryName: text("laboratory_name"),
  referenceValues: json("reference_values"),
  status: text("status", { enum: ["pendiente", "en_proceso", "completado", "cancelado"] }).default("pendiente"),
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
  rut: true,
  phone: true,
  address: true,
  commune: true,
  emergencyContact: true,
  emergencyPhone: true,
});

export const insertPetSchema = createInsertSchema(pets).pick({
  ownerId: true,
  name: true,
  species: true,
  breed: true,
  sex: true,
  birthDate: true,
  weight: true,
  color: true,
  microchip: true,
  photo: true,
  recordNumber: true,
  sterilized: true,
  sterilizationDate: true,
  allergies: true,
  chronicConditions: true,
  currentMedications: true,
  diet: true,
  activityLevel: true,
  anamnesis: true,
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
  chiefComplaint: true,
  symptoms: true,
  symptomDuration: true,
  recentChanges: true,
  currentMedications: true,
  allergies: true,
  eliminationHabits: true,
  currentDiet: true,
  activityLevel: true,
  environment: true,
  temperature: true,
  heartRate: true,
  respiratoryRate: true,
  capillaryRefillTime: true,
  physicalFindings: true,
  presumptiveDiagnosis: true,
  differentialDiagnosis: true,
  diagnosticPlan: true,
  therapeuticPlan: true,
  followUp: true,
});

export const insertExaminationSchema = createInsertSchema(examinations).pick({
  petId: true,
  veterinarianId: true,
  type: true,
  examType: true,
  date: true,
  urgency: true,
  fastingRequired: true,
  instructions: true,
  observations: true,
  results: true,
  interpretation: true,
  recommendations: true,
  fileUrl: true,
  fileName: true,
  laboratoryName: true,
  referenceValues: true,
  status: true,
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
export type InsertExamination = z.infer<typeof insertExaminationSchema>;
export type Examination = typeof examinations.$inferSelect;
