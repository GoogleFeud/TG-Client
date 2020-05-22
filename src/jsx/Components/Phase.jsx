

class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: props.seconds,
            interval: setInterval(() => {
                if (this.state.seconds < 0) clearInterval(this.state.interval);
                else this.setState((state) => {
                    return {seconds: state.seconds - 1};
               })
            }, 1000)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.phaseName === this.props.phaseName) return;
        if (this.state.interval) clearInterval(this.state.interval);
        this.setState(() => {
        return {
            interval: setInterval(() => {
                if (this.state.seconds === 0) clearInterval(interval);
                else this.setState((state) => {
                    return {seconds: state.seconds - 1};
               })
            }, 1000),
            seconds: this.props.seconds
        }
        });
    }


   render() {
   return <span>({this.state.seconds})</span>
   }


}


export default class Phase extends React.Component {
 constructor(props) {
     super(props);
     this.state = {
         phase: null
     }

 }

 componentDidMount() {

     this.props.app.player.on("lobbyInfo", (data) => {
         if (!data.phase) return;
         this.props.app.phase = data.phase.name;
         if (data.phase.name === "Day_1") {
            this.props.app.addMessage({content: "It's Day 1", sender: "system"});
            data.phase.name = "Day";
            this.setState({phase: data.phase});
         }else {
            this.props.app.addMessage({content: `It's ${data.phase.name} ${data.phase.iters}`, sender: "system"});
            this.setState({phase: data.phase});
         }
     });


     this.props.app.player.on("Day_1", (phase) => {
         this.props.app.addMessage({content: "It's Day 1", sender: "system"});
         phase.name = "Day";
         this.props.app.phase = phase.name;
         this.setState({phase: phase});
     });

     this.props.app.player.on("Night", (phase) => {
         this.props.app.addMessage({content: `It's Night ${phase.iters}`, sender: "system"});
         this.props.app.phase = phase.name;
         this.setState({phase: phase});
     });


 }

 render() {
     if (!this.state.phase) return "";  
     return(
         <div className="play-time">
             <span>{this.state.phase.name} {this.state.phase.iters}</span>
             <Timer seconds={Math.round(this.state.phase.dur / 1000)} phaseName={this.state.phase.name}></Timer>
         </div>
     )
 }


}