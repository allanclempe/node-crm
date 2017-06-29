import * as mongoose from "mongoose";
import Schema, { ISchemaModel } from "./schema";

export class EntityModel {
    private models: {[name: string]: mongoose.Model<mongoose.Document>};
    private loaded: boolean;
    constructor() {
        this.models = {};
        this.loaded = false;
    }

    public async bootloader(modelInMemory: boolean) {
        if (!this.loaded && modelInMemory) {
            await this.loadAll();
        }
    }

    public async loadAll() {
        await Schema.find({}, (err: any, dataDefs: ISchemaModel[]) => {
            // tslint:disable-next-line:forin
            for (let item in dataDefs) {
                this.load(dataDefs[item]);
            }
            this.loaded = true;
        });
    }

    public async loadOne(name: string): Promise<mongoose.Model<mongoose.Document>> {
        let model: mongoose.Model<mongoose.Document>;

        if (this.exists(name)) {
            return this.get(name);
        }

        await Schema.findOne({ name }, (err: any, dataDef: ISchemaModel) => {
            model = this.load(dataDef);
        });

        return model;
    }

    public exists(name: string): boolean {
        return (<any> mongoose).connection.models[name] != null;
    }

    public remove(name: string) {
        if (this.exists(name)) {
            delete (<any> mongoose).connection.models[name];
        }
    }

    private get(name: string): mongoose.Model<mongoose.Document> {
        return this.models[name];
    }

    private load(dataDef: ISchemaModel): mongoose.Model<mongoose.Document> {

        this.remove(dataDef.name);

        const schema = new mongoose.Schema(dataDef.definition);
        const entity = mongoose.model(dataDef.name, schema);
        this.models[dataDef.name] = entity;

        return entity;
    }

}

const entity = new EntityModel();

export default entity;
