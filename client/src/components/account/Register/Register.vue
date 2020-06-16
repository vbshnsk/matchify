<template>
    <CreateAccount v-if="stage === 'create'" v-on:success="stage = 'photos'"></CreateAccount>
    <UploadPhotos v-else-if="stage === 'photos'" v-on:success="stage = 'compose'"></UploadPhotos>
    <ComposeProfile v-else-if="stage === 'compose'"></ComposeProfile>
</template>

<script>
import CreateAccount from './CreateAccount'
import UploadPhotos from './PhotoUpload'
import ComposeProfile from './ComposeProfile'

export default {
    data() {
       return{
         stage: "create",  
       } 
    },
    components: {
        CreateAccount,
        UploadPhotos,
        ComposeProfile,
    }
}
</script>