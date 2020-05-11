
import "regenerator-runtime"; // In order to use async/await
import Home from "./Pages/Home";

let _ROOT;

class App extends React.Component {
    constructor(props) {
        super();
        const url = this.resolveURL();
        this.state = {
            url: url.path
        }
        this.player = {connected: false};

        window.history.pushState({url: url.path}, null, url.path)

        window.onpopstate = e => {
        if (e.state) return this.setState({
         path: e.state.url
        });
       };
    }

    render() {
        let Nav = Home;
       // if (this.state.url === "/") Nav = Home;
        return(
            <div>
                <Nav></Nav>
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
}

window.onload = async () => {
    _ROOT = document.getElementById("main");
    ReactDOM.render(<App></App>, _ROOT);
};