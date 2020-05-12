const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default class CustomWebSocket extends EventEmitter3 {
    constructor(name, roomId) {
        super();
        this.lobbyId = roomId;
        this.name = name;
        this.ready = false;
        sessionStorage.setItem("_room_", roomId);
        this.id = sessionStorage.getItem("_sid_");
        if (!this.id) {
            this.id = CustomWebSocket.genid();
            sessionStorage.setItem("_sid_", this.id);
        }
        this.socket = new WebSocket(`ws://localhost:4000?roomId=${roomId}&name=${name}&socketId=${this.id}`);

        this.socket.onopen = () => {
            this.ready = true;
            this.emit("ready", this);
            
            this.socket.onmessage = (payload) => {
                try {
                    const content = JSON.parse(payload.data);
                    if (content.e) this.emit(content.e, content.d);
                }catch(err) {
                    return;
                }
            }

            this.socket.onerror = (ev) => this.emit("error", ev);

            this.socket.onclose = (ev) => this.emit("close", ev);

        }
    }

    send(eventName, data) {
        this.socket.send(JSON.stringify({e: eventName, d: data}));
    }

    static genid(ID_LENGTH = 18) {
        let rtn = '';
        for (let i = 0; i < ID_LENGTH; i++) {
          rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
        }
        return rtn;
    }
}