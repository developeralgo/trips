import { MongoClient } from "mongodb";
let config = useRuntimeConfig();
const client = new MongoClient(config.faridatabase);

export default defineEventHandler(async (event) => {
  let database = client.db("fari");
  let collection = database.collection("trips");
  let path = event.context.path;
  //to get the route path: '/api/foo/bar/baz'
  console.log(path);
  return { data: path };

  //   let record = await collection.find({})
  //   let sortedRecords = records.sort((a, b) => {
  //     return new Date(a.date).getTime() - new Date(b.date).getTime();
  //   });
  //   return { data: records };
});
