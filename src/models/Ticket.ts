import { model, Schema } from "mongoose";

export default model('tickets', new Schema({
    Guild: String,
    User: String,
    Channel: String,
    Contributors: Array,
    Transcript: Array,
    Active: Boolean,
    AllUsers: Array,
}));