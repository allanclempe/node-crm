import { Schema } from "mongoose";
import * as idValidator from "mongoose-id-validator";

const ProjectSchema = new Schema({
    name: {
        required: true,
        type: String,
    },
    user: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    environments: [{
        type: Schema.Types.ObjectId,
        ref: "Environment",
    }]
});

// do not turn on the plugins.
// ProjectSchema.plugin(idValidator);

export { ProjectSchema };
