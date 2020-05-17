
import ChatBox from "../Components/ChatBox";
import PlayerManager from "../Components/PlayerManager";
import Phase from "../Components/Phase";

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
            <Phase app={this.props.app}></Phase>
        </div>
        )
    }

    //static contextType = Context;

}