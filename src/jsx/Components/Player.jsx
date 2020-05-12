

export default function Player(props) {
        let color = "black";
        if (props.disconnected) color = "gray";
        else if (props.admin) color = "red";
        else if (props.host) color = "green";
        return(
            <div className="play-playerInPlayerList">
                <p style={{color: color, fontWeight: (props.host || props.admin || props.disconnected) ? "bold":"none" }}>{props.number}. {props.name}</p>
            </div>
        )
}