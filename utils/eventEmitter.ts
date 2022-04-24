import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();
if (typeof window !== "undefined") {
  window.eventEmitter = eventEmitter;
}

export default eventEmitter;
