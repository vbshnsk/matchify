<template>
    <div id="profile">
        <Header></Header>
        <router-view v-if="!isRoot"></router-view>
        <div id="body" v-else> 
          <h1> This is {{ username }} profile </h1>
        </div>
    </div>
</template>

<script>
import Header from './Header'

export default {
    data: function() {
        return {
        }  
    },
    computed:{
        isRoot(){
            return this.$route.meta.root;
        },
        username(){
            return this.$route.params.username ? this.$route.params.username : this.$store.state.username;
        }
    },
    components:{
    Header,
  },
}
</script>

<style lang="postcss" scoped>

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
