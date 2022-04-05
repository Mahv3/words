<template>
    <v-app>
        <Navigation />
        <v-main>

            <v-card class="col-8 mx-auto my-12" elevation="0">
                <v-card-title>新規登録</v-card-title>
                <v-form>
                    <v-text-field type="text" v-model="email" class="col-6 mx-auto" label="email" outlined></v-text-field>
                    <v-text-field type="password" v-model="password" label="password" class="col-6 mx-auto" outlined></v-text-field>
                    <v-text-field type="text" v-model="displayName" label="displayName" class="col-6 mx-auto" outlined></v-text-field>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn class="ml-auto my-2" @click.prevent="register" color="primary">新規登録</v-btn>
                        <v-btn @click.prevent="registerWithGoogleAccount" color="cyan">Googleアカウントで登録</v-btn>
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
            email:"",
            password:"",
            displayName: ""
        }
    },
    methods:{
        register(){
            this.$store.dispatch('modules/firebase/registerWithEmailAndPassword', {
                email : this.email,
                password : this.password,
                displayName: this.displayName
            })
        },
        registerWithGoogleAccount () {
            this.$store.dispatch('modules/firebase/registerWithGoogleAccount')
        }
    }
}
</script>
