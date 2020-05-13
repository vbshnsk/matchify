<template>
    <div class="form-container">
        <h1>Matchify</h1>
        <form @submit.prevent>
            <h2>Login</h2> <br>
            <input class="field" v-model="username" placeholder="Username"><br>
            <input class="field" v-model="password" placeholder="Password" type="password"><br>
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
        height: 30vw;
        justify-content: center;
        align-items: center;
        padding: 2.5vw 1vw;
        h2 {
            font-size: 36px;
            margin: 0;
        }
        .field, button {
            font-size: 18px;
            border-radius: 100px;
        }
        .field {
            width: 18vw;
            min-height: 60px;
        }
        input, select {
            background: rgba(34, 34, 34, 0.575);
            border-radius: 100px;
            outline: none;
            border: none;
            padding: 0 20px;
            color: lavender;
        }
        button{
            width: 14vw;
            min-height: 60px;
            background-color: lavender;
            border: none;
        }
        select.field { 
            width: 20vw;
        }
        hr {
            width: 22vw;
            margin: 2vh;
            border: solid 0.05vh rgba(255, 255, 255, 0.1);
        }
    }
}

</style>