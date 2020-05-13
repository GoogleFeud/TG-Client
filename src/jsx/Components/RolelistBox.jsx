

function Slot(props) {
        const curPlayer = (props.app.getPlayer) ? props.app.getPlayer(props.app.player.name):null;
        let val = ""
        return(
            <input type="text" disabled={(curPlayer) ? (curPlayer.host === true || curPlayer.admin === true) ? false:true:false} defaultValue={props.content} onChange={(e) => {
            }} onKeyUp={async (e) => {
                if (e.keyCode === 13) {
                const v = val.replace(/\s+/g,' ').trim();
                if (v === "") return e.target.value = "Any";
                e.persist();
                const res = await props.app.getRequest(`changerl?index=${props.index}&content=${v}&lobbyId=${props.app.player.lobbyId}&setter=${props.app.player.id}`);
                if (res.res === false) {
                    e.target.value = "Any";
                    props.app.addMessage({content: "Something went wrong!", sender: "system"});
                }
            }}}></input>
        )
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

        props.app.player.on("rolelistChange", (data) => {
            this.state.slots[Number(data.index)] = data.content;
            this.props.app.addMessage({content: `The rolelist was changed by ${data.changedBy}!`, sender: "system"});
            this.forceUpdate();
        });

    }

    render() {
        const slots = this.state.slots.map((s, i) => <Slot content={s} key={i} index={i} app={this.props.app}></Slot>)
        return(
        <div className="play-rolelistBox">
            {(slots.length && slots) || ""}
        </div>
        )
    }



}