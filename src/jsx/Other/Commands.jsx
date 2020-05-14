

export default {
    run: async function runCommand(msg, app) {
    const args = msg.split(" ");
    const cmd = args.shift();
    if (cmd === "/admin") { // /admin <Password>
         if (!args.length) return true;
         const isPwd = await app.getRequest(`pwd?password=${args[0]}&player=${app.player.id}&lobbyId=${app.player.lobbyId}`);
         if (!isPwd.res) return app.addMessage({content: "Wrong password!", sender: "system"});
         app.addMessage({content: "You are now an admin!", sender: "system"});
         app.reloadRolelist();
         app.addPlayerButtons(false);
         return true;
    }
    else if (cmd === "/kick") { // kick <username>
        if (!args.length) return true;
        const you = app.getPlayer(app.player.name);
        if (!you.admin) {
            app.addMessage({content: "Only admins can use this command!", sender: "system"});
            return true;
        }
        if (!app.hasPlayer(args[0])) {
            app.addMessage({content: "This player doesn't exist!", sender: "system"});
            return true;
        }
        const player = app.getPlayerByIndexOrName(args[0]);
        const res = await app.getRequest(`kick?player=${player.id}&kicker=${app.player.id}&lobbyId=${app.player.lobbyId}`);
        if (!res.res) app.addMessage({content: "Something went wrong!", sender: "system"});
        else app.addMessage({content: "Player kicked!", sender: "system"});
        return true;
    }
    return false;
},
cmds: ["/admin", "/kick"]
}