<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-container class="col-12 ma-0 pa-0">
                <v-card elevation="0">
                    <v-form class="mx-auto col-6">
                        <v-card-title>displayName</v-card-title>
                        <div class="my-6">Now {{user.displayName}}</div>
                        <v-text-field type="text" class="col-8 mx-auto" solo v-model="displayName"></v-text-field>
                        <v-card-title>icon</v-card-title>
                        <img class="col-8 mx-auto" v-if="uploadImageURL" :src="uploadImageURL" alt="">
                        <v-file-input
                            class="col-8 mx-auto"
                            show-size
                            accept="image/*"
                            prepend-icon="mdi-image"
                            label="アイコンにしたい画像を選択してください"
                            @change="onImagePicked"
                        ></v-file-input>
                    </v-form>
                    <v-card-actions class="col-6 mx-auto">
                        <v-spacer></v-spacer>
                        <v-btn small solo @click.prevent="updateProfile">update!</v-btn>
                    </v-card-actions>
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
            user:{},
            displayName:'',
            inputImage: null,
            uploadImage: "",
            file: {}
,            uploadImageURL:''
        }
    },
    async mounted(){
        const user = await this.$store.dispatch('modules/firebase/getSignedUser')
        this.user = user
        this.displayName = user.displayName
    },
    methods:{
        async updateProfile(){
            if(this.displayName == ""){
                return alert('無記入の登録はできません。')
            }
            this.$store.dispatch('modules/firebase/updateProfile',{
                file: this.file,
                displayName: this.displayName,
                uploadImageURL: this.uploadImageURL
            })
        },
        onImagePicked(e){
            // イベントで流れてくる
            if(e !== undefined && e !== null) {
                // eを使う
                const reader = new FileReader()
                reader.onload = () => {
                    this.uploadImage = reader.result + ' '
                }
                reader.readAsDataURL(e)
                this.file = e
                reader.addEventListener('load', () => {
                    this.uploadImageURL = reader.result
                })
            }else{
                this.uploadImageURL = ''
            }
        }
    }
}
</script>
