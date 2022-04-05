export default {
    namespaced: true,
    state: {
        wordList:[]
    },
    mutations:{
        fetchWords(state, words) {
            state.wordList = words
        },
        addWords(state, words) {
            words.forEach((word) =>{
                state.wordList.push(word)
            })
        }
    },
    actions:{
        getTargetWord({context},{id,words}){
            const targetWord = []
            words.forEach((word) => {
                if(word.id == id){
                    targetWord.push(word)
                }
            })
            console.log(targetWord[0])
            return targetWord[0]
        },
    },
    getters:{
        isFetchedWords(state){
            return Object.keys(state.wordList).length
        },
        getWordList(state){
            return JSON.parse(JSON.stringify(state.wordList))
        }
    }
}
