<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
            <div class="flex" id="profile-header">
                <ProfilePhotos v-bind:photos="photos" v-bind:height="'20vw'" v-bind:width="'15vw'"></ProfilePhotos>
                <ProfileInfo v-bind="profile" :spotify="spotify"></ProfileInfo>
                <div class="chart">
                    <h3>Taste <a class="edit green" v-if="isOwn && !tasteEdit" @click="tasteEdit = !tasteEdit"> edit </a></h3>
                    <TasteEditor v-if="tasteEdit" v-on:end="tasteEdit = !tasteEdit" v-bind:taste="taste"></TasteEditor>
                    <Bar v-else :styles="{ position: 'relative', height: '90%', width: '100%' }" :chartData="tasteData"></Bar>
                </div>
            </div>
            <div class="flex" id="profile-stats">
            </div>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import ProfilePhotos from './PhotoContainer'
import ProfileInfo from './InfoContainer'
import Bar from './Charts/Bar'
import TasteEditor from './TasteEditor'
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        let spotify, profile;
        if(to.path === '/profile'){
            spotify = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me/spotify', {withCredentials: true})).data;
            profile = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me', {withCredentials: true})).data.profile; 
            const {profilephotos: photos, taste: taste, topGenres, ...profileInfo} = profile;
            next(vm => { vm.spotify = spotify; vm.profile = profileInfo; vm.photos = photos; vm.taste = taste; vm.topGenres = topGenres })
        }
        else if(to.path === '/profile/spotify' || to.path === '/profile/history' || to.path === '/profile/match'){
            next();
        }
        else {
            profile = (await axios.get(process.env.VUE_APP_SERVER + to.path, {withCredentials: true})).data.profile; 
            const {profilephotos: photos, taste: taste, topGenres, ...profileInfo} = profile;
            next(vm => { vm.profile = profileInfo; vm.photos = photos; vm.taste = taste; vm.topGenres = topGenres })
        }
    },
    data: function() {
        return {
            spotify: undefined,
            profile: {},
            taste: {},
            topGenres: {},
            photos: null,
            tasteEdit: false,
        }  
    },
    computed:{
        isRoot(){
            return this.$route.meta.root;
        },
        isOwn(){
            return !this.$route.params.username || this.$route.params.username === this.$store.state.username;
        },
        tasteData() {
            return {
                datasets: [{
                    data: Object.values(this.taste).sort((a, b) => b - a),
                    barPercentage: 0.7,
                }],
                labels: Object.keys(this.taste).sort((a, b) => this.taste[b] - this.taste[a]),
            };
        },
        genreData() {
            return this.topGenres ? {
                datasets: [{
                    data: this.topGenres.slice(0, 20).map(v => v[1]),
                    barPercentage: 0.85,
                }],
                labels: this.topGenres.slice(0, 20).map(v => v[0]),
            } : undefined;
        }
    },
    components:{
    Header,
    ProfilePhotos,
    ProfileInfo,
    Bar,
    TasteEditor,
  },
}
</script>

<style lang="postcss" scoped>

#body {
    display: flex;
    flex-direction: column;
    flex: 19;
    height: 0;
}

.chart {
    flex-basis: 30%;
}

.edit {
    font-size: 13px;
    font-weight: 400;
    text-decoration-line:underline;
    cursor: pointer;
}


#profile-stats {
    flex: 1;
    height: 0;
    display: flex;
    justify-content: space-evenly;
}

#profile-header {
    padding: 1vw 0;
    flex: 1;
    justify-content: space-around;
    height: 0;
    #photo-container {
        flex-basis: 15%;
    }
    #info-container {
        width: 40vw;
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
</style>
