import { model, Schema } from "mongoose";

export default model('moderation', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Punishment: String,
    DateTimeMS: String,
    Moderator: String,
}));