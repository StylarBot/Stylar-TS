import { model, Schema } from "mongoose";

export default model('tempban', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Moderator: String,
    DateGivenMS: String,
    DateExpiresMS: String,
}));