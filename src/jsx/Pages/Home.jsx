
const forbiddenChars = ["!", ">", "<", "^", "?", "-", "=", "|", "\\", "/", "@", "%", "&", "*", "(", ")", "+", ":", ";", "~", "{", "}", "[", "]"];


export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alts: []
        }
        
        this.error = React.createRef();
    }

    componentDidMount() {
         this.props.app.getRequest("getDisconnectedAlts").then(res => {
             if (!res.lobbies) return;
             const players = [];
             for (let lobby of res.lobbies) {
                 players.push(...lobby.alts);
             }
             this.setState({alts:  players});
         });
    }

    render() {
        let name;
        return(
            <div className="container">
            <div className="row home-center">
            <div>
                <img src="./logo.png"></img>
                <h1>The Testing Grounds</h1>
                 <p>Welcome to the Testing Grounds, where role ideas are tested in simulated gameplay. If you have any questions regarding the Testing Grounds, please view the <a href="https://www.blankmediagames.com/phpbb/viewtopic.php?f=50&t=72338" target="_blank">FAQ</a>. You can also ask questions and report bugs in our <a href="https://discord.com/invite/EVS55Zb" target="_blank">discord server</a>. Created by <a href="https://blankmediagames.com/phpbb/memberlist.php?mode=viewprofile&un=GoogleFeud" target="_blank">GoogleFeud</a> </p> 
    
                 <input type="text" className="home-input" placeholder="Your name..." onInput={(el) => {
                     name = el.target.value;
                 }}></input>
                 <input type="text" className="home-name-input" disabled value="1111"></input><br></br>
    
                 <p ref={this.error} className="home-error"></p>
    
                 <button onClick={async (e) => {
                     e.persist();
                     if (name.length <= 3) return this.error.current.innerHTML = "Your username must be longer than 3 characters!";
                     if (forbiddenChars.some((c) => name.includes(c))) return this.error.current.innerHTML = `Your name contains invalid characters! (${forbiddenChars.join(", ")})`
                     if (/\s/.test(name)) return this.error.current.innerHTML = "Currently, empty spaces are not allowed!";
                     if (name.length > 14) return this.error.current.innerHTML = "Your name is too long!";
                     const playerNames = await this.props.app.getRequest(`playersIn?roomId=1111`);
                     if (!this.error.current) return;
                     if (playerNames.some(p => p.toLowerCase() === name.toLowerCase())) return this.error.current.innerHTML = "This username is taken!";
                     this.props.app.joinGame(name, "1111");
                     if (!this.error.current) return;
                     e.target.disabled = true;
                     this.error.current.innerHTML = "Please wait...";
                 }}>JOIN!</button>
                 {
                     (this.state.alts.length) ? <div>
                      <h1>Or reconnect</h1>
                      {
                          this.state.alts.map(p => <p className="home-reconnectMsg" key={p.id} onClick={async () => {
                              this.props.app.reconnect(p.name, p.lobbyId, p.id);
                          }}>Reconnect as {p.name} (Room {p.lobbyId})</p>)
                      }
                     </div>:""
                 }
             </div>
            </div>
            <div className="home-center">
            <iframe src="https://discordapp.com/widget?id=239404476178366465&theme=dark" width="350" height="500" allowtransparency="true" frameBorder="0"></iframe>
            </div>
            </div>
        )
    }


}
