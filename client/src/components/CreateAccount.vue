<template>
    <div class="form-container">
        <h1>Matchify</h1>
        <form @submit.prevent>
            <h2>Create account</h2> <hr>
            <input class="field" v-model="username" placeholder="Username"> <br>
            <input class="field" v-model="email" placeholder="Email"> <br>
            <input class="field" v-model="password" type="password" placeholder="Password"> <br>
            <select class="field" v-model="gender" required>
                <option disabled selected value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
            </select> <br>
            <div class="field" id="dob">
                <input type="text" v-model="day" placeholder="Date">
                <select class="field" v-model="month" required>
                    <option disabled selected value="" style="color: grey;">Month</option>
                    <option value="january">January</option>
                    <option value="february">February</option>
                    <option value="march">March</option>
                    <option value="april">April</option>
                    <option value="may">May</option>
                    <option value="june">June</option>
                    <option value="july">July</option>
                    <option value="august">August</option>
                    <option value="september">September</option>
                    <option value="october">October</option>
                    <option value="november">November</option>
                    <option value="december">December</option>
                </select>
                <input type="text" v-model="year" placeholder="Year">
            </div>
            <hr>
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
            gender: '',
            day: '',
            month: '',
            year: '',
            alert: false,
        }
    },
    methods:{
        async submited(){
            const params = new URLSearchParams();
            params.append('username', this.username);
            params.append('password', this.password);
            params.append('email', this.email);
            params.append('birthdate', `${this.day}-${this.month}-${this.year}`);
            params.append('gender', this.gender);
            const response = (await this.axios.post(process.env.VUE_APP_SERVER + '/register',
            params,
            {
                headers: {'Content-Type': 'application/x-www-form-urlencoded '},
                withCredentials: true,
            }));
            if(response.status === 200){
                this.$emit('success');
            }
            else {
                this.alert = true;
            }
            
        }
    },
}
</script>

<style lang="postcss" scoped>
#dob {
    display: flex;
    width: 20vw;
    input {
        text-align: center;
        font-size: 18px;
        width: 30%;
    }
    select {
        margin: 0 .7vw
    }
}
</style>