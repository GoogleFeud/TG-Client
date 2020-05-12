
import Commands from "../Other/Commands";


export default class ChatBox extends React.Component {
    constructor(props) {
        super();
        this.messageList = React.createRef();
        props.app.player.on("message", msg => {
            this.addMessage(msg);
        });
        props.app.addMessage = this.addMessage.bind(this);
    }

    render() {
        return(
                <div>
                    <div className="play-messageList" ref={this.messageList}>
                    </div>
                    <input type="text" className="play-messageBox" onKeyUp={(e) => {
                        if (e.target.value === "" || e.target.value === " ") return;
                        e.persist();
                        if (e.keyCode === 13) {
                            if (await Commands(e.target.value, this.props.app) === true) {
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
            if (message.receiver == this.props.app.player.name) {
                msg = `Whisper from <span style="font-weight: bold; color: green">${message.sender}</span>: ${message.content}`
            }else if (message.sender == this.props.player.name) {
                msg = `Whisper to <span style="font-weight: bold; color: green">${message.receiver}</span>: ${message.content}`
            }else {
                msg = `<span style="font-weight: bold">${message.sender} is whispering to ${receiver}</span>`
            }
        }else msg = `<span style="font-weight: bold">${message.sender}</span>: ${message.content}`;
        const el = document.createElement("p");
        el.innerHTML = msg;
        this.messageList.current.appendChild(el);
        el.scrollIntoView();
    }

}