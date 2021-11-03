<template>
    <v-app>
        <Navigation />
        <v-container class="row justify-center">
            <h3>Welcome {{user.email}}</h3>
            <form>
                <button @click.prevent="logout">ログアウト</button>

                <nuxt-link to="/password">パスワード変更はこちらから</nuxt-link>
                <nuxt-link to="/users">登録済みのユーザー</nuxt-link>
            </form>
        </v-container>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            user:{
                uid:'',
                email:''
            }
        }
    },
    mounted(){
        firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.user.uid = this.$store.state.user.uid
                this.user.email = this.$store.state.user.email
            }else{
                this.$router.push('/login')
            }
        })
    },
    methods:{
        logout(){
            this.$store.dispatch('logout')
        }
    }
}
</script>
