<template>
    <div id="taste-editor-container">
        <div id="taste-editor">
            <div class="genre" v-for="(value, genre) in currentTaste" v-bind:key="genre">
                <p> {{ value.toFixed(1) }}</p>
                <div class="slider">
                    <input type="range" min="0" max="100" step="0.1" v-model.number="currentTaste[genre]" class="slider" id="myRange" @input.prevent="update(genre)">
                </div>
                <div class="name-container"> 
                    <p class="name"> {{ genre }}</p> 
                </div>
            </div>
        </div>
        <div id="taste-editor-buttons">
            <button class="green" @click="edit"> Edit </button>
            <button class="skip" @click="$emit('end')"> Cancel </button>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        taste: Object,
    },
    data() {
        return {
            currentTaste: Object.assign({}, this.taste),
            prevTaste: Object.assign({}, this.taste),
        }
    },
    methods: {
        update(changed) {
            const oldDiff = 100 - this.prevTaste[changed];
            const newDiff = 100 - this.currentTaste[changed];
            const changeVolume = newDiff / oldDiff;
            for(const genre in this.taste){
                if(genre != changed){
                    const prevRatio = this.prevTaste[genre] / oldDiff;
                    this.currentTaste[genre] = prevRatio? this.currentTaste[genre] * changeVolume : isNaN(prevRatio)? newDiff / 10 : 0;
                }
            }
            this.prevTaste = Object.assign({}, this.currentTaste);
        },
        async edit(){
            Object.assign(this.taste, this.currentTaste);
            const response = await this.axios.put(process.env.VUE_APP_SERVER + '/profile/me/statistics', 
            { taste: this.taste },
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
            });
            if(response.status === 200) {
                this.$emit('end');
            }
        }
    }
}
</script>

<style lang="postcss" scoped>
#taste-editor-buttons {
    display: flex;
    justify-content: space-evenly;
    margin-top: 1vh;
    button {
        flex-basis: 30%;
        height: 6vh;
    }
}
#taste-editor {
    display: flex;
    justify-content: space-around;
}

input[type=number]{
    width: 50%;
    -moz-appearance: textfield;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=range]{
    writing-mode: bt-lr; 
    -webkit-appearance: none;
    transform: rotate(270deg); 
    text-align: center;
    margin-left: -7vh;
    margin-top: 8vh;
    width: 18vh;
    height: 0 !important;
    background: transparent;
}
input[type=range]:focus {
  outline: none
}
input[type=range]::-webkit-slider-thumb{
    border: 1px solid rgba(6, 165, 27, 0.3);
    height: 1.8vh;
    width: 1.8vh;
    border-radius: 1.8vh;
    background:lavender;
    opacity: 0.85;
    cursor: pointer;
    -webkit-appearance: none;
}

input[type=range]::-webkit-slider-runnable-track {
  height: 1.8vh;
  cursor: pointer;
  background: rgba(6, 165, 27, 0.6);
  border-radius: 1.8vh;
}

.genre {
    text-align: center;
    max-width: 2vw;
    p {
        margin-top: 0;
    }
    .slider{
        height: 18vh;
        overflow-x: visible;
    }
    .name {
        font-size: 14px;
        transform: rotate(-25deg);
        margin-left: -5.5vh;
        margin-top: -1vh;
        width: 4vw;
        text-align: right;
    }
    .name-container {
        margin-top: 1.5vh;
        transform: translateX(-1.2  vw);
    }
}
</style>