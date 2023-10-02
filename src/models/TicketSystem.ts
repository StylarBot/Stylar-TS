import { model, Schema } from "mongoose";

export default model('ticketsystem', new Schema({
    Guild: String,
    Channel: String,
    MessageID: String,
    StaffRoleID: String,
}));