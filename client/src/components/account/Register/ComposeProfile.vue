<template>
    <div class="form-container">
        <form @submit.prevent>
            <h2>Add some information about yourself</h2> <hr>
            <p>all fields are optional</p>
            <div class="flex">
                <div class="col">
                    <textarea id="bio" placeholder="Bio" maxlength="255" v-model="bio"></textarea>
                    <input placeholder="Interests (e.g. 'sports, bass, drums')" class="field" type="text" v-model="interests">
                </div>
                <div class="col">
                    <input placeholder="Display name" class="field" type="text" v-model="displayname">
                    <input placeholder="City" class="field" type="text" v-model="city">
                    <select class="field" v-model="preference">
                        <option disabled selected value="">Preference</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="anyone">Anyone</option>
                    </select>
                    <div>
                        <button @click="upload" id="upload"> Confirm </button> 
                        <button @click="skip" id="skip"> Skip </button> 
                    </div>
                </div>
            </div>
            <hr>
        </form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            bio: "",
            interests: "",
            displayname: "",
            preference: "",
            city: "",
        }
    },
    methods: {
        async upload(){
            const params = {};
            if(this.bio) params["bio"] = this.bio;
            if(this.interests) params["interests"] = this.interestsArr;
            if(this.displayname) params["displayname"] = this.displayname;
            if(this.preference) params["preference"] = this.preference;
            if(this.city) params["city"] = this.city;

            const response = (await this.axios.put(process.env.VUE_APP_SERVER + '/profile/me',
            params,
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
            }));

            if(response.status === 200) {
                this.$router.push('/profile');
            }
        },
        skip() {
            this.$router.push('/profile');
        }
    },
    computed: {
        interestsArr(){
            return this.interests.split(/, |,/)
        }
    }
}
</script>

<style lang="postcss" scoped>
.flex{
    justify-content: space-evenly;
    width: 85%;
}
.col{
    flex-basis: 20vw;
    text-align: center;
}
p {
    margin: 1vh;
}
form {
        width: 60vw;
        height: 55vh;
        textarea {
            height: 18vh;
            width: 18vw;
            resize: none;
            border-radius: 40px;
            padding: 1.2vw;
            font-size: 16px;    
            margin: 1vh 0;
        }
        .field {
            margin: 1vh 0;
        }
        button {
            width: 9vw;
            margin: 1vh 0.5vw;
        }
    }
</style>