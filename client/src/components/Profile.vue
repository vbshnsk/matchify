<template>
    <div>
        <h1>this is {{ username }} profile</h1>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    async beforeMount(){
        if(this.$route.params.username){
            this.username = this.$route.params.username + '\'s';
        }
        else {
            const response = await this.axios.get(process.env.VUE_APP_SERVER + '/login', {withCredentials: true});
            if(response.data.authorized) this.username = 'my';
            else this.$router.push('/login')
        }
    },
    data: function() {
        return {
            username: '',
        }
    }
}
</script>