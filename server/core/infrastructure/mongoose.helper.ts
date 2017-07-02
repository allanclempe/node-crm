import * as mongoose from "mongoose";

export function getModel<T extends mongoose.Document>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
    if ((<any> mongoose).connection.models[name] != null) {
        return mongoose.model<T>(name);
    }

    return mongoose.model<T>(name, schema);
}
