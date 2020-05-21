<template>
    <div id="main-frame">
        <div id="sidebar">
            <div id="match-button-field">
                <button class="green" @click="getClosestMatches"> MATCHING </button>
            </div>
            <hr>
            <h3>Messages</h3>
            <div id="matches-field">
                <div v-for="match in matches" v-bind:key="match.username" class="match">
                    <div class="thumbnail-pic-container">
                        <div class="thumbnail-pic" 
                        v-bind:style="{ 'background-image': `url(${match.profilephotos ?'https://matchify.s3.eu-central-1.amazonaws.com/' + match.profilephotos[0] : '/ph.png'})` }"></div>
                    </div>
                    <div class="message-preview">
                        <h4 class="username">{{ match.match }}</h4>
                        <p calss="message-text-preview"> New match! </p>
                    </div>
                </div>
            </div>
        </div>
        <div id="mainbar">
            <Matching
             v-if="mainbar === 'matching'" 
             v-bind:match="closestMatches[0]" 
             v-on:next="closestMatches.shift()"
             v-on:match="addMatch">
            </Matching>
            <Chat v-else-if="mainbar === 'chat'"></Chat>
        </div>
    </div>
</template>

<script>
import Chat from './Chat'
import Matching from './Matching'


export default {
    data() {
        return {
            mainbar: '',
            matchesLoading: false,
            closestMatches: [],
            matches: [],
        }
    },
    methods:{
        async getClosestMatches() {
            if(this.closestMatches.length === 0){
                const res = (await this.axios.get(process.env.VUE_APP_SERVER + '/profile/me/closestmatches',
                {
                    withCredentials: true,
                }));
                this.mainbar = 'matching'
                this.closestMatches = res.data;
            }
        },
        addMatch(value) {
            this.matches.unshift(value);
        } 
    },
    async beforeCreate(){
        this.matches = (await this.axios.get(process.env.VUE_APP_SERVER + '/profile/me/matches',
        {
            withCredentials: true,
        })).data;
    },
    components: {
        Chat,
        Matching,
    }
}
</script>

<style lang="postcss" scoped>

#main-frame{
    flex: 19;
    display: flex;
}

hr {
 margin-top: 0;
 margin-bottom: 0;
 border: solid 0.05vh rgba(255, 255, 255, 0.1);
}

#mainbar{
    width: 79vw;
}

#sidebar {
    width: 21vw;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #131212;
    h3{
        margin-left: 1vw;
        margin-bottom: 0;
    }
    #match-button-field {
        padding: 3vh 0;
        text-align: center;
        button {
            width: 80%;
            height: 6vh;
        }
    }
    #matches-field {
        padding: 2vh 0;
        flex: 1 1 auto;
        height: 0;
        overflow-y: scroll;
        .match {
            display: flex;
            margin: 1vh 1vw;
            .thumbnail-pic-container {
                flex: 1;
                .thumbnail-pic {
                    width: 4vw;
                    height: 4vw;
                    border-radius: 4vw;
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
            }
            .message-preview {
                flex: 4;
                margin: 1.5vh 0.5vw;
                h4 {
                    margin: 0;
                }
                p {
                    margin: 0.5vh 0;
                }
            }
        }
    }
}
</style>