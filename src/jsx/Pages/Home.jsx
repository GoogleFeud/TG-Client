
const forbiddenChars = ["!", ">", "<", "^", "?", "-", "=", "|", "\\", "/", "@", "%", "&", "*", "(", ")", "+", ":", ";", "~", "{", "}", "[", "]"];

export default function Home(props) {
    const error = React.useRef();
    let name = "";
    return(
        <div className="container">
        <div className="row home-center">
        <div>
            <h1>The Testing Grounds</h1>
             <p>Welcome to the Testing Grounds, where role ideas are tested in simulated gameplay. If you have any questions regarding the Testing Grounds, please view the <a href="https://www.blankmediagames.com/phpbb/viewtopic.php?f=50&t=72338" target="_blank">FAQ</a>. You can also ask questions and report bugs in our <a href="https://discord.com/invite/EVS55Zb" target="_blank">discord server</a>. Created by <a href="https://blankmediagames.com/phpbb/memberlist.php?mode=viewprofile&un=GoogleFeud" target="_blank">GoogleFeud</a> </p> 

             <input type="text" className="home-input" placeholder="Your name..." onInput={(el) => {
                 name = el.target.value;
             }}></input>
             <input type="text" className="home-name-input" disabled value="1111"></input><br></br>

             <p ref={error} className="home-error"></p>

             <button onClick={async (e) => {
                 e.persist();
                 if (name.length <= 3) return error.current.innerHTML = "Your username must be longer than 3 characters!";
                 if (forbiddenChars.some((c) => name.includes(c))) return error.current.innerHTML = `Your name contains invalid characters! (${forbiddenChars.join(", ")})`
                 const playerNames = await props.app.getRequest(`playersIn?roomId=1111`);
                 if (playerNames.some(p => p.toLowerCase() === name.toLowerCase())) return error.current.innerHTML = "This username is taken!";
                 props.app.joinGame(name, "1111");
                 e.target.disabled = true;
                 error.current.innerHTML = "Please wait...";
             }}>JOIN!</button>
         </div>
        </div>
        <div className="home-center">
        <iframe src="https://discordapp.com/widget?id=239404476178366465&theme=dark" width="350" height="500" allowtransparency="true" frameBorder="0"></iframe>
        </div>
        </div>
    )
}