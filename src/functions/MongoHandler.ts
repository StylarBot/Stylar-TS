import { readdirSync } from "fs";
import mongoose from "mongoose";
import log from "./logger";

export default async function HandleMongo(mongouri) {
    const connection = await mongoose.connect(mongouri);

    if(!connection) {
        throw "An error occured whilst connecting to MongoDB.";
    } else {
        const models = readdirSync(`./src/models`).filter((file) => file.endsWith(".ts"));
        return log(`Connected to MongoDB; ${models.length} models loaded!`, false);
    }
}