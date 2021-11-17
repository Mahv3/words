<template>
  <v-app id="inspire">
    <v-app-bar color="primary" class="white--text" app clipped-right>
      <v-app-bar-nav-icon color="white" class="mr-4" @click.prevent="toggleDrawer"></v-app-bar-nav-icon>
      words
    </v-app-bar>

    <Navigation :drawer="this.drawer"/>

    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
        <v-row>
          <v-col cols="12">
            <v-card>
              <v-subheader>最近の投稿</v-subheader>

              <v-list two-line>
                <template v-for="(word,index) in $store.getters.getWords">
                  <v-list-item
                    :key="index"
                    link
                    @click.prevent="wordDetail(index)"
                  >
                    <v-list-item-avatar color="grey darken-1">
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{ word.author }}</v-list-item-title>

                      <v-list-item-subtitle>
                        {{word.sentence}}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider :key="word.id"></v-divider>
                </template>
              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navigation from '~/components/Navigation.vue'
import firebase from '~/plugins/firebase'
  export default {
    data(){
      return{
        drawer:true,
        words:[],
        word:{
          sentence:'',
          publisher:'',
          author:''
        }
      }
    },
    created() {
        this.$store.dispatch("fetchUsers");
    },
    methods:{
      wordDetail(index){
        this.words = this.$store.getters.getWords
        const id = this.words[index].id
        this.$router.push(`/word/${id}`)
      },
      toggleDrawer(){
        this.drawer = !this.drawer
      }
    }
  }
</script>
