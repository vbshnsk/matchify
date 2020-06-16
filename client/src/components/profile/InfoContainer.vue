<template>
    <div id="info-container">
        <h1> {{ displayname }}</h1>
        <h3> @{{ username }} </h3>
        <h3> {{ age }}, {{ gender }} </h3>
        <h3> {{ city }} </h3>
        <p> {{ bio }} </p>
        <a v-if="spotify === 'authorized'"><button class="skip" disabled> Connected to Spotify</button></a>
        <a v-else-if="spotify" v-bind:href="spotify"><button class="green"> Connect to Spotify</button></a>
    </div>
</template>

<script>
export default {
    props:{
        displayname: String,
        username: String,
        gender: String,
        city: String,
        bio: String,
        birthdate: String,
        spotify: String,
    },
    computed: {
        age() {
            const dob = new Date(this.birthdate);
            const diff = Date.now() - dob.getTime();
            const age = new Date(diff);

            return Math.abs(age.getUTCFullYear() - 1970);
        },
    }
}
</script>

<style lang="postcss" scoped>
p{
    word-wrap: break-word;
    max-width: 100%;
}
button {
    height: 5vh;
    width: 12vw;
}
</style>