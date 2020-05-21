<template>
    <div id="info-container">
        <h1> {{ displayname }}</h1>
        <h3> @{{ username }} </h3>
        <h3> {{ age }}, {{ gender }} </h3>
        <h3> {{ city }} </h3>
        <p> {{ bio }} </p>
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