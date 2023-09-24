"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const tslib_1 = require("tslib");
const discord_js_1 = require("discord.js");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
class Bot extends discord_js_1.Client {
    commands = new discord_js_1.Collection();
    constructor(options = {}) {
        super({
            intents: ["Guilds", "GuildMessages", "GuildMembers", "MessageContent"],
            ...options,
        });
    }
    start() {
        this.registerModules();
        this.login(process.env.token);
    }
    async importFile(filePath) {
        var _a;
        return (await (_a = filePath, Promise.resolve().then(() => tslib_1.__importStar(require(_a)))))?.default;
    }
    async registerCommands({ commands, guildId }) {
        if (!process.env.deploySlashGlobally) {
            const guild = this.guilds.cache.get(guildId);
            guild?.commands.set(commands);
            console.log(`Registering commands to ${guild?.name}`);
        }
        else {
            this.application?.commands.set(commands);
            console.log("Registering global commands");
        }
    }
    async registerModules() {
        // Commands
        const slashCommands = [];
        fs_1.default.readdirSync(path_1.default.join(__dirname, "../commands")).forEach(async (dir) => {
            const commandFiles = fs_1.default
                .readdirSync(path_1.default.join(__dirname, `../commands/${dir}`))
                .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
            for (const file of commandFiles) {
                const command = await this.importFile(`../commands/${dir}/${file}`);
                if (!command.name)
                    return;
                this.commands.set(command.name, command);
                slashCommands.push(command);
            }
        });
        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands,
                guildId: process.env.guildId,
            });
        });
        // Events
        const eventFiles = fs_1.default
            .readdirSync(path_1.default.join(__dirname, "../events"))
            .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));
        for (const file of eventFiles) {
            const event = await this.importFile(`../events/${file}`);
            this.on(event.event, event.run.bind(null, this));
        }
    }
}
exports.Bot = Bot;
