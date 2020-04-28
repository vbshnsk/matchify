<template>
    <h1>Logout</h1>
</template>

<script>
import axios from 'axios'
export default {
    async beforeRouteEnter(to, from, next){
        await axios.get('http://localhost:3000/logout', {withCredentials: true});
        next('/login');
    }
}
</script>