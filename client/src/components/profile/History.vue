<template>
    <div id="body">
        <List 
        :data="historyRows"
        :labels="['Artists', 'Track', 'Genres']"></List>
        <div id="nav">
            <button class="green" @click="prev" :hidden="page === 1"> &lt; </button>
            <div id="pages">
                <h3 :hidden="page === 1" @click="goto(prevPage)"> {{ prevPage }} </h3>
                <h3> {{ page }} </h3>
                <h3 :hidden="page === max || max === nextPage" @click="goto(nextPage)"> {{ nextPage }}</h3>
                <h4 :hidden="nextPage === max || page === max"> ... </h4>
                <h3 :hidden="page === max" @click="goto(max)"> {{ max }} </h3>
            </div>
            <button class="green" @click="next" :hidden="page === max"> > </button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import List from './Charts/List'

export default {
    async beforeRouteEnter(to, from, next){
        const endpoint = to.params.username ? to.params.username : 'me';
        try{
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + '/history', {withCredentials: true});
        next(vm => {
            vm.history = response.data.history.slice(0, 15);
            vm.max = Math.ceil(response.data.history.length / 15);
        })
        } catch (error){
            next('/404');
        }
    },
    data(){
        return {
            history: [],
            page: 1,
            max: 0,
        }
    },
    methods: {
        async prev(){
            const endpoint = this.$route.params.username ? this.$route.params.username : 'me';
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + `/history?page=${this.prevPage}`, {withCredentials: true});
            if(response.status === 200) {
                this.history = response.data.history;
                this.page = this.prevPage;
            }
        },
        async next() {
            const endpoint = this.$route.params.username ? this.$route.params.username : 'me';
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + `/history?page=${this.nextPage}`, {withCredentials: true});
            if(response.status === 200) {
                this.history = response.data.history;
                this.page = this.nextPage;
            }
        },
        async goto(page) {
            const endpoint = this.$route.params.username ? this.$route.params.username : 'me';
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + `/history?page=${page}`, {withCredentials: true});
            if(response.status === 200) {
                this.history = response.data.history;
                this.page = page;
            }
        }
    },
    computed: {
        historyRows() {
            return this.history.map(v => { 
                return {
                    artists: v.artists,
                    track: v.name,
                    genres: v.genres,
                }
            })
        },
        prevPage() {
            return this.page - 1;
        },
        nextPage() {
            return this.page + 1;
        }
    },
    components: {
        List,
    }
}
</script>

<style lang="postcss" scoped> 
    #body {
        margin: 0 2vw;
        height: 100%;
        justify-content: space-between;
        #nav{
            margin-bottom: 3vh;
            display: flex;
            justify-content: center;
            button {
                width: 2.5vw;
                height: 2.5vw;
                font-size: 28px;
            }
            #pages {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-basis: 8%;
                h3 {
                    margin: 0 0.2vw;
                    cursor: pointer;
                }
                h3:hover {
                    color: rgb(6, 165, 27);
                }
                h4 {
                    margin: 0 0.2vw;
                }
            }
        }
    }
</style>