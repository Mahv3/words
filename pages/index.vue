<template>
	<v-app id="inspire">
		<Navigation/>

		<v-main>
			<v-container class="pa-0 ma-0 col-12" fluid>
				<v-card class="col-12" elevation="0">
					<v-subheader>最近の投稿</v-subheader>
					<v-list two-line>
						<template v-for="(word,index) in words" class="col-12">
							<v-list-item
								class="col-12 ma-0 pa-0"
								:key="`first-${index}`"
								link
								@click.prevent="showWordDetail(index)"
							>
								<v-list-item-avatar color="grey darken-1">
									<img :src="word.photoURL" alt="">
								</v-list-item-avatar>
								<v-list-item-content>
									<v-list-item-title>
										{{word.sentence}}
									</v-list-item-title>
									<v-list-item-subtitle>
										{{ word.author }}
									</v-list-item-subtitle>
									<v-list-item-subtitle>
										{{ `created by ${word.creator}` }}
									</v-list-item-subtitle>
								</v-list-item-content>
							</v-list-item>
							<v-row :key="`second-${index}`" class="col-4 ml-auto">
								<v-btn class="col-1" text @click="wordLike(index)">
									<v-icon>mdi-thumb-up-outline</v-icon>
								</v-btn>
								{{word.likesCount}}
							</v-row>
							<v-divider :key="`third-${index}`"></v-divider>
						</template>
					</v-list>
					<infinite-loading
						direction="bottom"
						spinner='waveDots'
						@infinite="infiniteLoading"
					>
						<span slot='no-more'>ーーーーーーーーーー投稿されたwordsは以上ですーーーーーーーーーー</span>
					</infinite-loading>
				</v-card>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
import Navigation from '~/components/Navigation.vue'
import firebase from '~/plugins/firebase'
import InfiniteLoading from 'vue-infinite-loading'
export default {
	components:{
		Navigation,
		InfiniteLoading
	},
	data(){
		return{
			words:[],
			wordLength:null,
			scrollCount: 0,
			limit: 3,
		}
	},
	async created() {
		const words = await this.$store.dispatch("modules/firebase/fetchWords")
		this.wordLength = words.length
	},
	methods:{
		showWordDetail(index){
			const id = this.words[index].id
			this.$router.push(`/word/${id}`)
		},
		wordLike(index){
			const words = this.$store.getters["modules/words/getWordList"]
			const wordId = words[index].id
			const wordCreatorUid = words[index].uid
			this.$store.dispatch("modules/firebase/wordLike", {wordId, wordCreatorUid})
		},
		async infiniteLoading($state){
			setTimeout(async () => {
				if(this.words.length < this.wordLength){
					const words = await this.$store.dispatch("modules/firebase/getWordsToTheLimit",{
						limit: this.limit,
						scrollCount: this.scrollCount
					})
					words.forEach((word) => {
						this.words.push(word)
					})
					this.scrollCount++
					$state.loaded();
				}else{
					$state.complete()
				}
			},500)
		}
	}
}
</script>
