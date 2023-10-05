import { model, Schema } from "mongoose";

export default model('autorole', new Schema({
    Guild: String,
    Roles: Array,
}))