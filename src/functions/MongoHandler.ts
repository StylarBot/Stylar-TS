import mongoose from "mongoose";

export default async function HandleMongo(mongouri) {
    const connection = await mongoose.connect(mongouri);

    if(!connection) {
        throw "An error occured whilst connecting to MongoDB.";
    } else {
        console.log('Connected to MongoDB!');
    }
}