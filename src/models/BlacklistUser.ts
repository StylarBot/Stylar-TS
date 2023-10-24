import { model, Schema } from 'mongoose';

export default model('blacklistuser', new Schema({
    Guild: String,
    Users: Array,
}))