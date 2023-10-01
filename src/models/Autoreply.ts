import { model, Schema, Document } from 'mongoose';

interface Autoreply extends Document {
    Guild: string;
    Phrase: string;
    Reply: string;
}

export default model<Autoreply>('autoreply', new Schema({
    Guild: String,
    Phrase: String,
    Reply: String,
}));