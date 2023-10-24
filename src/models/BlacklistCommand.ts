import { model, Schema } from "mongoose";

export default model('blacklistcmd', new Schema({
    Guild: String,
    Commands: Array,
}))