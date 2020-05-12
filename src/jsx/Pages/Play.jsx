
import ChatBox from "../Components/ChatBox";
import PlayerList from "../Components/PlayerList";

export default function Play(props) {
   return(
        <div>
            <PlayerList app={props.app}></PlayerList>
            <ChatBox app={props.app}></ChatBox>
        </div>
    )
}