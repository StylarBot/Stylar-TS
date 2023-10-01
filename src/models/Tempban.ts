import { model, Schema, Document } from 'mongoose';

interface TempBan extends Document {
    Guild: string;
    User: string;
    Reason: string;
    Moderator: string;
    DateGivenMS: string;
    DateExpiresMS: string;
}

export default model<TempBan>('tempban', new Schema({
    Guild: String,
    User: String,
    Reason: String,
    Moderator: String,
    DateGivenMS: String,
    DateExpiresMS: String,
}));