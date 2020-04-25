<template>
    <div>
        <h1>Some sample data</h1>
        <h2>Listening History</h2>
        <div id="history">
            <li class="flex header">
                <h2> Artists </h2>
                <h2> Track </h2>
                <h2> Genres </h2>
            </li>
            <li class="flex row" v-for="play in history" v-bind:key="play.id">
                <h3> {{play.artists.join(', ')}} </h3>
                <h3> {{play.name}} </h3>
                <h4> {{play.genres.join(', ')}} </h4>
            </li>
        </div>
        <h2>Top 10 Genres</h2>
        <div id="top">
            <li class="flex header">
                <h2> Name </h2>
                <h2> Count </h2>
            </li>
            <li class="flex row" v-for="entry in top.slice(0, 10)" v-bind:key="entry.id">
                <h3> {{entry[0]}} </h3>
                <h3> {{entry[1]}} </h3>
            </li>
        </div>
        <h2>Taste</h2>
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
    async mounted(){
        const response = await this.axios.get('http://localhost:3000/profile/statistics', {withCredentials: true});
        this.history = response.data.history;
        this.top = response.data.genres;
        this.taste = response.data.taste;
    },
    data: function(){
        return {
            history: null,
            top: null,
            taste: null,
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