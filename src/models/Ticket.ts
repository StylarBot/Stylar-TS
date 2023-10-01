import { model, Schema, Document } from 'mongoose';

interface Ticket extends Document {
    Guild: string;
    User: string;
    Channel: string;
    Contributors: string[];
    Transcript: string[];
    Active: boolean;
    AllUsers: string[];
}

export default model<Ticket>('tickets', new Schema<Ticket>({
    Guild: String,
    User: String,
    Channel: String,
    Contributors: Array,
    Transcript: Array,
    Active: Boolean,
    AllUsers: Array,
}));