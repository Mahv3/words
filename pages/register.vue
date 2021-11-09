<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="row justify-center">
                <h1>新規登録</h1>
                <form>
                    <input type="text" v-model="email" placeholder="emailを入力してください">
                    <input type="password" v-model="password" placeholder="passwordを入力してください">
                    <button @click.prevent="register">新規登録</button>

                    <button @click.prevent="registerGoogle">Googleアカウントで登録</button>
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
        register(){
            this.$store.dispatch('register', {email : this.email, password : this.password})
        },
        registerGoogle () {
            this.$store.dispatch('registerGoogle')
            this.$router.push('/')
        }
    }
}
</script>
