import EventHub from "./EventHub";

const eventHub = new EventHub();

export default eventHub; //If other files need to use eventHub object, use this file (acts as a factory for eventhub object)