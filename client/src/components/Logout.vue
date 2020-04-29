<template>
    <h1>Logout</h1>
</template>

<script>
import axios from 'axios'
export default {
    async beforeRouteEnter(to, from, next){
        await axios.get(process.env.VUE_APP_SERVER + '/logout', {withCredentials: true});
        next('/login');
    }
}
</script>