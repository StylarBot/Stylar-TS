console.clear();
require("dotenv").config();
import { ExtendedClient } from "./structures/Client";
import HandleMongo from './functions/MongoHandler';

export const client = new ExtendedClient();
HandleMongo(process.env.Mongo);

client.start();