
import Player from "./Player";

class Slot extends React.Component {
        constructor(props) {
           super(props);

           this.state = {
               value: this.props.content || ""
           }

        }

        render() {
        const curPlayer = this.props.thisPlayer();
        return(
            <input className="play-rolelistSlot" type="text" disabled={(curPlayer) ? (curPlayer.details.get(Player.ADMIN) === true || curPlayer.details.get(Player.HOST) === true) ? false:true:false} value={this.state.value} onChange={(e) => this.setState({
                value: e.target.value
              })} onKeyUp={async (e) => {
                if (e.keyCode === 13) {
                const v = e.target.value.replace(/\s+/g,' ').trim();
                if (v === "") return e.target.value = "Any";
                e.persist();
                const res = await this.props.app.getRequest(`changerl?index=${this.props.index}&content=${v}&lobbyId=${this.props.app.player.lobbyId}&setter=${this.props.app.player.id}`);
                if (res.res === false) {
                    e.target.value = "Any";
                    this.props.app.addMessage({content: "This is an invalid rolelist entry.", sender: "system"});
                }
                e.preventDefault()
            }}}></input>
        )
        }
}


export default class RolelistBox extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const slots = this.props.rolelist.map((s, i) => <Slot content={s} key={Math.random()} index={i} app={this.props.app} thisPlayer={this.props.thisPlayer}></Slot>)
        return(
        <div className="play-rolelistBox">
            {(slots.length && slots) || ""}
        </div>
        )
    }



}