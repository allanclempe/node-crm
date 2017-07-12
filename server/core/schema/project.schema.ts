import { Schema } from "mongoose";
import * as idValidator from "mongoose-id-validator";

const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

ProjectSchema.plugin(idValidator);

export { ProjectSchema };
