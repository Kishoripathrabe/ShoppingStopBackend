import * as mongoose from "mongoose";
const UserActivitySchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    data: {
        type: Object
        },
    msg: String,
    date: { type: Date, default: Date.now },
  });

const UserActivity = mongoose.model('userActivity', UserActivitySchema);
export default UserActivity;