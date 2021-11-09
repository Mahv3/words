<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="row justify-center">
                <form>
                    <input type="text" v-model="email" placeholder="emailを入力してください">
                    <input type="password" v-model="password" placeholder="passwordを入力してください">
                    <button @click.prevent="login">ログイン</button>
                    <button @click.prevent="loginGoogle">Googleアカウントでログイン</button>
                </form>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
export default {
    data(){
        return{
            email:'',
            password:''
        }
    },
    methods:{
        login(){
            if(this.email === '' || this.password === ''){
                alert('メールアドレスとパスワードを入力してください')
                return
            }
            this.$store.dispatch('login', {email : this.email, password : this.password})
        },
        loginGoogle(){
            this.$store.dispatch('loginGoogle')
        }
    }
}
</script>
