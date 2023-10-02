import { model, Schema } from "mongoose";

export default model('globalannouncements', new Schema({
    Guild: String,
    Channel: String,
}));