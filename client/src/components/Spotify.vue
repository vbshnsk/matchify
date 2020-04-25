<template>
    <a v-bind:href="spotify"> 
        <button> Auth to Spotify </button>
    </a>
</template>

<script>
export default {
    async beforeCreate(){
        this.spotify = (await this.axios.get('http://localhost:3000/profile/spotify')).data;
        console.log(this.spotify)
    },
    data: function(){
        return {
            spotify: ''
        }
    }
}
</script>