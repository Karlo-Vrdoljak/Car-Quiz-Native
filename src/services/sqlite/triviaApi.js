const TriviaService = {
	API_URL: "https://opentdb.com/api.php?",

	createQueryParams(params) {
		return Object.keys(params)
			.map(k => `${k}=${encodeURI(params[k])}`)
			.join("&");
	},
	createQuiz(params = { amount: 10, category: null, difficulty: "easy" }) {
		console.log(this.API_URL + this.createQueryParams(params));
		return fetch(this.API_URL + this.createQueryParams(params))
			.then(response => response.json())
			.then(quiz => quiz.results)
			.catch(err => {
				console.error(err);
				return err;
			});
	},
};

export default TriviaService;
