const Message = require('../models/message');
const User = require('../models/user')

const get = () => {
    return async (ctx, next) => {
        const user = ctx.session.username;
        const match = ctx.query.match;
        const isAMatch = await User.checkMatch(user, match);
        if(isAMatch){
            ctx.state.chatHistory = await Message.getChat(user, match);
            await next();
        }
        else {
            ctx.status = 401;
        }
    }
}

const onMessage = (clients, user) => {
    const from = clients.list[user];
    from.on('message', async (data) => {
        console.log(data);
        const match = JSON.parse(data).receiver;
        const to = clients.list[match];
        const msg = await Message.insert(JSON.parse(data).message, user, match);
        if(to) to.send(JSON.stringify(msg));
        from.send(JSON.stringify(msg));
    })
}

module.exports = {
    get,
    onMessage
}