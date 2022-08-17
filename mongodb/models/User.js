import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    password: String,
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
}, {
    timestamps: true
});

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

UserSchema.methods.makeAuthToken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, process.env.TOKEN_SECRET)
        this.tokens = this.tokens.concat({ token: token });
        await this.save();
        return token;
    } catch (err) {
        console.log(err);
    }
}

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);