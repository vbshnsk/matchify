<template>
    <div class="form-container">
        <h1>Matchify</h1>
        <form @submit.prevent>
            <h2>Register</h2> <br>
            <input v-model="username" placeholder="Username"> <br>
            <input v-model="email" placeholder="Email"> <br>
            <input v-model="password" type="password" placeholder="Password"> <br>
            <button @click="submited()"> Register </button>
            <h3>Already have an account? <a href="/login"> Login </a></h3>
        </form>
    </div>
</template>

<script>
export default {
    data: function(){
        return{
            username: '',
            password: '',
            email: '',
        }
    },
    methods:{
        async submited(){
            const params = new URLSearchParams();
            params.append('username', this.username);
            params.append('password', this.password);
            params.append('email', this.email);
            const response = (await this.axios.post(process.env.VUE_APP_SERVER + '/register',
            params,
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded '},
                withCredentials: true,
            }));
            if(response.status === 200){
                this.$router.push({ path: '/profile' })
            }
            
        }
    }
}
</script>

<style>

</style>