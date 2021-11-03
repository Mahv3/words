<template>
    <v-app>
        <Navigation />

        <v-container class="row justify-center">
            <h1>新規登録</h1>
            <form>
                <input type="text" v-model="email" placeholder="emailを入力してください">
                <input type="password" v-model="password" placeholder="passwordを入力してください">
                <button @click.prevent="register">新規登録</button>
            </form>
        </v-container>
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
        register(){
            if(this.email === '' || this.password === ''){
                alert('メールアドレスとパスワードを入力してください')
                return
            }else if(this.password.length < 6) {
                alert('パスワードは6文字以上で入力してください')
                return
            }
            this.$store.dispatch('register', {email : this.email, password : this.password})
            this.$router.push('/')
        }
    }
}
</script>
