import { model, Schema, Document } from 'mongoose';

interface Moderation extends Document {
    Guild: string;
    User: string;
    Reason: string;
    Punishment: string;
    DateTimeMS: string;
    Moderator: string;
}

export default model<Moderation>('moderation', new Schema<Moderation>({
    Guild: String,
    User: String,
    Reason: String,
    Punishment: String,
    DateTimeMS: String,
    Moderator: String,
}));