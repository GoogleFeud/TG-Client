


export default {
    run: async function runCommand(msg, app) {
    const args = msg.split(" ");
    const cmd = args.shift();
    if (cmd === "/admin") { // /admin <Password>
         if (!args.length) return true;
         const isPwd = await app.getRequest(`pwd?password=${args[0]}&player=${app.player.id}&lobbyId=${app.player.lobbyId}`);
         if (!isPwd.res) return app.addMessage({content: "Wrong password!", sender: "system"});
         app.addMessage({content: "You are now an admin!", sender: "system"});
         app.setThisPlayerAsAdmin();
         return true;
    }
    else if (cmd === "/kick") { // kick <username>
        if (!args.length) return true;
        const res = await app.getRequest(`kick?player=${args[0]}&kicker=${app.player.id}&lobbyId=${app.player.lobbyId}`);
        if (!res.res) app.addMessage({content: "Something went wrong! You most likely entered a player that doesn't exist!", sender: "system"});
        else app.addMessage({content: "Player kicked!", sender: "system"});
        return true;
    }
    else if (cmd === "/w") {
        if (!args.length) return true;
        const target = args.shift();
        const msg = args.join(" ");
        const res = await app.getRequest(`whisper?whisperer=${app.player.id}&receiver=${target}&lobbyId=${app.player.lobbyId}&msg=${msg}`);
        if (!res.res) app.addMessage({content: "Something went wrong!", sender: "system"});
        else app.addMessage({content: "Player kicked!", sender: "system"});
    }
    return false;
},
cmds: ["/admin", "/kick", "/w"]
}