<template>
    <h1>Logout</h1>
</template>

<script>
export default {
    async beforeCreate(){
        const response = await this.axios.get('http://localhost:3000/logout', {withCredentials: true});
        console.log(response);
        this.$router.push({path: '/login'});
    }
}
</script>