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
             :styles="{position: 'relative', width: '30vw', height: '23vh'}">
             </BarChart>
            <h4> Genres </h4>
            <BarChart
              v-bind:chartData="genreData"
              :styles="{position: 'relative', width: '30vw', height: '23vh'}"></BarChart>
            <h4> Last played tracks </h4>
            <div id="history">
                <template v-for="play in info.plays" >
                    <hr v-bind:key="play.id">
                    <li class="flex" v-bind:key="play.id">
                        <h3> {{play.artists.join(', ')}} </h3>
                        <h3> {{play.name}} </h3>
                    </li>
                </template>
            </div>                    
        </div>
    </div>
</template>

<script>
import Photos from '../PhotoContainer'
import Info from '../InfoContainer'
import BarChart from '../Charts/Bar'

export default {
    props: {
        match: Object,
    },
    computed: {
        info() {
            const {profilephotos, topGenres, taste, plays, ...info} = this.match;
            return {photos: profilephotos, info: info, genres: topGenres, taste: taste, plays: plays.slice(0, 5)};
        },
        tasteData() {
            return {
                datasets: [{
                    data: Object.values(this.info.taste).map(v => (v * 100).toPrecision(4)).slice(0, 5).sort((a, b) => b - a),
                    barThickness: 'flex',
                }],
                labels: Object.keys(this.info.taste).slice(0, 5).sort((a, b) => this.info.taste[b] - this.info.taste[a]),
            };
        },
        genreData() {
            return this.info.genres ? {
                datasets: [{
                    data: this.info.genres.map(v => v[1]),
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
    }
}
</script>

<style lang="postcss" scoped>
    #stats{
        padding: 0 5vw;
        display: flex;
        flex-direction: column;
        h4 {
            width: 100%;
            text-align: center;
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
        padding: 1vw 10vw;
        display: flex;
    }
    #profile {
        display: flex;
        flex-direction: column;
        flex: 1;
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