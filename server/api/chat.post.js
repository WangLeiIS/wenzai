export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const context = await readBody(event);
	const { before_question } = context;
	const { question } = context;
	console.log(question);
	const { after_question } = context;
	const prompt = "以下是问题之前的内容\n"
		+ before_question
		+ "\n以上是问题之前的的内容\n以下是这次的问题\n"
		+ question
		+ "\n以上是这次的问题\n这是问题之后的内容\n"
		+ after_question
		+ "\n以上是问题之后的内容\n重申以便下面的是问题，你只需要回答下面的问题\n"
		+ question;
	const ollama_url =  'http://localhost:11434/v1/chat/completions'
	const openai_url =  'https://api.openai.com/v1/chat/completions'
	const req = await fetch(openai_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: 'gpt-3.5-turbo',
			messages: [
				{
					"role": "system",
					"content": '你是一个文本生成模型，你的任务是回答问题。'
						+ '用户会给你三部分内容，分别是问题之前的内容，问题，问题之后的内容。'
						+ '你需要根据问题的上下文内容，仅回答真正的问题。不需要任何客套话，比如好的什么的，你的回答是要构成整个上下文'
				},
				{
					"role": "user",
					"content": prompt
				}
			],
			// stream: false
		})
	});
    
	const res = await req.json();
	const result = res.choices[0];
	return {
		message: result.message.content,
		// message:  userMessage.message ,
	};
});
