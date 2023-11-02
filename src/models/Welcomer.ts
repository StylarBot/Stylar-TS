import { model, Schema } from 'mongoose';

export default model('welcomer', new Schema({
    Guild: String,
    Channel: String,
}))