<template>
    <v-app>
        <Navigation />
        <v-container class="row justify-center">
            <h3>Welcome</h3>

            <form>
                <button @click.prevent="logout">ログアウト</button>

                <nuxt-link to="/password">パスワード変更はこちらから</nuxt-link>
                <nuxt-link to="/users">登録済みのユーザー</nuxt-link>
            </form>

            <button @click.prevent="withdrawal">退会</button>
        </v-container>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
        }
    },
    mounted(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                return
            }else{
                this.$router.push('/login')
            }
        })
    },
    methods:{
        logout(){
            this.$store.dispatch('logout')
        },
        withdrawal(){
            this.$store.dispatch('withdrawal')
        }
    }
}
</script>
