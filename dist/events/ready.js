"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event("ready", (client) => {
    console.log(`${client.user?.tag} is now online!`);
});
