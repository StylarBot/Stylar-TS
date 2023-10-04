import { model, Schema } from "mongoose";

export default model('autoreact', new Schema({
    Guild: String,
    Channel: String,
    Emojis: Array,
}));