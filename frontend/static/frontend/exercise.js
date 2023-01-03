class Exercise{
    /***********************
    Internal data
    ***********************/
    static answerMap = {
        'known':2,
        'fuzzy':1,
        'unknown': 0
    }

    static bookName = undefined;
    static words = [];
    // The answer for a word
    static answers = [];
    // The id that is used to identify an answer in the database
    // Used to change an existing answer
    static wordHistoryIds = [];
    //the index of the word that is showing to the user now
    static absoluteWordPos = 0;

    //Calculate how long a word is shown to the user
    static wordShownTime = Date.now();

    /***********************
     data accessor function
    ***********************/
    static wordsLoading = false;
    static isLoading(){
        return Exercise.wordsLoading;
    }
    static setLoadingStatus(status){
        Exercise.wordsLoading = status;
    }

    static getCurrentIdx(){
        return Exercise.absoluteWordPos;
    }
    static getWordCount(){
        return Exercise.words.length;
    }
    static getWord(id){
        return Exercise.words[id];
    }
    static addWords(words){
        Exercise.words.push(...words);
    }
    static setWord(id, value){
        Exercise.words[id] = value;
    }
    static existsWord(id){
        return Exercise.words[id] != undefined;
    }

    static getAnswer(id){
        return Exercise.answers[id];
    }
    static setAnswer(id, value){
        Exercise.answers[id] = value;
    }
    static existsAnswer(id){
        return Exercise.answers[id] != undefined;
    }

    static getWordHistoryId(id){
        return Exercise.wordHistoryIds[id];
    }
    static setWordHistoryId(id, value){
        Exercise.wordHistoryIds[id] = value;
    }
    static existsWordHistoryId(id){
        return Exercise.wordHistoryIds[id] != undefined;
    }




    /***********************
     element accessor function
    ***********************/
    static getWordElement(){
        return document.getElementById("exercise-word");
    }

    static getSoundmarkPanelElement(){
        return document.getElementById("exercise-soundmark-panel");
    }

    static getDefinitionElement(){
        return document.getElementById("exercise-definition");
    }

    static getAnswerElement(type){
        return document.getElementById(`exercise-answer-${type}`);
    }

    
    /***********************
     button control
    ***********************/
    static unhighlightButton(type){
        var elt = Exercise.highlightButton(type);
        var className = elt.className;
        className = className.replace("btn-","btn-outline-");
        elt.setAttribute("class", className);
        return elt;
    }
    
    static highlightButton(type){
        var elt = Exercise.getAnswerElement(type);
        var className = elt.className;
        className = className.replace("-outline","");
        elt.setAttribute("class", className);
        return elt;
    }

    static selectButton(answer){
        var buttonTypes = ['known','unknown','fuzzy'];
        for (var type of buttonTypes){
            Exercise.unhighlightButton(type);
        }
        if (buttonTypes.includes(answer)){
            Exercise.highlightButton(answer);
        }
    }

    
    /***********************
     utilities
    ***********************/
    static clearAllData(){
        Exercise.words=[];
        Exercise.answers=[];
        Exercise.wordHistoryIds=[];
        Exercise.absoluteWordPos = 0;
    }

    
    static nextWord(offset){
        const maxLoad = 1;
        // Aloow 1 unanswered word at most
        const undefinedCount = Exercise.absoluteWordPos + offset - Exercise.answers.filter(x => x !== undefined).length;
        if (undefinedCount>=maxLoad){
            return;
        }

        if(Exercise.absoluteWordPos + offset<0){
            return;
        }
        Exercise.absoluteWordPos = Exercise.absoluteWordPos + offset;
        Exercise.showCard();
    }


    
    /***********************
     Main functions
    ***********************/
     static loadPanel(bookName = null){
        if (bookName != null) {
            if (Exercise.bookName != bookName) {
                Exercise.clearAllData();
            }
            Exercise.bookName = bookName;
        }
        // Reset the timer;
        Exercise.wordShownTime = Date.now();
        Exercise.showCard();
    }

    static showCard(){
        var idx = Exercise.getCurrentIdx();
        if(idx>= Exercise.words.length){
            Exercise.loadWords();
            return setTimeout(()=>{
                return Exercise.showCard()
            }, 100);
        }

        var word = Exercise.getWord(idx);
        var title = Exercise.getWordElement();
        title.innerText = word;
        title.dataset.idx = idx;

        Exercise.showSoundmark(idx);
        if (Exercise.existsAnswer(idx)){
            Exercise.showDefinition(idx);
        }else{
            Exercise.showWaitingInfoInDefinition(idx);
        }

        Exercise.showAnswerButton(idx);
    }

    static showSoundmark(idx){
        var word = Exercise.getWord(idx);

        if(idx!= Exercise.getCurrentIdx()){
            return;
        }
        if(!wordInfoHub.exists(word, 'US')){
            return setTimeout(()=>{return Exercise.showSoundmark(idx)}, 100);
        }
        
        var panel = Exercise.getSoundmarkPanelElement();
        panel.innerHTML = '';
        for(var i=0;i<Keys.soundMarkRegions.length;i++){
            var region = Keys.soundMarkRegions[i];
            var soundmark = wordInfoHub.get(word, region)
            var sm = WordPanel.createSoundmarkElement(word, region, soundmark);
            sm.setAttribute('class', 'btn btn-sm btn-light')
            panel.append(sm);
        }
    }

    static showDefinition(idx){
        var word = Exercise.getWord(idx);
        if(idx!= Exercise.getCurrentIdx()){
            return;
        }
        if(!wordInfoHub.exists(word, 'exercise-def')){
            return setTimeout(()=>{return Exercise.showDefinition(idx)}, 100);
        }

        var defintionElt = Exercise.getDefinitionElement();
        defintionElt.innerText = wordInfoHub.get(word, 'exercise-def');
        defintionElt.dataset.idx = idx;
        defintionElt.dataset.isShown = true;
    }
    
    static showWaitingInfoInDefinition(idx){
        var defintionElt = Exercise.getDefinitionElement();
        defintionElt.innerText = 'Click me to see the word definition';
        defintionElt.dataset.idx = idx;
        defintionElt.dataset.isShown = false;
    }

    static showAnswerButton(idx){
        //Remove the answer selection first
        var answer = Exercise.getAnswer(idx);
        var buttonTypes = ['known','unknown','fuzzy'];
        for (var type of buttonTypes){
            var elt = Exercise.getAnswerElement(type);
            elt.dataset.idx = idx;
        }
        // If no answer is selected, this will unhighlight all
        Exercise.selectButton(answer);
    }


    static loadWords(){
        if(Exercise.isLoading()){
            return;
        }
        if (Exercise.bookName==undefined){
            throw new Error('bookName is undefined');
        }
        API.queryExerciseWords(Exercise.loadWordsCallback, Exercise.bookName);
        Exercise.setLoadingStatus(true);
    }
    
    static loadWordsCallback(req){
        Exercise.setLoadingStatus(false);
        if(requestUtils.handleRequestError(req)){
            return;
        }
        var jsonResponse = JSON.parse(req.responseText);
        var source = jsonResponse['source'];
        var wordslist = jsonResponse['words'];

        var words =  wordslist['words'];
        var definitions = wordslist[source];
        var US = wordslist['US'];
        var UK = wordslist['UK'];
        Exercise.addWords(words);
        
        for(var i =0;i<words.length;i++){
            var word = words[i];
            var def = definitions[i];
            wordInfoHub.set(word, 'exercise-def', def);
            wordInfoHub.set(word, 'UK', UK[i]);
            wordInfoHub.set(word, 'US', US[i]);
        }
    }
   
    static nextWordTimer;
    static selectAnswer(buttonDOM){
        var idx= buttonDOM.dataset.idx;
        var existsAnswer = Exercise.existsAnswer(idx);
        var answer = buttonDOM.innerText.toLowerCase();
        Exercise.showDefinition(idx);
        Exercise.selectButton(answer)
        Exercise.setAnswer(idx, answer)

        var answerCategory = Exercise.answerMap[answer];
        var word = Exercise.getWord(idx);
        var existsWordHistoryId = Exercise.existsWordHistoryId(idx);
        if (!existsWordHistoryId){
            var autoNextWord = !existsAnswer;

            clearTimeout(Exercise.nextWordTimer);
            Exercise.nextWordTimer = setTimeout(() => {
                if (autoNextWord){
                    Exercise.nextWord(1);
                }
                // Calculate how long the word has been studied
                var timeInSeconds = (Date.now() - Exercise.wordShownTime)/1000;
                Exercise.wordShownTime = Date.now();
                API.addExerciseWords((req)=>{
                    if(requestUtils.handleRequestError(req)){
                        return;
                    }
                    var jsonResponse = JSON.parse(req.responseText);
                    Exercise.setWordHistoryId(idx, jsonResponse['id']);
                }, Exercise.bookName, word, answerCategory, timeInSeconds);
                }, 2000); 
        }else{
            var wordId = Exercise.getWordHistoryId(idx);
            API.updateExerciseWord((req)=>{
                if(requestUtils.handleRequestError(req)){
                    return;
                }
            }, wordId, answerCategory);
        }
    }

    static wordOnclick(obj){
        WordPanel.backWindowId=Panels.exercise;
        var word = Exercise.getWord(obj.dataset.idx);
        WordPanel.showWord(word);
    }

    static definitionOnclick(obj){
        var idx = obj.dataset.idx;
        var isShown = obj.dataset.isShown;
        if(isShown == 'true'){
            Exercise.showWaitingInfoInDefinition(idx);
        }else{
            Exercise.showDefinition(idx);
        }

    }
}