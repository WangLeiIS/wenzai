export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const context = await readBody(event);
	const { beforeQuestion } = context;
	const { question } = context;
	const { afterQuestion } = context;
	const { model } = context;
	const systemPrompt = '你是一个写作大师，你的任务是回答问题。以markdown格式回复'
	let prompt = ''
	if (beforeQuestion === '' && afterQuestion === '') {
		prompt = question
	} else {
	prompt = "以下是问题之前的内容\n"
		+ beforeQuestion
		+ "\n以上是问题之前的的内容\n以下是这次的问题\n"
		+ afterQuestion
		+ "\n以上是问题之后的内容\n下面的是问题，你不仅需要回答下面的问题，兼顾上下文，使之成为一个整体\n"
		+ question
	    + "\n回答的格式为markdown\n";
	}
	const ollama_url =  'http://localhost:11434/v1/chat/completions'
	const openai_url =  'https://api.openai.com/v1/chat/completions'
	const burnhair_url =  'https://burn.hair/v1/chat/completions'
	const req = await fetch(burnhair_url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${config.OPENAI_API_KEY}`
		},
		body: JSON.stringify({
			model: model,
			messages: [
				{
					"role": "system",
					"content": systemPrompt
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
