
import ChatBox from "../Components/ChatBox";
import PlayerManager from "../Components/PlayerManager";

export default class Play extends React.Component {

    constructor(props) {
        super(props);

        props.app.player.on("kick", () => {
            props.app.goto("/");
            location.reload();
        });
    
    }

    render() {
        return(
            <div>
            <PlayerManager app={this.props.app}></PlayerManager>
            <ChatBox app={this.props.app}></ChatBox>
        </div>
        )
    }

    //static contextType = Context;

}