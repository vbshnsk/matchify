<template>
    <div>
        <h1>Some sample data</h1>
        <h2>Top 10 Genres Over 7 Days</h2>
        <div id="top">
            <li class="flex header">
                <h2> Name </h2>
                <h2> Count </h2>
            </li>
            <li class="flex row" v-for="entry in topTenGenres" v-bind:key="entry.id">
                <h3> {{entry[0]}} </h3>
                <h3> {{entry[1]}} </h3>
            </li>
        </div>
        <h2>Taste Over 7 Days</h2>
        <div id="taste">
            <li class="flex header">
                <h2> Name </h2>
                <h2> Weight </h2>
            </li>
            <li class="flex row" v-for="(weight, genre) in taste" v-bind:key="genre">
                <h3> {{genre}} </h3>
                <h3> {{weight * 100}} </h3>
            </li>
        </div>
    </div>
</template>

<script>
export default {
    async beforeCreate(){
        const endpoint = this.$route.params.username ? this.$route.params.username : 'me';
        try {
            const response = await this.axios.get(process.env.VUE_APP_SERVER + '/profile/' + endpoint + '/statistics', {withCredentials: true});
            this.genres = response.data.genres;
            this.taste = response.data.taste;
        } catch (error) {
            this.$router.push({ path: '/login'});
        }
    },
    data: function(){
        return {
            genres: [],
            taste: null,
        }
    },
    computed:{
        topTenGenres:function(){
            return this.genres.slice(0, 10);
        }
    }
}
</script>

<style>
.flex{
    display: flex;
    justify-content: space-around;
}
.row>*, .header>*{
    flex: 1;
    margin: 0;
    padding: 20px 0;
    border-style: solid;
    border-width: 1px 0 0 1px;
}

.header{
    background-color: darkcyan;
}

.row{
    background-color: darkseagreen;
}

#history, #top, #taste{
    border-style: solid;
    border-width: 0 1px 1px 0;
}
</style>