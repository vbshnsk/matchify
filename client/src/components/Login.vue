<template>
    <div class="form-container">
        <h1>Matchify</h1>
        <form @submit.prevent>
            <h2>Login</h2> <br>
            <input v-model="username" placeholder="Username"><br>
            <input v-model="password" placeholder="Password"><br>
            <button @click="submited()"> Login </button>
            <h3>Don't have an account? <a href="/register"> Register </a></h3>
        </form>
    </div>
</template>

<script>
export default {
    data: function(){
        return{
            username: '',
            password: '',
        }
    },
    methods:{
        async submited(){
            const params = new URLSearchParams();
            params.append('username', this.username);
            params.append('password', this.password);
            const response = (await this.axios.post(process.env.VUE_APP_SERVER + '/login',
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

<style lang="postcss">

.form-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    align-items: center;
    //color: rgb(0, 180, 24);
    a {
        color: rgb(0, 180, 24);
    }
    h1 {
        font-size: 48px;
    }
    form {
        display: flex;
        flex-direction: column;
        background-color: #111111;
        width: 25vw ;
        height: 27vw;
        justify-content: center;
        align-items: center;
        h2 {
            font-size: 36px;
            margin: 0;
        }
        input, button {
            font-size: 18px;
            border: none;
            border-radius: 100px;
        }
        input {
            width: 70%;
            height: 70px;
            background: rgba(34, 34, 34, 0.575);
            border-radius: 100px;
            outline: none;
            padding: 0 20px;
            color: lavender;
        }
        button {
            width: 45%;
            height: 60px;
            background-color: lavender;
        }
    }
}

</style>