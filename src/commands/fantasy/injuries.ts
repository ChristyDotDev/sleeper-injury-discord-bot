import { Command } from "../../structures/Command";
import Sleeper from 'sleeper-api-client';

//https://www.npmjs.com/package/sleeper-api-client
const sleeper = new Sleeper({
  leagueId: process.env.leagueId
});

export default new Command({
  name: "injury-report",
  description: "List the injured starting players in the league",
  run: async ({ interaction }) => {
    interaction.reply("Fetching injury report...");

    let owners = {};
    await sleeper.getUsers().then((res) => {
      res.data.forEach(u => {
        owners[u.user_id] = u.display_name;
      });
    });
    
    const players = await sleeper.getPlayers().then((res) => {
      return res.data;
    });

    const injured = [];
    await sleeper.getRosters().then((res) => {
      res.data.flatMap((roster) => {
        const owner = owners[roster.owner_id];
        roster.starters.map((player_id) => {
          if (players[player_id].injury_status) {
            injured.push(`${owner}: ${players[player_id].full_name} - ${players[player_id].injury_status}`);
          }
        });
      });
    });
    interaction.editReply("Injury Report:\n" + injured.join("\n"));
  },
});
