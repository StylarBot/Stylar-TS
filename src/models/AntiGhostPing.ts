import { model, Schema } from 'mongoose';

export default model('antighostping', new Schema({
    Guild: String,
}))