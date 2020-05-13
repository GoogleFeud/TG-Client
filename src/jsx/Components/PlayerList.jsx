
import Player from "./Player";

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
        
        props.app.player.on("lobbyInfo", (data) => {
         props.app.player.name = data.yourName;
         this.setState({players: data.players});
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
        console.log(data, p);
        if (!p) return;
        p.admin = true;
        this.forceUpdate();
       });


    }
 
    render() {
        const pl = this.state.players.map((p, index) => <Player name={p.name} host={p.host} admin={p.admin} disconnected={p.disconnected} number={index + 1} key={index}></Player>)
        return(
            <div className="play-playerList">
                {pl}
            </div>
        )
    }
 
 }