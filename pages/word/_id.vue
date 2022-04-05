<template>
    <v-app>
        <Navigation />
        <v-main>
            <v-card v-if="!this.edit" class="col-6 mx-auto my-12">
                <v-card-title>{{word.author}}</v-card-title>
                <v-divider class="mx-3"></v-divider>
                <v-card-text>{{word.sentence}}</v-card-text>
                <v-card-text>{{ `created by ${word.creator}` }}</v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small @click.prevent="comment.display = true" v-if="this.comment.display == false">comment</v-btn>
                    <v-btn small @click.prevent="edit = true" v-if="uid == wordCreatorUid">edit</v-btn>
                    <v-btn small @click.prevent="deleteWord" v-if="uid == wordCreatorUid">delete</v-btn>
                </v-card-actions>
            </v-card>


            <v-card v-if="this.edit" class="col-6 mx-auto my-12" elevation="1">
                <v-container>
                    <v-row class="col-12">
                        <v-card-title>edit word</v-card-title>
                        <v-btn text @click.prevent="edit = false" class="ml-auto">
                            <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-row>
                    <v-divider class="mx-3"></v-divider>

                    <v-card-text>word</v-card-text>
                    <v-textarea type="text" solo v-model="word.sentence"></v-textarea>

                    <v-card-text>who said?</v-card-text>
                    <v-text-field type="text" solo v-model="word.author"></v-text-field>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn small @click.prevent="updateWord">update</v-btn>
                     </v-card-actions>
                </v-container>
            </v-card>

            <v-card class="col-6 mx-auto mb-6" v-if="this.comment.display == true" elevation="1">
                 <v-row class="col-12">
                        <v-card-title>comment</v-card-title>
                        <v-btn text @click.prevent="comment.display = false" class="ml-auto">
                            <v-icon>mdi-close-circle</v-icon>
                        </v-btn>
                    </v-row>
                <v-textarea solo placeholder="comment" v-model="comment.value"></v-textarea>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn small @click.prevent="postComment">post</v-btn>
                </v-card-actions>
            </v-card>

            <v-card class="col-6 mx-auto" elevation="0">
                <v-subheader>comments</v-subheader>
                <v-list two-line>
                    <template v-for="(comment,index) in commentList">
                        <v-list-item :key="index" link v-if="comment.address">
                            <v-list-item-content class="address">
                                {{`To ${comment.address}`}}
                            </v-list-item-content>
                            <v-list-item-content class="comment">
                                {{comment.value}}
                            </v-list-item-content>
                            <v-list-item-content class="comment-creator">
                                {{`created by ${comment.creator}`}}
                            </v-list-item-content>
                            <v-btn text @click.prevent="routeToReply(index)">
                                <v-icon>mdi-reply</v-icon>
                            </v-btn>
                            <v-btn text @click="commentLike(index)">
                                <v-icon>mdi-thumb-up-outline</v-icon>
                            </v-btn>
                            {{ commentLikesCount(index) }}
                        </v-list-item>

                        <v-list-item :key="index" link v-else>
                            <v-list-item-content class="comment">
                                {{comment.value}}
                            </v-list-item-content>
                            <v-list-item-content class="comment-creator">
                                {{`created by ${comment.creator}`}}
                            </v-list-item-content>
                            <v-btn text @click.prevent="routeToReply(index)">
                                <v-icon>mdi-reply</v-icon>
                            </v-btn>
                            <v-btn text @click="commentLike(index)">
                                <v-icon>mdi-thumb-up-outline</v-icon>
                            </v-btn>
                            {{ commentLikesCount(index) }}
                        </v-list-item>
                        <v-divider :key="comment.id"></v-divider>
                    </template>
                </v-list>
            </v-card>

            <v-card class="col-6 mx-auto mt-6" v-if="reply.display">
                <v-row class="col-12 justify-lg-space-between">
                    <v-card-title>reply</v-card-title>
                    <v-btn text class="text-right" @click.prevent="reply.display = false">
                        <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                </v-row>
                <v-card-text>{{`To ${targetComment.creator}`}}</v-card-text>
                <v-card-text>{{targetComment.value}}</v-card-text>
                <v-text-field v-model="reply.text" placeholder="reply"></v-text-field>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click.prevent="postReply">Post</v-btn>
                </v-card-actions>
            </v-card>

        </v-main>
    </v-app>

</template>

<script>
import Navigation from '~/components/Navigation'
import firebase from '~/plugins/firebase'
export default {
    data(){
        return{
            edit:false,
            word:{},
            uid:"",
            wordCreatorUid:"",
            comment: {
                display:false,
                value:"",
            },
            commentList:[],
            replyList:[],
            reply:{
                display: false,
                text: ""
            },
            targetComment: {}
        }
    },
    computed:{
        commentLikesCount(){
            return function(index){
                return this.commentList[index].likesCount
            }
        }
    },
    async mounted(){
        this.uid = await this.$store.dispatch("modules/firebase/getUid")
        const id = this.$route.params.id
        const targetWord = await this.$store.dispatch("modules/firebase/getTargetWord",{id})
        this.wordCreatorUid = targetWord.uid
        this.word = JSON.parse(JSON.stringify(targetWord))

        const commentList = await this.$store.dispatch('modules/firebase/getCommentList',{
            id,
            wordCreatorUid: this.wordCreatorUid
        })
        this.commentList = commentList

        const replyList = await this.$store.dispatch("modules/firebase/getReplyList",{
            id,
            wordCreatorUid: this.wordCreatorUid
        })
        replyList.forEach(reply => {
            this.commentList.push(reply)
            this.replyList.push(reply)
        })
    },
    methods:{
        async deleteWord(){
            const id = this.$route.params.id
            this.$store.dispatch("modules/firebase/deleteWord",{id})
        },
        async updateWord(){
            const id = this.$route.params.id
            await this.$store.dispatch('modules/firebase/updateWord',{
                id,
                word:this.word
            })
            this.edit = false
        },
        postComment(){
            const id = this.$route.params.id
            this.$store.dispatch('modules/firebase/postComment',{
                wordCreatorUid: this.wordCreatorUid,
                id,
                value: this.comment.value
            })
        },
        commentLike(index){
            const wordId = this.$route.params.id
            const commentList = this.$store.getters['modules/comment/getCommentList']
            const commentId = commentList[index].id
            this.$store.dispatch('modules/firebase/commentLike',{
                wordCreatorUid: this.wordCreatorUid,
                wordId,
                commentId
            })
        },
        async routeToReply(index){
            this.reply.display = true
            const id = this.commentList[index].id
            console.log(id)
            if(Boolean(this.commentList[index].address)){
                this.replyList.forEach(reply => {
                    if(reply.id = id){
                        this.targetComment = reply
                    }
                })
            }else{
                const comments = await this.$store.dispatch("modules/firebase/getTargetComment",{id})
                comments.forEach((comment) => {
                    if(comment.data().id == id){
                        this.targetComment = comment.data()
                    }
                })
            }
        },
        async postReply(){
            this.$store.dispatch("modules/firebase/postReply",{
                targetComment: this.targetComment,
                value: this.reply.text,
                wordCreatorUid: this.wordCreatorUid,
                wordId: this.word.id,
                commentId: this.targetComment.id
            })
        }
    }
}
</script>


<style scoped>
.comment{
    display: block;
}
.comment-creator{
    text-align: right;
    display: block;
}
.address{
    font-size: .8rem;
}
</style>
