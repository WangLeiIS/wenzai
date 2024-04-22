export function getPrompt(inputMessage: string,
                          isContext: boolean,
                          cursorPosition: number,
                          selectPosition: number) {
    let startKey = '<!--';
    let maxLen = 5000;
    let prompt  = {
        beforeQuestion: '',
        afterQuestion: '',
        question: '',
        model: '',
        MSG: ''
    }
    let questionStart= 0;
    let questionEnd = 0;
    if (cursorPosition === selectPosition) {
        questionStart = inputMessage.lastIndexOf(startKey,cursorPosition)
          if (questionStart === -1) {
            prompt.MSG = 'No question found';
            return prompt;
          }
        questionEnd =  cursorPosition
    }else { questionStart = cursorPosition; questionEnd = selectPosition; }
    if (questionEnd - questionStart > maxLen) {
        prompt.MSG = 'The question is too long';
        return prompt;
    }
    prompt.question = inputMessage.slice(questionStart, questionEnd);
    if (isContext) {
        prompt.beforeQuestion = inputMessage.slice(0, questionStart);
        if (prompt.beforeQuestion.length>maxLen) {
            prompt.beforeQuestion = prompt.beforeQuestion.slice(prompt.beforeQuestion.length - maxLen);
        }
        prompt.afterQuestion = inputMessage.slice(questionEnd);
        if (prompt.afterQuestion.length>maxLen) {
            prompt.afterQuestion = prompt.afterQuestion.slice(0, maxLen);
        }
    }
    return prompt;
}


export function getQuestion(question: string)
{
    let maxQuestionLen = 5000;
    let prompt = {
        beforeQuestion: '',
        afterQuestion: '',
        question: '',
        model: '',
        MSG: ''
    };
    if (question.length > maxQuestionLen) {
        prompt.MSG = 'The question is too long';
        return prompt;
    }else { prompt.question = question; }

    return prompt;
}