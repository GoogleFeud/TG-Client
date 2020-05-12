

class ChatBox extends React.Component {
    constructor(props) {
        super();
        this.messageList = React.createRef();
        props.app.player.on("message", msg => {
            this.addMessage(msg);
        });
    }

    render() {
        return(
                <div>
                    <div className="play-messageList" ref={this.messageList}>
                    </div>
                    <input type="text" className="play-messageBox" onKeyUp={(e) => {
                        e.persist();
                        if (e.keyCode === 13) {
                            this.props.app.player.send("message", {content: e.target.value, sender: this.props.app.player.name});
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

class Player extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
                <p style={{color: this.props.admin ? "red":this.props.host ? "green":"black", fontWeight: (this.props.admin || this.props.host) ? "bold":"none" }}>{this.props.number}. {this.props.name}</p>
            </div>
        )
    }
}

class PlayerList extends React.Component {
   constructor(props) {
       super();

       this.state = {
           players: []
       }

       props.app.player.on("lobbyInfo", (data) => {
        props.app.player.name = data.yourName;
        console.log(data);
        this.setState({players: data.players});
     });
   }

   render() {
       const pl = this.state.players.map((p, index) => <Player name={p.name} host={p.host} admin={p.admin} number={index + 1} key={index}></Player>)
       return(
           <div className="play-playerList">
               {pl}
           </div>
       )
   }

}

export default function Play(props) {
   return(
        <div>
            <PlayerList app={props.app}></PlayerList>
            <ChatBox app={props.app}></ChatBox>
        </div>
    )
}