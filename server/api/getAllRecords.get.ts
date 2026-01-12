import { MongoClient } from "mongodb";
let config = useRuntimeConfig();
const client = new MongoClient(config.faridatabase);

export default defineEventHandler(async (event) => {
  let database = client.db("fari");
  let collection = database.collection("trips");
  let records = await collection.find({}).toArray();
  let sortedRecords = records.sort((a, b) => {
    return (
      new Date(b.startDateTime).getDate() - new Date(a.startDateTime).getDate()
    );
  });
  return { data: sortedRecords };
});
