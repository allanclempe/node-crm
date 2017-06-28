import { Document, model, Schema } from "mongoose";

export interface IPerson {
    firstName: string;
    lastName: string;
}

export interface IPersonModel extends IPerson, Document {
}

export const PersonSchema = new Schema({
    firstName: {
        required: true,
        type: String
    },
    lastName: String
    // email: DataType.email,
    // adresses: {
    //     street: {
    //         required: true,
    //         type: DataType.string,
    //     },
    //     number: {
    //         required: true,
    //         type: DataType.string
    //     },
    //     city: DataType.string,
    //     state: DataType.objectId,
    //     country: {
    //         required: true,
    //         type: DataType.objectId,
    //     },
    // },
    // phones : {
    //     number: DataType.string,
    //     type: DataType.int
    // }
});

const Person = model<IPersonModel>("Person", PersonSchema, "persons");

export default Person;
