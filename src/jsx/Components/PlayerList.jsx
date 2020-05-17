
import Player from "./Player";
import Bitfield from "../Other/Bitfield";



export default function PlayerList(props) {
    const pl = [];
    let i= 1;
    for (let p of props.players) {
        if (!p.details.get) p.details = new Bitfield(p.details);
        pl.push(<Player buttons={p.buttons} name={p.name} details={p.details} number={i} key={Math.random()}></Player>)
        i++;
    }
    return(
        <div className="play-playerList">
        {pl}
    </div>
    )
}
