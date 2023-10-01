import { model, Schema, Document } from 'mongoose';

interface TicketSystem extends Document {
    Guild: string;
    Channel: string;
    MessageID: string;
    StaffRoleID: string;
}

export default model<TicketSystem>('ticketsystem', new Schema({
    Guild: String,
    Channel: String,
    MessageID: String,
    StaffRoleID: String,
}));