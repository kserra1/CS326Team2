export default class EventHub {
    constructor() {
        this.events = {}; //init an empty hashmap
    }

    on(event, callback){
        if(!this.events[event]){
            this.events[event] = []; //init empty array if event isn't already in hashmap (there exists an array for each event)
        }
        this.events[event].push(callback); //push a callback that should be executed when that even occurs
    }

    emit(event, data){
        if(this.events[event]){
            this.events[event].forEach(callback => callback(data));
        }else{
            throw new Error("event not in EventHub"); //good to have if someone forgets to always call on method before emit method
        }
    }
}