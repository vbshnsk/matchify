<template>
    <h1>logged in to spotify</h1>
</template>

<script>
export default {
    async beforeCreate(){
        const code = this.$route.query.code;
        const response = await this.axios.get('http://localhost:3000/profile/spotify_back?code=' + code, {withCredentials: true});
        console.log(response);
    }
}
</script>