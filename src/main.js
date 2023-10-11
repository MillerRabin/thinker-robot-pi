import listener from "./server/listener.js";
import { serverPort } from "./config.js";

listener.start(serverPort);