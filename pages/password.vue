<template>
    <v-app>
        <v-main>
            <Navigation />
            <v-container class="row justify-center col-12 mt-12">
                <v-card elevation="0" class="col-12">
                <form>
                    <v-text-field class="col-6 mx-auto" type="email" v-model="email" placeholder="登録しているemailを入力してください" />
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="mx-auto" @click.prevent="sendEmailToResetPassword">送信</v-btn>
                    </v-card-actions>
                </form>
                </v-card>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
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
        //     const  email = firebase.auth().currentUser.email
        //     firebase.auth().sendPasswordResetEmail(email)
        //         .then(()=>{
        //             alert('emailにパスワード変更のリンクを送信しました')
        //         })
        //         .catch(()=>{
        //             alert('emailにパスワード変更のリンクを送信できませんでした')
        //         })
        // }
        }
    }
}
</script>
