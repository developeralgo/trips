import { MongoClient } from "mongodb";
let config = useRuntimeConfig();

const clientPromises = new Map<string, Promise<MongoClient>>(); // Store promises by connection string

async function connectToMongo(connection_string: string) {
  if (!clientPromises.has(connection_string)) {
    clientPromises.set(
      connection_string,
      new Promise(async (resolve, reject) => {
        const client = new MongoClient(connection_string);
        try {
          await client.connect();
          resolve(client);
        } catch (error) {
          console.error("Error connecting to MongoDB:", error);
          reject(error);
          clientPromises.delete(connection_string); // Remove the failed promise
        }
      })
    );
  }
  return clientPromises.get(connection_string);
}

export async function get_MongoDatabase() {
  const client = await connectToMongo(config.faridatabase);
  return client;
}
