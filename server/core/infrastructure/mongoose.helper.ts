import * as mongoose from "mongoose";

export function cleanupModel(name: string) {
    delete (<any> mongoose).connection.models[name];
}