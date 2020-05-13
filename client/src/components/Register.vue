<template>
    <CreateAccount v-if="stage === 'create'" v-on:success="stage = 'photos'"></CreateAccount>
    <UploadPhotos v-else></UploadPhotos>
</template>

<script>
import CreateAccount from './CreateAccount'
import UploadPhotos from './PhotoUpload'

export default {
    data() {
       return{
         stage: "create",  
       } 
    },
    components: {
        CreateAccount,
        UploadPhotos
    }
}
</script>