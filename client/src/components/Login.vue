<template>
    <div class="login-form">
        <form @submit.prevent>
            <input v-model="username" placeholder="Username"><br>
            <input v-model="password" placeholder="Password"><br>
            <input @click="submited()" type="submit">
        </form>
    </div>
</template>

<script>
export default {
    async beforeCreate() {
        const response = (await this.axios.get(process.env.VUE_APP_SERVER + '/login', {withCredentials: true}));
        if(response.data.authorized){
             this.$router.push({path: '/profile'});
        }
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