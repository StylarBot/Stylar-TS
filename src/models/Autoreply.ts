import { model, Schema } from "mongoose";

export default model('autoreply', new Schema({
    Guild: String,
    Phrase: String,
    Reply: String,
}));