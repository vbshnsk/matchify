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

const WSChat = (server, app) => {
    const wss = new WebSocket.Server({ server, path: '/chat', clientTracking: false });
    const clients = {};

    wss.on('connection', async (ws, req) => {
        console.log('Connected to chat websocket');
        
        const cookies = new Cookies(req, new http.OutgoingMessage(), { keys: ['test'] });
        const cookie = cookies.get('koa:sess', { signed: true });

        if(!clients) { 
            ws.close();
            return;
        }
        
        const { receiver } = querystring.parse(req.url.split('?')[1]);
        const sender = (await getSession(cookie)).username;

        clients[sender] = ws;
        const receiverws = clients[receiver];

        Chat.onMessage(receiverws, ws, sender, receiver);
        
        ws.on('close', () => {
            clients[sender] = undefined;
            console.log('closed');
        });
    })
}

module.exports = {
    router,
    WSChat,
}