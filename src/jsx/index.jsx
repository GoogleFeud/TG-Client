
import "regenerator-runtime"; // In order to use async/await
import Home from "./Pages/Home";
import Play from "./Pages/Play";
import CustomWebSocket from "./Other/WebSocket";

let _ROOT;

const NAV = {
    "/": Home,
    "/play": Play
}

class App extends React.Component {
    constructor(props) {
        super();
        const url = this.resolveURL();
        this.state = {
            url: url.path
        }
        this.player = null;
        if (url.path === "/play" && sessionStorage.getItem("_room_" ) && sessionStorage.getItem("_sid_")) this.player = new CustomWebSocket("a", sessionStorage.getItem("_room_"));
        else this.state.url = "/";
        window.history.pushState({url: this.state.url}, null, this.state.url)
        window.onpopstate = e => {
        if (e.state) return this.setState({
         path: e.state.url
        });
       };
    }

    render() {
        let Nav = NAV[this.state.url] || Home;
        return(
            <div>
                <Nav app={this}></Nav>
            </div>
        )
    }

    resolveURL(urlLike) {
        const url = new URL(urlLike || location.href, location.hostname === "localhost" ? "http://localhost:4000":"http://localhost:4000");
        return {
            path: url.pathname,
            query: url.searchParams,
            formed: url.toString()
        }
    }

    goto(url) {
     if (!NAV[url]) url = this.resolveURL(url);
     let path = url.path || url;
     window.history.pushState({
      url: url.formed || url
    }, null, url.formed || url);
    this.setState({url: path});
    return null;
    }

    joinGame(name, lobbyId) {
        this.player = new CustomWebSocket(name, lobbyId);
        this.goto("/play");
    }

    async getRequest(endpoint) {
        const res = await fetch(`/api/${endpoint}`);
        if (!res.ok) return false;
        return await res.json();
    }

}

window.onload = async () => {
    _ROOT = document.getElementById("main");
    ReactDOM.render(<App></App>, _ROOT);
};