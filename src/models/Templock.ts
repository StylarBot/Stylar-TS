import { model, Schema } from 'mongoose';

export default model('templock', new Schema({
    Guild: String,
    Channel: String,
    Duration: String,
    BeginMS: String,
    EndMS: String,
    Moderator: String,
    Role: String,
}))