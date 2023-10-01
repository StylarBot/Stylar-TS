import { model, Schema, Document } from 'mongoose';

interface GlobalAnnouncement extends Document {
    Guild: string;
    Channel: string;
}

export default model<GlobalAnnouncement>('globalannouncements', new Schema({
    Guild: String,
    Channel: String,
}));