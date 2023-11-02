import { model, Schema } from 'mongoose';

export default model('vouch', new Schema({
    Guild: String,
    User: String,
    UserGiven: String,
    Reason: String,
}))