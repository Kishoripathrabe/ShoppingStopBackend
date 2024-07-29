import * as mongoose from "mongoose";
import {model} from "mongoose";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    first_name: {type: String, required: true},
    last_name : {type: String, required: true},
    orders: [{ type: mongoose.Types.ObjectId, ref: 'order'}],
    cart: { type: mongoose.Types.ObjectId, ref: 'cart' },
    wishlist: [{ type: mongoose.Types.ObjectId, ref: 'product' }],
    address: [{ type: mongoose.Types.ObjectId, ref: 'add' }],
    type: { type: String, default: "customer" },
    language: { type: String, default: "en" }
})   

const User = mongoose.model('User', userSchema);
export default User;
