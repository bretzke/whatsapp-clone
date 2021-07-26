import { ClassEvent } from "../Util/ClassEvent";

export class Model extends ClassEvent {
    constructor() {
        super();
        this._data = {};
    }

    fromJSON(json) {
        this._data = Object.assign(this._data, json); // mescla as 2 variáveis
        this.trigger('datachange', this.toJSON()); //dispara o gatilho
    }

    toJSON() {
        return this._data;
    }
}