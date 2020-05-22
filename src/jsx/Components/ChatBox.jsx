
import Commands from "../Other/Commands";


export default class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.messageList = React.createRef();

        props.app.addMessage = (msg) => {
            this.addMessage(msg)
        }

    }

    componentDidMount() {

        this.props.app.player.on("message", msg => {
            this.addMessage(msg);
        });
        
    }

    render() {
        return(
                <div>
                    <div className="play-messageList" ref={this.messageList}>
                    </div>
                    <input type="text" className="play-messageBox" onKeyUp={(e) => {
                        if (e.keyCode === 13) {
                            if (e.target.value === "" || e.target.value === " ") return;
                            if (this.props.app.started && this.props.app.phase === "Night" && this.props.app.player.role.mafia === null) return; // Ignore messages from non-mafia players
                            e.persist();
                            if (Commands.cmds.some(c => e.target.value.startsWith(c))) {
                                Commands.run( e.target.value, this.props.app);
                                e.target.value = "";
                                return;
                            }
                            e.persist();
                            this.props.app.player.send("message", {content: e.target.value.replace(/<\/?[^>]+(>|$)/g, ""), sender: this.props.app.player.name});
                            e.target.value = "";
                        }
                    }}></input>
                    
                </div>
        )
    }

    //Msg object: {content: "", sender: "", receiver: "", whisper: Boolean}
    addMessage(message) {
        let msg = message.content;
        if (message.sender === "system") msg = `<span style="font-weight: bold; color: red">${message.content}</span>`;
        else if (message.whisper) {
            if (message.receiver === this.props.app.player.name) {
                msg = `<span style="font-weight: bold; color: green">Whisper from ${message.sender}: ${message.content}</span>:`
            }else if (message.sender === this.props.app.player.name) {
                msg = `<span style="font-weight: bold; color: green">Whisper to ${message.receiver}:  ${message.content}</span>`
            }else {
                msg = `<span style="font-weight: bold">${message.sender} is whispering to ${message.receiver}</span>`
            }
        }else msg = `<span style="font-weight: bold">${message.sender}</span>: ${message.content}`;
        const el = document.createElement("p");
        el.innerHTML = msg;
        this.messageList.current.appendChild(el);
        el.scrollIntoView();
    }

}