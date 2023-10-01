import { model, Schema, Document } from 'mongoose';

interface Autoreaction extends Document {
    Guild: string;
    Channel: string;
    Emojis: string[];
}

export default model<Autoreaction>('autoreaction', new Schema({
    Guild: String,
    Channel: String,
    Emojis: Array,
}));