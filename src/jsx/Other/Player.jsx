import Bitfield from "./Bitfield";


export default class Player {
    constructor(data) {
        console.log(data);
        this.name = data.name;
        this.details = data.details instanceof Bitfield ? data.details:new Bitfield(data.details);
        this.role = data.role;
        this.id = data.id;
        this._buttons = new Map();
        this.number = data.number;
        this.action = data.action || {};
    }

    addButtons(buttons) {
        for (let button of buttons) {
            this._buttons.set(button.type, button);
        }
    }

    update(data) {
        if (data.role) this.role = data.role;
        if (data.details) this.details = new Bitfield(data.details);
    }

    get buttons() {
        return [...this._buttons.values()];
    }

}