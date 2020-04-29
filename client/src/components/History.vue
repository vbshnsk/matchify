<template>
    <div id="body">
        <h2>Recent history:</h2>
        <div id="history">
            <li class="flex header">
                <h2> Track </h2>
                <h2> Artists </h2>
                <h2> Genres </h2>
            </li>
            <li class="flex row" v-for="play in history" v-bind:key="play.id">
                <h3> {{play.artists.join(',')}} </h3>
                <h3> {{play.name}} </h3>
                <h3> {{play.genres.join(',')}} </h3>
            </li>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        const endpoint = to.params.username ? to.params.username : 'me';
        try{
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + '/history', {withCredentials: true});
        next(vm => {
            vm.history = response.data.history;
        })
        } catch (error){
            next('/404');
        }
    },
    data(){
        return {
            history: [],
        }
    }
}
</script>