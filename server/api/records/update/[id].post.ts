import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
let config = useRuntimeConfig();
const client = new MongoClient(config.faridatabase);

export default defineEventHandler(async (event) => {
  let database = client.db("fari");
  let collection = database.collection("trips");
  let body = await readBody(event);
  let id = event.context.params?.id;
  let ID = new ObjectId(id);

  //to get the route path: '/api/foo/bar/baz'
  let result = await collection.findOneAndUpdate(
    { _id: ID },
    {
      $set: {
        endKm: body.endKm,
        endTime: body.endTime,
        duration: body.duration,
        distance: body.distance,
        earnings: body.earnings,
      },
    }
  );
  console.log(result);
  return { data: result };

  //   let record = await collection.find({})
  //   let sortedRecords = records.sort((a, b) => {
  //     return new Date(a.date).getTime() - new Date(b.date).getTime();
  //   });
  //   return { data: records };
});
