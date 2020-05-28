<template>
    <div id="message">
        <h1 v-html="message"></h1>
    </div>
</template>

<script>
export default {
    async beforeCreate(){
        const code = this.$route.query.code;
        try {
            await this.axios.get(process.env.VUE_APP_SERVER + '/profile/me/spotify_login?code=' + code, {withCredentials: true});
            this.message = 'Success! Check your <a href="/profile"> profile </a> or <a href="/profile/history">history</a>.'
        } catch (error) {
            this.message = 'Something went wrong... <a href="/profile">Go back to profile.</a>'
        }
    },

    data(){
        return{
            message: 'Waiting...'
        }
    }
}
</script>

<style scoped lang="postcss">

#message {
    display: flex;
    flex: 19;
    justify-content: center;
    align-items: center;
    >>> a {
        color: rgb(0, 180, 24);
    }
}
</style>
