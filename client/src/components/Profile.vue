<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
            <div class="flex" id="profile-header">
                <div id="photo-container">
                    <template v-if="profile.profilephotos">
                        <img id="current"
                            :src="currentPhoto"
                            @click="index = prevIndex">
                        <img id="next"
                            v-if="profile.profilephotos.length != 1"
                            :src="nextPhoto" 
                            @click="index = nextIndex">
                        <img id = "next" v-else src="/ph.png">
                    </template>
                    <img v-else src="/ph.png">
                </div>
                <div id="info-container">
                    <h2> @{{ profile.username }} </h2>
                    <h3> {{ age }}, {{ profile.gender }} </h3>
                    <h3> {{ profile.city }} </h3>
                    <h1 v-if="spotify === 'authorized'"> You're authorized to spotify! </h1>
                    <h1 v-else>To login to Spotify follow the link: <a v-bind:href="spotify">link</a></h1>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        let spotify, profile;
        if(to.path === '/profile'){
            spotify = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me/spotify', {withCredentials: true})).data;
            profile = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me', {withCredentials: true})).data.profile; 
            next(vm => { vm.spotify = spotify; vm.profile = profile; })
        }
        else if(to.path === '/profile/spotify' || to.path === '/profile/statistics' || to.path === '/profile/history'){
            next();
        }
        else {
            profile = (await axios.get(process.env.VUE_APP_SERVER + to.path, {withCredentials: true})).data.profile; 
            next(vm => { vm.spotify = spotify; vm.profile = profile; })

        }
    },
    data: function() {
        return {
            spotify: false,
            profile: null,
            index: 0, 
        }  
    },
    computed:{
        isRoot(){
            return this.$route.meta.root;
        },
        isOwn(){
            return !this.$route.params.username || this.$route.params.username === this.$store.state.username;
        },
        age() {
            const dob = new Date(this.profile.birthdate);
            const diff = Date.now() - dob.getTime();
            const age = new Date(diff);

            return Math.abs(age.getUTCFullYear() - 1970);
        },
        currentPhoto() {
            return "https://matchify.s3.eu-central-1.amazonaws.com/" + this.profile.profilephotos[this.index]
        },
        nextIndex() {
            return (this.index + 1) % this.profile.profilephotos.length;
        },
        prevIndex() {
            return ((this.index - 1) + this.profile.profilephotos.length) % this.profile.profilephotos.length;
        },
        nextPhoto() {
            return "https://matchify.s3.eu-central-1.amazonaws.com/" + this.profile.profilephotos[this.nextIndex];
        },

    },
    components:{
    Header,
  },
}
</script>

<style lang="postcss" scoped>

#profile-header {
    padding: 1vw 2vw;
    #photo-container {
        flex: 1;
        text-align: center;
        img {
            width: 18vw;
            height: 24vw;
            border-radius: 20px;
            position: relative;
            z-index: 10;
        }
        #next{
            opacity: 0.5;
            background-color: black;
            z-index: 0;
            margin-left: -16vw;
            margin-bottom: -1.5vw;
        }
    }
    #info-container {
        flex: 2;
    }
}

#profile {
    height: 100%;
}

#body >>> {
    padding: 10px;
    padding-left: 30px;
    .flex{
        display: flex;
        justify-content: space-around;
    }

    .row>*, .header>*{
        flex: 4;
        margin: 0;
        padding: 10px 20px;
        border-bottom: rgba(230, 230, 250, 0.575) solid 0.5px;
    }

    .header{
        font-size: 12px;
        h2{
         font-weight: 600;
        }
    }

    .row{
        font-size: 14px;
        h3{
         font-weight: 400;
        }
    }

    .num {
        text-align: center;
        flex: 2;
    }

    #top, #taste{
        width: 25%;
    }
}
</style>
