<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="col-12" fluid>
                <v-card elevation="0">
                    <v-text-field class="col-6 mx-auto mt-12" fluid type="text"  v-model="email" placeholder="登録しているemailを入力してください" />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text color="blue" @click.prevent="sendEmailToResetPassword">送信</v-btn>
                    </v-card-actions>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
export default {
    data(){
        return{
            email:''
        }
    },
    methods:{
        sendEmailToResetPassword(){
            this.$store.dispatch("modules/firebase/sendEmailToResetPassword",{
                email: this.email
            })
        }
    }
}
</script>
