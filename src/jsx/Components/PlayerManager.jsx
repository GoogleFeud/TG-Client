

import PlayerList from "./PlayerList";
import Graveyard from "./GraveyardBox";
import Rolelist from "./RolelistBox";
import Commands from "../Other/Commands";
import Bitfield from "../Other/Bitfield";
import Player from "./Player";

function _resolveButtons(app, thisPlayer, player, gameStarted = false) { // AND BADGES
    const btns = [];
    if (thisPlayer.id === player.id) btns.push({text: "YOU"})
    console.log(thisPlayer, player);
    if (thisPlayer.details.get(Player.ADMIN) && !player.details.get(Player.ADMIN) && player.id !== thisPlayer.id && !gameStarted) btns.push({ // Kick button
        text: "kick",
        onClick: () => Commands.run(`/kick ${player.name}`, app)
    });
    if ((thisPlayer.details.get(Player.ADMIN) || thisPlayer.details.get(Player.HOST)) && player.id == thisPlayer.id && !gameStarted) btns.push({
        text: "start game",
        onClick: async () => {
            const success = await app.getRequest(`start?lobbyId=${app.player.lobbyId}&starter=${thisPlayer.id}`);
            if (!success.res) return app.addMessage({content: "An error occured while trying to start the game", sender: "system"});
        }
    });
    if (gameStarted && thisPlayer.role && thisPlayer.role.mafia && thisPlayer.role.mafia.some(pName => pName == player.name)) btns.push({text: "MAFIA"})
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
                p.details.update(Player.ADMIN);
                for (let pl of state.players) {
                    pl.buttons = _resolveButtons(this.props.app, p, pl, this.props.app.started);
                }
                return state;
            });
        }

    }


    componentDidMount() {

        this.props.app.player.on("lobbyInfo", (data) => {
            if (data.phase) this.props.app.started = true;
            this.props.app.player.name = data.yourName;
            const you = data.players.find(p => p.name === data.yourName);
            you.details = new Bitfield(you.details);
            try {
            for (let player of data.players) {
               console.log(player);
               if (player.id !== you.id) player.details = new Bitfield(player.details);
               player.buttons = _resolveButtons(this.props.app, you, player, this.props.app.started);
           } 
        }catch(err) {console.log(err)};
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
                p.details.update(Player.DISCONNECTED);
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
                if (nPlayers[0] && !nPlayers[0].details.get(Player.HOST)) nPlayers[0].details.update(Player.HOST);
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
                data.details = new Bitfield(data.details);
                data.buttons = _resolveButtons(this.props.app, this.thisPlayer(), data, this.props.app.started);
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
                p.details.clear(Player.DISCONNECTED);
                return state;
            })
           });

        this.props.app.player.on("admin", (data) => {
            this.setState(state => {
                const p = state.players.find(p => p.id === data.id);
                if (!p) return;
                p.details.update(Player.ADMIN);
                p.buttons = _resolveButtons(this.props.app, this.thisPlayer(), p, this.props.app.started);
                return state;
            });
           });

        this.props.app.player.on("start", (data) => {
            this.props.app.started = true;
            this.thisPlayer().role = data.role;
            this.props.app.player.role = data.role;
            this.props.app.addMessage({content: `The game has started! Your role is ${data.role.name}`, sender: "system"});
            this.setState(state => {
                const newP = state.players.concat();
                for (let player of newP) {
                    player.buttons = _resolveButtons(this.props.app, this.thisPlayer(), player, true);
                }
                return {players: newP};
            });
        });

        this.props.app.player.on("win", (data) => {
            this.props.app.addMessage({content: `${data.winners} win!`});
            this.setState(state => {
                const newP = state.players.concat();
                for (let player of newP) {
                    player.buttons = _resolveButtons(this.props.app, this.thisPlayer(), player, false);
                }
                return {players: newP};
            });
        })

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
