


class Player extends React.Component {
     constructor(props) {
         super(props);

     }

     render() {
        let color = "black";
        if (this.props.details.get(Player.DISCONNECTED)) color = "gray";
        else if (this.props.details.get(Player.ADMIN)) color = "red";
        else if (this.props.details.get(Player.HOST)) color = "green";
        return(
            <div className="play-playerInPlayerList">
                <p style={{color: color, fontWeight: (this.props.details.get(Player.HOST) || this.props.details.get(Player.ADMIN) || this.props.details.get(Player.DISCONNECTED)) ? "bold":"none" }}>{this.props.number}. {this.props.name}</p>
                {this.props.buttons && this.props.buttons.map((b, i) => {
                if (b.onClick) return <button className="play-actionButton" key={Math.random()} onClick={(e) => {
                    b.onClick(e)
                }}>{b.text}</button>
                return <span className="play-playerBadge" key={Math.random()}>{b.text}</span>
                })}
            </div>
        )
     }


}

Player.DEAD = 0;
Player.HOST = 1;
Player.ADMIN = 2;
Player.DISCONNECTED = 3;

export default Player;