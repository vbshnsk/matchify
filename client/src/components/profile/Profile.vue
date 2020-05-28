<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
            <div class="flex" id="profile-header">
                <ProfilePhotos v-bind:photos="photos" v-bind:height="'20vw'" v-bind:width="'15vw'"></ProfilePhotos>
                <ProfileInfo v-bind="profile" :spotify="spotify"></ProfileInfo>
                <div class="chart">
                    <h3>Taste 
                        <a class="edit green" v-if="isOwn && !tasteEdit" @click="tasteEdit = !tasteEdit"> edit </a>
                        <a class="edit green" v-if="isOwn && !tasteEdit && spotify === 'authorized'" @click="sync"> sync </a>
                    </h3>
                    <TasteEditor v-if="tasteEdit" v-on:end="tasteEdit = !tasteEdit" v-bind:taste="taste"></TasteEditor>
                    <Bar v-else :styles="{ position: 'relative', height: '90%', width: '100%' }" :chartData="tasteData"></Bar>
                </div>
            </div>
            <hr>
            <div v-if="spotify === 'authorized'" class="flex" id="profile-stats">
                <div class="chart">
                    <h3>Top artists last 7 days</h3>
                    <List
                        :data="stats.artists.slice(0, 5)"
                        :labels="['Artist', 'Count']"
                    ></List>
                </div>
                <div class="chart">
                    <h3>Top tracks last 7 days</h3>
                    <List
                        :data="stats.tracks.slice(0, 5)"
                        :labels="['Track', 'Count']"
                    ></List>
                </div>
                <div class="chart">
                    <h3>Top genres last 7 days</h3>
                    <Bar :styles="{ position: 'relative', height: '90%', width: '100%' }" :chartData="genreData"></Bar>
                </div>
            </div>
            <div v-else id="connect">
                <h1> Connect to Spotify to see more stats! </h1>
            </div>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import ProfilePhotos from './PhotoContainer'
import ProfileInfo from './InfoContainer'
import Bar from './Charts/Bar'
import List from './Charts/List'
import TasteEditor from './TasteEditor'
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        let spotify, profile;
        if(to.path === '/profile'){
            spotify = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me/spotify', {withCredentials: true})).data;
            profile = (await axios.get(process.env.VUE_APP_SERVER + '/profile/me', {withCredentials: true})).data.profile; 
            const {profilephotos: photos, taste: taste, stats, ...profileInfo} = profile;
            next(vm => { vm.spotify = spotify; vm.profile = profileInfo; vm.photos = photos; vm.taste = taste; vm.stats = stats })
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
            stats: {},
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
                    data: Object.values(this.taste).sort((a, b) => b - a).map(v => v.toFixed(2)),
                    barPercentage: 0.7,
                }],
                labels: Object.keys(this.taste).sort((a, b) => this.taste[b] - this.taste[a]),
            };
        },
        genreData() {
            return this.stats.genres ? {
                datasets: [{
                    data: this.stats.genres.slice(0, 15).map(v => v[1]),
                    barPercentage: 0.85,
                }],
                labels: this.stats.genres.slice(0, 15).map(v => v[0]),
            } : undefined;
        }
    },
    methods:{
        async sync(){
            const response = await this.axios.put(process.env.VUE_APP_SERVER + '/profile/me/statistics',
            { sync: true },
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
            });
            if(response.status === 200){
                this.taste = response.data.taste;
            }
        }
    },
    components:{
        Header,
        ProfilePhotos,
        ProfileInfo,
        Bar,
        List,
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
    cursor: pointer;
}


#profile-stats, #connect {
    flex: 1;
    height: 0;
    display: flex;
    justify-content: space-evenly;
    padding: 1;
    h3{
        margin: 1vh;
    }
}

#profile-header {
    padding: 1vw 0;
    flex: 1;
    justify-content: space-evenly;
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

hr {
    width: 90%;
    border: solid 0.05vh rgba(255, 255, 255, 0.1);
}
</style>
