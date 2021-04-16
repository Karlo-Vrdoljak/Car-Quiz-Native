import React from "react";
import { Text } from "react-native";
import ReactHtmlParser from "react-html-parser";

export default function Quiz(props) {
	return <Text>{ReactHtmlParser(props.quizQuestion.question)}</Text>;
}
