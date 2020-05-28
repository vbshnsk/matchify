<template>
    <div id="chat">
        <div id="messages">
            <div class="message" 
            v-for="message in messages" 
            :key="message.id" 
            :class="{sent: receiver === message.receiver}">
                <h4 class="green"> {{ message.sender }} </h4>
                <p>{{ message.message }}</p>
            </div>
        </div>
        <div id="input-field">
            <textarea id="bio" placeholder="Message" maxlength="255" v-model="message"></textarea>
            <button class="green" 
            @click="socket.send(JSON.stringify({message, receiver}));
            message = ''">Send</button>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        receiver: String,
        socket: WebSocket,
    },
    data(){
        return {
            messages: [],
            message: undefined,
        }
    },
    async created(){
        this.socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            if(message.sender === this.receiver || message.receiver === this.receiver){
                this.messages.unshift(JSON.parse(e.data));
            }
            this.$emit('message', message)
        }
        const response = (await this.axios.get(process.env.VUE_APP_SERVER + `/profile/me/chat?match=${this.receiver}`, 
        {
            withCredentials: true,
        }));
        this.messages = response.data;
    },
    watch: {
        receiver: async function(){
            this.messages = [];
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
            background-color: #0f0f0f;
            width: 30vw;
            padding: 3vh;
            border-radius: 4vw;
            word-wrap: break-word;
            p, h4 {
                margin: 0;
                margin-bottom: 0.5vh;
            }
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
            background-color: rgba(34, 34, 34, 0.575);
            padding: 2vh 1.2vw;
            margin: 0 0.5vw;
        }
        button{
            flex: 1;
            height: 70%;
            margin: 0 0.5vw;
            place-self: center;
        }
    }
}
</style>