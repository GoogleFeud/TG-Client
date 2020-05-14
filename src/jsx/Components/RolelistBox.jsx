

class Slot extends React.Component {
        constructor(props) {
           super(props);

           this.state = {
               value: this.props.content || ""
           }
        }

        render() {
        const curPlayer = (this.props.app.getPlayer) ? this.props.app.getPlayer(this.props.app.player.name):null;
        return(
            <input className="play-rolelistSlot" type="text" disabled={(curPlayer) ? (curPlayer.host === true || curPlayer.admin === true) ? false:true:false} value={this.state.value} onChange={(e) => this.setState({
                value: e.target.value
              })} onKeyUp={async (e) => {
                if (e.keyCode === 13) {
                const v = e.target.value.replace(/\s+/g,' ').trim();
                if (v === "") return e.target.value = "Any";
                e.persist();
                const res = await this.props.app.getRequest(`changerl?index=${this.props.index}&content=${v}&lobbyId=${this.props.app.player.lobbyId}&setter=${this.props.app.player.id}`);
                if (res.res === false) {
                    e.target.value = "Any";
                    this.props.app.addMessage({content: "Something went wrong!", sender: "system"});
                }
                e.preventDefault()
            }}}></input>
        )
        }
}


export default class GraveyardBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            slots: []
        }

        props.app.addRolelistSlot = (content) => {
            this.state.slots.push(content);
            this.forceUpdate();
        }

        props.app.setRolelist = (content) => {
            this.state.slots = content;
            this.forceUpdate();
        }

        props.app.reloadRolelist = () => {
            this.forceUpdate();
        }

        props.app.removeLastSlotFromRolelist = () => {
            this.state.slots.splice(this.state.slots - 1, 1);
            this.forceUpdate();
        }

        props.app.player.on("rolelistChange", (data) => {
            this.props.app.addMessage({content: `The rolelist was changed by ${data.changedBy}!`, sender: "system"});
            this.setState((state) => {
                state.slots[Number(data.index)] = data.content;
                return state;
            })
        });

    }

    render() {
        const slots = this.state.slots.map((s, i) => <Slot content={s} key={Math.random()} index={i} app={this.props.app}></Slot>)
        return(
        <div className="play-rolelistBox">
            {(slots.length && slots) || ""}
        </div>
        )
    }



}