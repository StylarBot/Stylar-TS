import mongoose, { Connection } from 'mongoose';
import fs from 'fs';
import log from './logger';

export default async function handleMongo(connectionuri: string){
    const models: number = fs.readdirSync(`./src/models`).filter((file: string) => file.endsWith(".js")).length;

    const connection = await mongoose.connect(connectionuri);

    if(connection) {
        return log(`MongoDB Loaded.`, false);
    } else {
        return log(`An error occured whilst connecting to MongoDB.`, false);
    }
}