<template>
    <div id="current-profile">
        <div id="profile">
            <Photos v-bind:photos="info.photos"></Photos>
            <Info v-bind="info.info"></Info>
            <div id="buttons"> 
                <button class="green" @click="makeMatch"> Like </button>
                <button class="skip" @click="ditch"> Skip </button>
            </div>
        </div>
        <div id="stats">
            <h4> Taste </h4>
            <BarChart 
             v-bind:chartData="tasteData"
             :styles="{position: 'relative', width: '100%', height: '23vh'}">
             </BarChart>
            <h4> Genres </h4>
            <BarChart
              v-bind:chartData="genreData"
              :styles="{position: 'relative', width: '100%', height: '23vh'}"></BarChart>
            <h4> Last played tracks </h4>
            <div id="history">
                <List 
                :data="match.plays"
                :labels="['Artists', 'Name']"></List>
            </div>                    
        </div>
    </div>
</template>

<script>
import Photos from '../PhotoContainer'
import Info from '../InfoContainer'
import BarChart from '../Charts/Bar'
import List from '../Charts/List'

export default {
    props: {
        match: Object,
    },
    computed: {
        info() {
            const {profilephotos, topGenres, taste, plays, ...info} = this.match;
            return {photos: profilephotos, info: info, genres: topGenres, taste: taste, plays: plays};
        },
        tasteData() {
            return {
                datasets: [{
                    data: Object.values(this.info.taste).sort((a, b) => b - a).slice(0, 5).map(v => v.toFixed(2)),
                    backgroundColor: this.calcColors,
                    barPercentage: 0.7,
                }],
                labels: Object.keys(this.info.taste).sort((a, b) => this.info.taste[b] - this.info.taste[a]).slice(0, 5),
            };
        },
        genreData() {
            return this.info.genres ? {
                datasets: [{
                    data: this.info.genres.map(v => v[1]),
                    barPercentage: 0.85,
                }],
                labels: this.info.genres.map(v => v[0]),
            } : undefined;
        }
    },
    methods: {
        async makeMatch() {
            const res = await this.axios.put(process.env.VUE_APP_SERVER + '/profile/me/matches',
            { match: this.match.username },
            {
                withCredentials: true,
            });
            if(res.status === 200){
                this.$emit('next');
                if(res.data) this.$emit('match', { match: this.match.username });
            }
        },
        async ditch() {
            const res = await this.axios.put(process.env.VUE_APP_SERVER + '/profile/me/ditches',
            { ditch: this.match.username },
            {
                withCredentials: true,
            });
            if(res.status === 200){
                this.$emit('next');
            }
        }
    },
    components: {
        Photos,
        Info,
        BarChart,
        List,
    }
}
</script>

<style lang="postcss" scoped>
    #stats{
        display: flex;
        flex-direction: column;
        flex-basis: 35%;
        h4 {
            width: 100%;
            text-align: center;
            font-size: 16px;
            margin: 1.5vh 0;
        }
    }
    #history {
        .flex {
            display: flex;
            padding: 0 1vw;
        }
        h3 {
            font-weight: 400;
            font-size: 16px;
            flex: 1;
            margin: 1.5vh 0;
        }
        hr {
            margin-top: 0;
            margin-bottom: 0;
            border: solid 0.05vh rgba(255, 255, 255, 0.1);
        }
    }
    #current-profile {
        display: flex;
        justify-content: space-evenly;
    }
    #profile {
        display: flex;
        flex-direction: column;
        flex-basis: 35%;
        justify-content: space-evenly;
    }
    #buttons{
        text-align: center;
        display: flex;
        justify-content: space-evenly;
    }
    button {
        width: 12vw;
        height: 6vh;
        margin: 1vw;
    }
</style>