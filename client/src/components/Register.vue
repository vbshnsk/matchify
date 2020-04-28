<template>
    <div class="login-form">
        <form @submit="submited">
            <input v-model="username" placeholder="Username"> <br>
            <input v-model="email" placeholder="Email"> <br>
            <input v-model="password" type="password" placeholder="Password"> <br>
            <input type="submit">
        </form>
    </div>
</template>

<script>
export default {
    async beforeCreate() {
        const response = (await this.axios.get('http://localhost:3000/login', {withCredentials: true}));
        if(response.data.authorized){
            this.$router.push({path: '/profile'});
        }
    },
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
            const response = (await this.axios.post('http://localhost:3000/register',
            params,
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded '},
                withCredentials: true,
            }));
            if(response.status === 200){
                this.$router.push({ path: '/statistics' })
            }
            
        }
    }
}
</script>