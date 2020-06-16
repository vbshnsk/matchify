<template>
    <div class="form-container">
        <div v-if="cropping" id="crop">
                <vue-cropper ref="cropper" 
                    :src="cropping" 
                    :aspect-ratio="3 / 4"
                    :view-mode="2" 
                    :containerStyle="{ height: '100vh', width: '100vw' }">
                </vue-cropper>
            <button @click="crop">Crop</button>
        </div>
        <form @submit.prevent>  
            <h1>Add profile pictures</h1>
            <div id="images">
                <div id="img-container"
                    v-for="(image, index) in previews" 
                    v-bind:key="image.id" 
                    @click="remove(index)">
                    <img v-bind:src="image">
                </div>
                <button id="add-image" @click="$refs.fileInput.click()"></button>
                <input type="file" ref="fileInput" accept="image/jpeg" @change="addImage" style="display: none">
            </div> 
            <div>
                <button @click="upload" :disabled="images.length === 0 || uploading"> Upload </button> 
                <button @click="skip" :disabled="uploading"> Skip </button> 
            </div>
        </form>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

export default {
    components:{
        VueCropper,
    },
    data() {
        return {
            previews: [],
            images: [],
            cropping: undefined,
            uploading: false,
        }
    },
    methods: {
        remove(index){
            this.previews.splice(index, 1);
            this.images.splice(index, 1);
        },
        addImage(e){
            const image = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onload = e => {
                this.cropping = e.target.result;
            }
        },
        crop(){
            this.cropping = undefined;
            this.previews = [...this.previews, this.$refs.cropper.getCroppedCanvas().toDataURL()];
            this.$refs.cropper.getCroppedCanvas().toBlob(blob => this.images = [...this.images, blob]);
        },
        skip() {
            this.$emit('success');
        },
        async upload(){
            this.uploading = true
            const params = new FormData();
            this.images.forEach(image => {
                params.append('photos', image);
            });
            try {
                const response = (await this.axios.post(process.env.VUE_APP_SERVER + '/profile/me/photos',
                params,
                {
                    headers: {'Content-Type': 'multipart/form-data'},
                    withCredentials: true,
                }));
                if(response.status === 200) {
                    this.$emit('success');
                }
            } catch (error) {
                this.uploading = false;
                window.alert('Something has gone wrong...');
            }
        }
    }
}
</script>

<style lang="postcss" scoped>
    #crop {
        z-index: 9999;
        position: fixed;
        button {
            position: fixed;
            margin-top: -4vh;
            height: 4vh;
            width: 100vw;
            background-color: rgba(0,0,0, 0.5);
            color: lavender;
            border: none;
        }
    }
    form {
        width: 95vw;
        height: 85vh;
        button {
            margin-top: 4vh;
            width: 10vw;
            margin: 4vh 0.3vw;
        }
        #images {
            display: flex;
            flex-wrap: wrap;
            * {
                margin: 5px;
            }
            #img-container {
                width: 15vw;
                height: 20vw;
                background-image: url('/crossed.png');
                background-repeat: no-repeat;
                background-size: 40%;
                background-position: center;
                img {
                    border-radius: 2vh;
                    max-width: 100%;
                    max-height: 100%;
                    margin: 0;
                    transition: opacity 0.25s;
                }
                img:hover {
                    opacity: 0.1;
                }
            }
            #add-image {
                width: 15vw;
                height: 20vw;
                border-radius: 2vh;
                border-style: dashed;
                border-color: rgba(0, 0, 0, 0.6);
                padding: 0;
                background-color: rgba(255, 255, 255, 0.5);
                background-image: url('/plus.png');
                background-repeat: no-repeat;
                background-size: 40%;
                background-position: center;
                opacity: 0.1;
            }
        }
    }
</style>