<template>
    <v-app>
        <Navigation />
        <v-main>

            <v-card class="col-8 mx-auto my-12">
                    <v-row>
                        <v-card-title>login</v-card-title>
                    </v-row>
                    <v-form>
                        <v-text-field class="col-6 mx-auto" v-model="email" label="email" outlined></v-text-field>
                        <v-text-field type="password" class="col-6 mx-auto" v-model="password" label="password" outlined></v-text-field>

                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-btn @click.prevent="login" color="primary" style="text-transform: none">login</v-btn>
                            <v-btn @click.prevent="loginGoogle" color="cyan" style="text-transform: none">Googleアカウントでログイン</v-btn>

                            <v-spacer></v-spacer>

                            <nuxt-link to="/resetPassword">パスワードを忘れてしまった方はこちら</nuxt-link>
                        </v-card-actions>
                    </v-form>
            </v-card>
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
