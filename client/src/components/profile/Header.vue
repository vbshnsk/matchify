<template>
    <div id="header">
        <ul id="links">
            <li><a id="tm" href="/">Matchify</a></li>
            <li><a v-bind:href="path('')">Profile</a></li>
            <li><a v-bind:href="path('/history')">History</a></li>
            <li v-if="auth && isOwn"><a v-bind:href="path('/match')">Match!</a></li>
        </ul>
        <ul id="profile">
            <li v-if="auth">
                <a href="/logout">Logout</a>
            </li>
            <template v-else>
                <li><a href="/register"> Register </a></li>
                <li><a href="/login"> Login </a></li>
            </template>
        </ul>
    </div>
</template>

<style lang="postcss" scoped>
    #tm {
        font-size: 20px;
        font-weight: 700;
    }
    #header{
        background-color: #0f0f0f;
        display: flex;  
        flex: 1;
        >* {
            display: flex;
            flex: 1;
            list-style-type: none;
            padding: 0;
        }
        #profile {
            margin-right: 30px;
            text-align: right;
            justify-content: flex-end;
            >* {
                flex-basis: 10%;
                min-width: 100px;
            }
        }
        #links {
            
            text-align: left;
            >* {
                align-self: center;
                text-align: center;
                flex-basis: 15%;
                min-width: 100px;
            }
        }
    }
</style>

<script>
export default {
    data: function(){
        return {
            auth: this.$store.state.auth
        } 
    },
    methods:{
        path(str){
            const username = this.$route.params.username;
            return `/profile${username? '/' + username + str : str}`;
        },
    },
    computed: {
        isOwn(){
            return !this.$route.params.username || this.$route.params.username === this.$store.state.username;
        },
    }
}
</script>