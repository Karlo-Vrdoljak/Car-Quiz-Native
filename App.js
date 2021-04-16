import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator,StyleSheet, Text, View } from "react-native";
import DbContext from "./src/services/sqlite/sqliteService";
import TriviaService from "./src/services/sqlite/triviaApi";
import {  } from 'react-native';

import * as FileSystem from "expo-file-system";
import Quiz from "./src/components/Quiz";

export default function App() {
	const { sqliteService } = React.useContext(DbContext);
  const [quiz, setquiz] = React.useState([]);
  const [loading, setloading] = React.useState(true);
	sqliteService.initDb().then(inited => console.log("DB ready: ", inited));
	React.useEffect(() => {
		const effect = async () => {
			try {
				const [configResult, difficultyResult, categoryResult] = await sqliteService.executeTransaction([
					{
						sql: "select * from config",
					},
					{
						sql: "select * from difficulty",
					},
					{
						sql: "select * from category",
					},
				]);
				const config = sqliteService.getResults(configResult, true);
				const difficulties = sqliteService.getResults(difficultyResult);
				const categories = sqliteService.getResults(categoryResult);
				console.log(config, difficulties, categories);

				const fetched = await TriviaService.createQuiz({ amount: config.maxQuestions, category: categories[0].triviaApiKey, difficulty: difficulties[0].triviaApiKey })
				console.log(fetched);
        setquiz(fetched);
        setloading(false);
			} catch (error) {
				console.error(error);
			}
		};
		effect();
		// return () => {
		// 	// clean up
		// };
	}, [loading]);

  const renderQuiz = quiz => quiz.length && quiz.map((q,i) => <Quiz key={`${q.question}_${i}`} quizQuestion={q}></Quiz>)

	return (
		<View style={styles.container}>
			{loading? <ActivityIndicator/> : renderQuiz(quiz)}
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
