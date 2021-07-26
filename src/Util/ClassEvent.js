export class ClassEvent {
    constructor() {
        this._events = {}; // todos os eventos
    }

    on(eventName, fn) {
        if(!this._events[eventName]) this._events[eventName] = new Array();

        this._events[eventName].push(fn); //adiciona a função ao evento
    }

    trigger() {
        let args = [...arguments];
        let eventName = args.shift(); //primeiro parâmetro sempre será o nome do evento

        args.push(new Event(eventName));

        if(this._events[eventName] instanceof Array) {
            this._events[eventName].forEach(fn => {
                fn.apply(null, args);
            });
        }
    }
}