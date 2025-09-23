import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

/**
 * Define database tables and schemas.
 */
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  frequency: varchar('frequency', { length: 20 }).notNull(),
  targetCount: integer('target_count').default(1),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const entries = pgTable('entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  completion_date: timestamp('completion_date').defaultNow().notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  color: varchar('color', { length: 7 }).default('#6B7280'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Junction table for many-to-many relationship
export const habitTags = pgTable('habit_tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  habitId: uuid('habit_id')
    .references(() => habits.id, { onDelete: 'cascade' })
    .notNull(),
  tagId: uuid('tag_id')
    .references(() => tags.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

/**
 * Definite relationships between database tables.
 */
// Users can have many habits.
export const userRelations = relations(users, ({ many }) => ({
  habits: many(habits),
}))

export const habitsRelations = relations(habits, ({ one, many }) => ({
  user: one(users, {
    fields: [habits.userId],
    references: [users.id],
  }),
  entries: many(entries),
  habitTags: many(habitTags),
}))

// Entries belong to one habit.
export const entriesRelations = relations(entries, ({ one }) => ({
  habit: one(habits, {
    fields: [entries.habitId],
    references: [habits.id],
  }),
}))

// Tags can be on many habits.
export const tagsRelations = relations(tags, ({ many }) => ({
  habitTags: many(habitTags),
}))

// Junction table relations.
export const habitTagsRelations = relations(habitTags, ({ one }) => ({
  habit: one(habits, {
    fields: [habitTags.habitId],
    references: [habits.id],
  }),
  tag: one(tags, {
    fields: [habitTags.tagId],
    references: [tags.id],
  }),
}))

// Define type that is inferred from a database schema definition (i.e. Users table)
// Note: Type safety.
export type User = typeof users.$inferInsert // Note: This is a compile-time TypeScript type. It only exists during development and disappears when compiled to JavaScript.
export type Habit = typeof habits.$inferInsert
export type Entry = typeof entries.$inferInsert
export type Tag = typeof tags.$inferInsert
export type HabitTag = typeof habitTags.$inferInsert

// Note: Runtime safety (validation.)
export const insertUserSchema = createInsertSchema(users) // Validates data before database inserts.
export const selectUserSchema = createSelectSchema(users) // Validates data coming back from database reads.
