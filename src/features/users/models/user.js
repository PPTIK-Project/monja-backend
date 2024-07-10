const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema(
    {
        NAME: {
            type: String,
            required: true,
        },
        EMAIL: {
            type: String,
            unique: [true, 'Email already exists'],
            required: true,
            validate: {
                validator: function (v) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: '{VALUE} is not a valid email!'
            }
        },
        PASSWORD: {
            type: String,
            required: true,
            validate: {
                validator: function (v){
                    // only Minimum eight characters
                    return /^.{8,}$/.test(v);
                },
                message: 'password at least 8 character!'
            }
        },
        COMPANY: {
            type: String,
            required: true,
        },
        GUID: {
            type: String,
            required: true,
        },
        ROLE: {
            type: String,
            required: true,
        },
        TIMESTAMP: {
            type: Date,
            default: Date.now
        },
        verified: {
            type: Boolean,
            required: true,
            default: false
        }

    },
    {
        collection: 'admins',
    }
);

adminSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.PASSWORD;
    return user;
}

module.exports = mongoose.model('Admin', adminSchema);
