import { boolean, pgEnum, pgTable, text } from 'drizzle-orm/pg-core'
import { createdAt, id, updatedAt } from '../schemaHelpers'
// import { relations } from 'drizzle-orm'

export const priorities = ['LOW', 'MEDIUM', 'HIGH'] as const
export type Priority = (typeof priorities)[number]
export const priorityEnum = pgEnum('priority', priorities)

export const DestinationTable = pgTable('destination', {
   id,
   createdAt,
   updatedAt,
   destinationName: text().notNull(),
   note: text(),
   imageUrl: text().array(),
   currentTrip: boolean().default(false),
   finishedTrip: boolean().default(false),
   upcomingTrip: boolean().default(true),
   priority: priorityEnum().default('LOW'),
})

// export const StickyNotesRelationships = relations(
   // StickyNotesTable,
   // ({ one }) => ({
   //    userNotes: one(UserTable, {
   //       fields: [StickyNotesTable.userId],
   //       references: [UserTable.id],
   //    }),
   // })
// )
