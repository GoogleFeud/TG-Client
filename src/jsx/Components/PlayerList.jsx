
import Player from "./Player";
import Commands from "../Other/Commands";

function _resolveButtons(app, thisPlayer, player) {
    const btns = [];
    if (thisPlayer.admin && !player.admin && player.id !== thisPlayer.id) btns.push({ // Kick button
        text: "kick",
        onClick: () => {console.log(player); Commands.run(`/kick ${player.name}`, app)},
    });
    return btns;
} 

export default class PlayerList extends React.Component {
    constructor(props) {
        super();
 
        this.state = {
            players: []
        }

        props.app.hasPlayer = (username) => {
            return this.state.players.some(p => p.name === username);
        }

        props.app.getPlayerByIndexOrName = (thing) => {
            return this.state.players.find((p, index) => p.name === thing || (index + 1) == thing);
        }

        props.app.getPlayer = (username) => {
            return this.state.players.find(p => p.name === username);
        }

        props.app.getPlayerById = (id) => {
            return this.state.players.find(p => p.id === id);
        }

        props.app.thisPlayer = () => {
            return props.app.getPlayer(props.app.player.name);
        }

        props.app.addPlayerButtons = (update = true) => {
            for (let player of this.state.players) {
                player.buttons = _resolveButtons(props.app, props.app.thisPlayer(), player);
            } 
            if (update) this.forceUpdate();
        }
        
        props.app.player.on("lobbyInfo", (data) => {
         props.app.player.name = data.yourName;
         const players = [...data.players];
         for (let player of players) {
            player.buttons = _resolveButtons(props.app, players.find(p => p.name === data.yourName), player);
        } 
         this.setState({players: players});
         props.app.setRolelist(data.rl);
      });

       props.app.player.on("playerTempDisconnect", (data) => {
         const p = props.app.getPlayerById(data.id);
         if (!p) return;
         p.disconnected = true;
        this.forceUpdate();
       });

       props.app.player.on("playerJoin", (data) => {
        props.app.addMessage({content: `${data.name} has joined the game!`, sender: "system"});
        data.buttons = _resolveButtons(props.app, props.app.thisPlayer(), data);
        this.setState(() => {
            this.state.players.push(data);
            return this.state.players;
        })
        props.app.addRolelistSlot("Any");
       });

       props.app.player.on("playerLeave", (data) => {
        const p = props.app.getPlayerById(data.id);
        if (!p) return;
        props.app.addMessage({content: `${p.name} left the game!`, sender: "system"});
        this.setState(() => {
            const leftIndex = this.state.players.findIndex(p => p.id === data.id);
            this.state.players.splice(leftIndex, 1);
            this.state.players.forEach(v => {
                if (v.number > (leftIndex + 1)) v.number--;
            });
            if (this.state.players[0] && !this.state.players[0].host) this.state.players[0].host = true;
            props.app.removeLastSlotFromRolelist();
            return this.state.players;
        })
       });

       
       props.app.player.on("playerReconnect", (data) => {
        const p = props.app.getPlayerById(data.id);
        if (!p) return;
        p.disconnected = false;
        this.forceUpdate();
       });

       props.app.player.on("admin", (data) => {
        const p = props.app.getPlayerById(data.id);
        if (!p) return;
        p.admin = true;
        p.buttons = _resolveButtons(props.app, props.app.thisPlayer(), data);
        this.forceUpdate();
       });


    }
 
    render() {
        const pl = this.state.players.map((p, index) => <Player buttons={p.buttons} name={p.name} host={p.host} admin={p.admin} disconnected={p.disconnected} number={index + 1} key={index}></Player>)
        return(
            <div className="play-playerList">
                {pl}
            </div>
        )
    }
 
 }
