

import PlayerList from "./PlayerList";
import Graveyard from "./GraveyardBox";
import Rolelist from "./RolelistBox";
import Commands from "../Other/Commands";
import Bitfield from "../Other/Bitfield";
import Player from "./Player";
import Player_Class from "../Other/Player";

function _resolveButtons(app, thisPlayer, player, gameStarted = false) { // AND BADGES
    const btns = [];
    if (thisPlayer.id === player.id) btns.push({text: "YOU", type: "you"})
    if (thisPlayer.details.get(Player.ADMIN) && !player.details.get(Player.ADMIN) && player.id !== thisPlayer.id && !gameStarted) btns.push({ // Kick button
        text: "kick",
        type: "kick",
        onClick: () => Commands.run(`/kick ${player.name}`, app)
    });
    if ((thisPlayer.details.get(Player.ADMIN) || thisPlayer.details.get(Player.HOST)) && player.id === thisPlayer.id && !gameStarted) btns.push({
        text: "start game",
        type: "s",
        onClick: async () => {
            const success = await app.getRequest(`start?lobbyId=${app.player.lobbyId}&starter=${thisPlayer.id}`);
            if (!success.res) return app.addMessage({content: "An error occured while trying to start the game", sender: "system"});
        }
    });
    if (gameStarted && thisPlayer.role && thisPlayer.role.mafia && thisPlayer.role.mafia.some(pId =>pId == player.id)) btns.push({text: player.role.name.toUpperCase(), type: "maf"});
    if (app.phase === "Night" && thisPlayer.role.details[0] > 0) {
        if (thisPlayer.role.details[0] === 1) {
            const tBtn = {text: "TARGET", onClick: (ev) => {
                if (thisPlayer.action.target === player.id) {
                    thisPlayer.action = {};
                    ev.target.style.color = "black";
                    app.player.send("cancelAction");
                }else {
                thisPlayer.action = {target: player.id};
                app.player.send("setAction", {target: player.id});
            }
            }, type: "ac1"};
            if (thisPlayer.role.details[3]) btns.push({text: "FA", onClick: () => {
                    app.player.send("setAction", {target: player.id, fa: true});
            }});
            if (thisPlayer.role.details[1] && player.id === thisPlayer.id) btns.push(tBtn);
            if (thisPlayer.role.details[2] && player.dead) btns.push(tBtn); 
        }
    }
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
                    pl.addButtons(_resolveButtons(this.props.app, p, pl, this.props.app.started));
                }
                return state;
            });
        }

    }


    componentDidMount() {

        this.props.app.player.on("lobbyInfo", (data) => {
            if (data.phase) this.props.app.started = true;
            this.props.app.player.name = data.yourName;
            const players = [];
            const you = data.players.find(p => p.name === data.yourName);
            this.props.app.player.role = you.role;
            you.details = new Bitfield(you.details);
            try {
            for (let player of data.players) {
                player = new Player_Class(player);
                players.push(player);
            }
            for (let player of players) {
                player.addButtons(_resolveButtons(this.props.app, you, player, this.props.app.started, this.state.players));
           } 
        }catch(err) {console.log(err)};
            this.setState({players: players, rolelist: data.rl});
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
                const player = new Player_Class(data);
                player.addButtons(_resolveButtons(this.props.app, this.thisPlayer(), data, this.props.app.started, state.players));
                const nP = state.players.concat();
                nP.push(player);
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
                p.addButtons(_resolveButtons(this.props.app, this.thisPlayer(), p, this.props.app.started, state.players));
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
                    player.update(data.players.find(p => p.id === player.id));
                }
                for (let player of newP) {
                    console.log(player);
                    player.addButtons(_resolveButtons(this.props.app, this.thisPlayer(), player, true, newP));
                }
                return {players: newP};
            });
        });

        this.props.app.player.on("win", (data) => {
            this.props.app.addMessage({content: `${data.winners} win!`});
            this.setState(state => {
                const newP = state.players.concat();
                for (let player of newP) {
                    player.addButtons(_resolveButtons(this.props.app, this.thisPlayer(), player, false, newP));
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
