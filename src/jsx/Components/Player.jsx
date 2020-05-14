

export default class Player extends React.Component {
     constructor(props) {
         super(props);
     }

     render() {
        let color = "black";
        if (this.props.disconnected) color = "gray";
        else if (this.props.admin) color = "red";
        else if (this.props.host) color = "green";
        return(
            <div className="play-playerInPlayerList">
                <p style={{color: color, fontWeight: (this.props.host || this.props.admin || this.props.disconnected) ? "bold":"none" }}>{this.props.number}. {this.props.name}</p>
                {this.props.buttons && this.props.buttons.map((b, i) => {
                if (b.onClick) return <button className="play-actionButton" key={Math.random()} onClick={(e) => b.onClick(e)}>{b.text}</button>
                return <span className="play-playerBadge" key={Math.random()}>{b.text}</span>
                })}
            </div>
        )
     }
}
