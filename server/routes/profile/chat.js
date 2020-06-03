const Profile = require('../../controllers/profile');
const Chat = require('../../controllers/chat');

const WebSocket = require('ws');
const Cookies = require('cookies');

const querystring = require('querystring');
const http = require('http');
const getSession = require('../../db').storeOptions.get;

const Router = require('koa-router');

const router = new Router();

router.get('/chat', Profile.isProtected(), Chat.get(), ctx => {
    ctx.body = ctx.state.chatHistory;
});

class Clients {
    constructor() {
        this.list = {};
        this.save = this.saveClient.bind(this);
    }
    saveClient(username, ws){
        this.list[username] = ws;
    }
}

const WSChat = (server) => {
    const wss = new WebSocket.Server({ server, path: '/chat', clientTracking: false });
    const clients = new Clients();

    wss.on('connection', async (ws, req) => {
        console.log('Connected to chat websocket');
        
        const cookies = new Cookies(req, new http.OutgoingMessage(), { keys: ['test'] });
        const cookie = cookies.get('koa:sess', { signed: true });

        if(!cookie) { 
            ws.close();
            return;
        }

        const sender = (await getSession(cookie)).username;
        clients.saveClient(sender, ws);

        console.log(clients);

        Chat.onMessage(clients, sender);

        
        // ws.on('close', () => {
        //     clients[sender] = undefined;
        //     console.log('closed');
        // });
    })
    
    return server;
}

module.exports = {
    router,
    WSChat,
}