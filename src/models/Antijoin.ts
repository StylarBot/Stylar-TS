import { model, Schema } from 'mongoose';

export default model('antijoin', new Schema({
    Guild: String,
    BotException: Boolean,
    Punishment: String,
}))