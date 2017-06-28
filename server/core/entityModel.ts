import * as mongoose from "mongoose";
import DataDefinition, { IDataDefinitionModel } from "./dataDefinition";

export class EntityModel {
    private models: {[name: string]: mongoose.Model<mongoose.Document>};
    private loaded: boolean;
    constructor() {
        this.models = {};
        this.loaded = false;
    }

    public async bootloader() {
        if (!this.loaded) {
            return this.loadAll();
        }
    }

    public async loadAll() {
        return await DataDefinition.find({}, (err: any, dataDefs: IDataDefinitionModel[]) => {
            // tslint:disable-next-line:forin
            for (let item in dataDefs) {
                let dataDef = dataDefs[item];
                this.load(dataDef);
            }
            this.loaded = true;
        });
    }

    public async loadOne(name: string) {
        return await DataDefinition.findOne({ name }, (err: any, dataDef: IDataDefinitionModel) => {
            this.load(dataDef);
        });
    }

    public exists(name: string): boolean {
        return (<any> mongoose).connection.models[name] != null;
    }

    public get(name: string): mongoose.Model<mongoose.Document> {
        return this.models[name];
    }

    public remove(name: string) {
        if (this.exists(name)) {
            delete (<any> mongoose).connection.models[name];
        }
    }

    private load(dataDef: IDataDefinitionModel) {

        this.remove(dataDef.name);

        const schema = new mongoose.Schema(dataDef.schemaDef);
        const entity = mongoose.model(dataDef.name, schema);
        this.models[dataDef.name] = entity;
    }

}

const entity = new EntityModel();

export default entity;
