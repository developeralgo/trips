import { MongoClient } from "mongodb";
let config = useRuntimeConfig();
const client = new MongoClient(config.faridatabase);
let database = client.db("fari");
let collection = database.collection("trips");

export default defineEventHandler(async (event) => {
  let body = await readBody(event);
  console.log(body);
  let record = await collection.insertOne(body);
  console.log(record);
  return { data: record };
});
