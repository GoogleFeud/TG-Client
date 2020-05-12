

export default async function runCommand(msg, app) {
    const args = msg.split(" ");
    const cmd = args.shift();
    if (cmd === "/admin") { // /admin <Password>
         if (!args.length) return true;
         const isPwd = await app.getRequest(`pwd?password=${args[0]}&player=${app.player.name}&lobbyId=${app.player.lobbyId}`);
         if (isPwd.res) app.addMessage({content: "You are now an admin!", sender: "system"});
         else app.addMessage({content: "Wrong password!", sender: "system"});
         return true;
    }
    return false;
}