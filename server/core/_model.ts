import { ObjectId } from "@types/bson";
/*
    jpath ref: http://goessner.net/articles/JsonPath/
    mongoDb projection: https://docs.mongodb.com/manual/reference/operator/projection/positional/
*/

class User {
    id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    projects: Project[];
}

class Project {
    id: ObjectId;
    name: string;
    environments: Environment[];
}

class Environment {
    id: ObjectId;
    name: string; /* production, staging, development */
    api: string;
    secret: string;
}

class Schema {
    id: ObjectId;
    environmentId: ObjectId;
    name: string;
    definition: any;
}

// export class SchemaVersion {
//     id: ObjectId;
//     version: string;
//     schemaDefinition: any;
//     date: Date;
// }

class Form {
    id: ObjectId;
    environmentId: ObjectId;
    schemaId: ObjectId;
    name: string;
    fields: FormField[];
}

class FormField {
    id: ObjectId;
    name: string;
    jpath: string;
    type: string; /* input type = hidden, text, select, radio, checkbox, email, date */
    defaultValue?: string;
    dataSource?: DataSource;
}

class DataSource {
    id: ObjectId;
    name: string;
    environment: ObjectId;
    schemaId: ObjectId;
    fields: string[] | KeyValue; /* use array<jpath> or key:jpath / value:jpath */
}

class KeyValue{
    key: string;
    value: string;
}