<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
            <div class="flex" id="profile-header">
                <ProfilePhotos v-bind:photos="photos"></ProfilePhotos>
                    <ProfileInfo v-bind="profile"></ProfileInfo>
                    <a v-if="spotify !== 'authorized' && isOwn" v-bind:href="spotify"><button class="green"> Connect to Spotify</button></a>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import ProfilePhotos from './PhotoContainer'
import ProfileInfo from './InfoContainer'
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        let spotify, profile;
        if(to.path === '/profile'){
            spotify = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me/spotify', {withCredentials: true})).data;
            profile = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me', {withCredentials: true})).data.profile; 
            const {profilephotos: photos, ...profileInfo} = profile;
            next(vm => { vm.spotify = spotify; vm.profile = profileInfo; vm.photos = photos })
        }
        else if(to.path === '/profile/spotify' || to.path === '/profile/statistics'
         || to.path === '/profile/history' || to.path === '/profile/match'){
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
            photos: null,
        }  
    },
    computed:{
        isRoot(){
            return this.$route.meta.root;
        },
        isOwn(){
            return !this.$route.params.username || this.$route.params.username === this.$store.state.username;
        },
    },
    components:{
    Header,
    ProfilePhotos,
    ProfileInfo
  },
}
</script>

<style lang="postcss" scoped>

#profile-header {
    padding: 1vw 2vw;
    #info-container {
        flex: 2;
    }
}

#profile {
    height: 100%;
    display: flex;
    flex-direction: column;
}

button {
    height: 6vh;
    width: 12vw;
}

#body >>> {
    padding: 10px;
    padding-left: 30px;
    flex: 19;

    .num {
        text-align: center;
        flex: 2;
    }

    #top, #taste{
        width: 25%;
    }
}
</style>
