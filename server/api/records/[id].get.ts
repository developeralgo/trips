import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
let config = useRuntimeConfig();
const client = new MongoClient(config.faridatabase);

export default defineEventHandler(async (event) => {
  let database = client.db("fari");
  let collection = database.collection("trips");
  let id = event.context.params?.id;
  let ID = new ObjectId(id);
  //to get the route path: '/api/foo/bar/baz'
  let record = await collection.findOne({ _id: ID });
  console.log(record);
  if (!record) {
    return { data: null };
  } else {
    return { data: record };
  }
});
