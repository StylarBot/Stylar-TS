import { model, Schema } from "mongoose";

export default model('raidprot', new Schema({
    Guild: String,
    Enabled: Boolean,
}));