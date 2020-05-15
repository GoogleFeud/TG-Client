
import Player from "./Player";



export default function PlayerList(props) {
    const pl = [];
    let i= 1;
    for (let p of props.players) {
        pl.push(<Player buttons={p.buttons} name={p.name} details={p.details} number={i} key={Math.random()}></Player>)
        i++;
    }
    return(
        <div className="play-playerList">
        {pl}
    </div>
    )
}
