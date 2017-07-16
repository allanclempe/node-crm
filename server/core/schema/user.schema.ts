import { Schema } from "mongoose";
import * as idValidator from "mongoose-id-validator";

const UserSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String,
    },
    email: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    permissions: {
        environmentIds: {
            type: [Schema.Types.ObjectId],
            ref: "Environment"
        },
        god: Boolean,
    },
});

UserSchema.plugin(idValidator);

export { UserSchema };
