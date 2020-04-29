<template>
    <div id="body">
        <h1>Some sample data</h1>
        <h2>Top 10 Genres Over 7 Days</h2>
        <div id="stats">
            <div id="top">
                <li class="flex header">
                    <h2> Name </h2>
                    <h2 class="num"> Count </h2>
                </li>
                <li class="flex row" v-for="entry in topTenGenres" v-bind:key="entry.id">
                    <h3> {{entry[0]}} </h3>
                    <h3 class="num"> {{entry[1]}} </h3>
                </li>
            </div>                
        </div>
        <h2>Taste Over 7 Days</h2>
        <div id="taste">
            <li class="flex header">
                <h2> Name </h2>
                <h2 class="num"> Weight </h2>
            </li>
            <li class="flex row" v-for="(weight, genre) in taste" v-bind:key="genre">
                <h3> {{genre}} </h3>
                <h3 class="num"> {{(weight * 100).toPrecision(3)}} </h3>
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
            const response = await axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + '/statistics', {withCredentials: true});
        next(vm => {
            vm.genres = response.data.genres;
            vm.taste = response.data.taste;
        })
        } catch (error){
            next('/404');
        }
    },
    data: function(){
        return {
            genres: [],
            taste: null,
        }
    },
    computed:{
        topTenGenres: function(){
            return this.genres.slice(0, 10);
        }
    }
}
</script>