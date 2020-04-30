<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
          <h1> This is {{ username }} profile </h1>
          <h1 v-if="spotify === 'authorized'"> You're authorized to spotify! </h1>
          <h1 v-else>To login to Spotify follow the link: <a v-bind:href="spotify">link</a></h1>
        </div>
    </div>
</template>

<script>
import Header from './Header'
import axios from 'axios'

export default {
    async beforeRouteEnter(to, from, next){
        if(to.path === '/profile'){
            const res = await axios.get(process.env.VUE_APP_SERVER +'/profile/me/spotify', {withCredentials: true});
            next(vm => vm.spotify = res.data)
        }
        else{
            next()
        }
    },
    data: function() {
        return {
            spotify: false,
        }  
    },
    computed:{
        isRoot(){
            return this.$route.meta.root;
        },
        isOwn(){
            return !this.$route.params.username || this.$route.params.username === this.$store.state.username;
        },
        username(){
            return this.$route.params.username ? this.$route.params.username : this.$store.state.username;
        },
    },
    components:{
    Header,
  },
}
</script>

<style lang="postcss" scoped>

#profile {
    height: 100%;
}

#body >>> {
    padding: 10px;
    padding-left: 30px;
    .flex{
        display: flex;
        justify-content: space-around;
    }

    .row>*, .header>*{
        flex: 4;
        margin: 0;
        padding: 10px 20px;
        border-bottom: rgba(230, 230, 250, 0.575) solid 0.5px;
    }

    .header{
        font-size: 12px;
        h2{
         font-weight: 600;
        }
    }

    .row{
        font-size: 14px;
        h3{
         font-weight: 400;
        }
    }

    .num {
        text-align: center;
        flex: 2;
    }

    #top, #taste{
        width: 25%;
    }
}
</style>
