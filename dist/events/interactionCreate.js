"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event("interactionCreate", async (client, interaction) => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.reply({
                content: "That command no longer exists.",
                ephemeral: true,
            });
        try {
            command.run({
                client,
                interaction: interaction,
            });
        }
        catch (err) {
            console.log(err);
            interaction.reply({
                content: "An error occured.",
                ephemeral: true,
            });
        }
    }
});
