import { db } from "@/drizzle/db";
import { DestinationTable } from "@/drizzle/schema";

export async function DELETE(){
   try {
      //delete every entry in the DestinationTable
      const response = await db.delete(DestinationTable);
      return new Response('Successfully deleted all trips', { status: 200 });
   } catch (error) {
      console.error('Error deleting trip:', error);
      return new Response('Failed to delete trip', { status: 500 });
   }
}