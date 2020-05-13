
import ChatBox from "../Components/ChatBox";
import PlayerList from "../Components/PlayerList";
import GraveyardBox from "../Components/GraveyardBox";
import RolelistBox from "../Components/RolelistBox";

export default function Play(props) {
    props.app.player.on("kick", () => {
        props.app.goto("/");
        location.reload();
    });
   return(
        <div>
            <GraveyardBox app={props.app}></GraveyardBox>
            <RolelistBox app={props.app}></RolelistBox>
            <PlayerList app={props.app}></PlayerList>
            <ChatBox app={props.app}></ChatBox>
        </div>
    )
}