<template>
    <div id="chat">
        <div id="messages">
            <div class="message" 
            v-for="message in messages" 
            :key="message.id" 
            :class="{sent: receiver === message.receiver}">
                <p>{{ message.message }}</p>
            </div>
        </div>
        <div id="input-field">
            <textarea id="bio" placeholder="Message" maxlength="255" v-model="message"></textarea>
            <button class="green" @click="socket.send(message); message = ''">Send</button>
        </div>
    </div>
</template>

<script>

export default {
    beforeUpdate(){
        console.log
    },
    props: {
        receiver: String
    },
    data(){
        return {
            messages: [],
            message: undefined,
            socket: null,
        }
    },
    methods: {
        mountSocket(){
            if(this.socket) this.socket.close();
            this.socket = new WebSocket(process.env.VUE_APP_CHAT + '?receiver=' + this.receiver);
            this.socket.onmessage = (e) => {
                this.messages.unshift(JSON.parse(e.data));
            }
        }
    },
    async created(){
        this.mountSocket();
        const response = (await this.axios.get(process.env.VUE_APP_SERVER + `/profile/me/chat?match=${this.receiver}`, 
        {
            withCredentials: true,
        }));
        this.messages = response.data;
    },
    watch: {
        receiver: async function(){
            this.messages = [];
            this.mountSocket();
            const response = (await this.axios.get(process.env.VUE_APP_SERVER + `/profile/me/chat?match=${this.receiver}`, 
            {
                withCredentials: true,
            }));
            this.messages = response.data;
        }
    }
}
</script>

<style lang="postcss" scoped>
#chat {
    background-color: #131212;
    width: 70vw;
    height: 80vh;
    margin: 7vh 0 0 4.5vw;
    display: flex;
    flex-direction: column;
    #messages {
        flex: 11;
        height: 0;
        overflow-y: scroll;
        display: flex;
        flex-direction: column-reverse;
        .message{
            margin: 1vh;
            background-color: black;
            width: 30vw;
            padding: 1vh;
            border-radius: 4vw;
            word-wrap: break-word;
        }
        .sent {
            place-self: flex-end;
        }
    }
    #messages::-webkit-scrollbar {
        background: none;
    }
    #messages::-webkit-scrollbar-track {
        background: none;
    }
    #input-field {
        margin: 1vh;
        flex: 2;
        display: flex;
        textarea{
            flex: 9;
            border-radius: 4vw;
            resize: none;
            background-color: lavender;
            padding: 2vh 1.2vw;
            margin: 0 0.5vw;
        }
        button{
            flex: 1;
            height: 50%;
            margin: 0 0.5vw;
            place-self: center;
        }
    }
}
</style>