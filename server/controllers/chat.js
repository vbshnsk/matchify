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

const onMessage = (to, from, user, match) => {
    from.on('message', async (data) => {
        const msg = await Message.insert(data, user, match);
        if(to) to.send(JSON.stringify(msg));
        from.send(JSON.stringify(msg));
    })
}

module.exports = {
    get,
    onMessage
}