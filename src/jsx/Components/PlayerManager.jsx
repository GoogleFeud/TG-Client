

import PlayerList from "./PlayerList";
import Graveyard from "./GraveyardBox";
import Rolelist from "./RolelistBox";
import Commands from "../Other/Commands";

function _resolveButtons(app, thisPlayer, player, gameStarted = false) { // AND BADGES
    const btns = [];
    if (thisPlayer.id === player.id) btns.push({text: "YOU"})
    if (thisPlayer.admin && !player.admin && player.id !== thisPlayer.id && !gameStarted) btns.push({ // Kick button
        text: "kick",
        onClick: () => {console.log(player); Commands.run(`/kick ${player.name}`, app)},
    });
    return btns;
} 


export default class PlayerManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            players: [],
            rolelist: []
        }

        props.app.setThisPlayerAsAdmin = () => {
            this.setState(state => {
                const p = this.thisPlayer();
                p.admin = true;
                for (let pl of state.players) {
                    pl.buttons = _resolveButtons(this.props.app, p, pl);
                }
                return state;
            });
        }

    }



    componentDidMount() {

        this.props.app.player.on("lobbyInfo", (data) => {
            this.props.app.player.name = data.yourName;
            for (let player of data.players) {
               player.buttons = _resolveButtons(this.props.app, data.players.find(p => p.name === data.yourName), player);
           } 
            this.setState({players: data.players, rolelist: data.rl});
         });

         this.props.app.player.on("rolelistChange", (data) => {
             this.props.app.addMessage({content: `The rolelist was changed by ${data.changedBy}!`, sender: "system"});
             this.setState((state) => {
                 const rl = state.rolelist.concat();
                 rl[Number(data.index)] = data.content;
                 return {rolelist: rl};
             })
         });

         this.props.app.player.on("playerTempDisconnect", (data) => {
            this.setState((state) => {
                const p = state.players.find(p => p.id === data.id);
                if (!p) return {};
                p.disconnected = true;
                return state;
            });
          });

        this.props.app.player.on("playerLeave", (data) => {
            this.setState((state) => {
                const p = state.players.find(p => p.id === data.id);
                if (!p) return;
                this.props.app.addMessage({content: `${p.name} left the game!`, sender: "system"});
                const leftIndex = state.players.findIndex(p => p.id === data.id);
                const nPlayers = state.players.concat();
                nPlayers.splice(leftIndex, 1);
                nPlayers.forEach(v => {
                 if (v.number > (leftIndex + 1)) v.number--;
                });
                if (nPlayers[0] && !nPlayers[0].host) nPlayers[0].host = true;
                const rl = state.rolelist.concat();
                rl.splice(rl.length - 1, 1);
                return {
                    players: nPlayers,
                    rolelist: rl
                }
            });
        });

        this.props.app.player.on("playerJoin", (data) => {
            this.setState(state => {
                this.props.app.addMessage({content: `${data.name} has joined the game!`, sender: "system"});
                data.buttons = _resolveButtons(this.props.app, this.thisPlayer(), data);
                const nP = state.players.concat();
                nP.push(data);
                const nR = state.rolelist.concat();
                nR.push("Any");
                return {
                    players: nP,
                    rolelist: nR
                }
            })
           });


        this.props.app.player.on("playerReconnect", (data) => {
            this.setState(state => {
                const p = state.players.find(p => p.id === data.id);
                if (!p) return;
                p.disconnected = false;
                return state;
            })
           });

        this.props.app.player.on("admin", (data) => {
            this.setState(state => {
                const p = state.players.find(p => p.id === data.id);
                if (!p) return;
                p.admin = true;
                p.buttons = _resolveButtons(this.props.app, this.thisPlayer(), data);
                return state;
            });
           });

    }

    render() {
        return(
            <React.Fragment>
                <PlayerList app={this.props.app} players={this.state.players.filter(p => !p.dead)}></PlayerList>
                <Graveyard app={this.props.app} players={this.state.players.map(p => p.dead)}></Graveyard>
                <Rolelist app={this.props.app} rolelist={this.state.rolelist} thisPlayer={this.thisPlayer.bind(this)}></Rolelist>
            </React.Fragment>
        )
    }

    thisPlayer() {
        return this.state.players.find(p => p.id === this.props.app.player.id);
    }


}
