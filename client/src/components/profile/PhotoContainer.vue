<template>
    <div id="photo-container">
        <template v-if="photos">
            <img id="current"
                :src="currentPhoto"
                @click="index = prevIndex"
                :style="{width: width, height: height}">
            <img id="next"
                v-if="photos.length != 1"
                :src="nextPhoto" 
                @click="index = nextIndex" 
                v-bind:style="{ width: width, height: height }">
            <img id = "next" v-else src="/ph.png" v-bind:style="{ width: width, height: height }">
        </template>
        <img v-else src="/ph.png" v-bind:style="{ width: width, height: height }">
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
        height: {
            type: String,
            default: '24vw', 
        },
        width: {
            type: String,
            default: '18w', 
        }
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