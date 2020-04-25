<template>
    <div class="login-form">
        <form @submit="submited">
            <input v-model="username" placeholder="Username"><br>
            <input v-model="password" placeholder="Password"><br>
            <input type="submit">
        </form>
    </div>
</template>

<script>
export default {
    async mounted(){
        const response = (await this.axios.get('http://localhost:3000/login', {withCredentials: true}));
        console.log(response);
    },
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
            const response = (await this.axios.post('http://localhost:3000/login',
            params,
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded '},
                withCredentials: true,
            }));
            console.log(response);
        }
    }
}
</script>