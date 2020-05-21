<template>
    <div id="photo-container">
        <template v-if="photos">
            <img id="current"
                :src="currentPhoto"
                @click="index = prevIndex">
            <img id="next"
                v-if="photos.length != 1"
                :src="nextPhoto" 
                @click="index = nextIndex">
            <img id = "next" v-else src="/ph.png">
        </template>
        <img v-else src="/ph.png">
    </div>
</template>

<script>
export default {
    data(){
        return {
            index: 0, 
        }
    },
    props: {
        photos: Array,
    },
    computed: {
        currentPhoto() {
            return "https://matchify.s3.eu-central-1.amazonaws.com/" + this.photos[this.index]
        },
        nextIndex() {
            return (this.index + 1) % this.photos.length;
        },
        prevIndex() {
            return ((this.index - 1) + this.photos.length) % this.photos.length;
        },
        nextPhoto() {
            return "https://matchify.s3.eu-central-1.amazonaws.com/" + this.photos[this.nextIndex];
        },

    }
}
</script>

<style lang="postcss" scoped>
#photo-container {
        flex: 1;
        text-align: center;
        img {
            width: 18vw;
            height: 24vw;
            border-radius: 20px;
            position: relative;
            z-index: 10;
        }
        #next{
            opacity: 0.5;
            background-color: black;
            z-index: 0;
            margin-left: -16vw;
            margin-bottom: -1.5vw;
        }
    }
</style>