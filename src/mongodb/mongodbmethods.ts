import { Collection } from "mongodb";
import { TradeInfo } from "../typings";
import { DB_NAME, DB_COLLECTION, mongoClient } from "../configs/config"

// Connect to the MongoDB database
async function connectToDatabase(): Promise<Collection<TradeInfo> | undefined> {
  try {
    // Connect to MongoDB
    await mongoClient.connect();
    console.log('Connected to MongoDB');

    // Select the database and collection
    const db = mongoClient.db(DB_NAME);
    const collection: Collection<TradeInfo> = db.collection(DB_COLLECTION);

    // Return the collection
    return collection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return
  }
}
  
async function loadAllAlerts(): Promise<TradeInfo[] | void> {
  const collection = await connectToDatabase();

  if (!collection) {
    console.error("Could not access collection");
    return;
  }

  try {
    // Retrieve all documents from the collection
    const alerts: TradeInfo[] = await collection.find({}).toArray();
    console.log('All alerts:', alerts);

    // Return the array of alerts
    return alerts;
  } catch (error) {
    console.error('Error loading alerts:', error);
  } finally {
    await mongoClient.close();
  }
}
  
  
export async function saveAlertData(alertData: TradeInfo): Promise<void> {
  const collection = await connectToDatabase();

  if (!collection) {
    console.error("Could not access collection");
    return;
  }

  try {
    // Insert alert data into MongoDB
    const result = await collection.insertOne(alertData);
    console.log(`New alert inserted with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Error inserting alert data:', error);
  } finally {
    await mongoClient.close();
  }
}