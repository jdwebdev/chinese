import React from "react";
import { useState, useEffect } from "react";
import { useStore } from "react-redux";


import { hanziList, wordList, lessonList } from "../../datas/hanzi.js";
import { id, randomizeList } from "../../utils/utils.js"

function TrainingForm() {
	const store = useStore();
	const [trainingType,setTrainingType] = useState(store.getState().trainingType);
	const [trainingHanziWord,setTrainingHanziWord] = useState(store.getState().trainingHanziWord);
	const [trainingLesson,setTrainingLesson] = useState(store.getState().trainingLesson);

	useEffect(() => {
		store.subscribe(() => {setTrainingType(store.getState().trainingType)});
		store.subscribe(() => {setTrainingHanziWord(store.getState().trainingHanziWord)});
		store.subscribe(() => {setTrainingLesson(store.getState().trainingLesson)});
	}, [store]);


	/*
	TYPE d'entrainement: 
		写字 => Écriture
			Select hanzi/word 
			Select LessonList
			BTN Start
		写汉字 => Libre
			Phrases explication
			Input
			BTN Start
		选择汉字 => Choix
			Select LessonList
			BTN Start
		写拼音 => Pinyin
			Select LessonList
			BTN Start

	STORE :
		trainingType
		trainingHanzi/Word
		trainingLesson
		training list (hanzi or word)
	*/
	function changeTrainingType(e, value) {
		if (value === "hanzi_choice") {
			store.dispatch({type: "CHANGE_TRAINING_H_W", payload: "word"});
		} else {
			store.dispatch({type: "CHANGE_TRAINING_H_W", payload: "hanzi"});
		}
		store.dispatch({type: "CHANGE_TRAINING_TYPE", payload: value});
	}

	function changeHanziWord(e, value) {
		store.dispatch({type: "CHANGE_TRAINING_H_W", payload: value});
	}

	function changeTrainingLesson(e, value) {
		store.dispatch({type: "CHANGE_TRAINING_LESSON", payload: value});
	}

	function start(e) {
		let randomList = [];
		if (trainingType === "xiezi" || trainingType === "pinyin") {
			//? xiezi: check hanzi/word  then lesson
			//? pinyin: check lesson 

			if (trainingHanziWord === "hanzi" || trainingType === "pinyin") {
				randomList = hanziList.filter((h) => {
					return h.ke === trainingLesson;
				})
				randomList = randomizeList(randomList);
				store.dispatch({type: "UPDATE_TRAINING_LIST", payload: randomList});
			} else if (trainingHanziWord === "word") {
				randomList = wordList.filter((w) => {
					return w.ke === trainingLesson;
				})
				randomList = randomizeList(randomList);
				store.dispatch({type: "UPDATE_TRAINING_LIST", payload: randomList});
			}



		} else if (trainingType === "free") {
			//? rdn la list from input
			const free_input = id("free_input");

			randomList = hanziList.filter((h) => {
				return free_input.value.includes(h.hanzi);
			})

			randomList = randomizeList(randomList);

			store.dispatch({type: "UPDATE_TRAINING_LIST", payload: randomList});

		} else if ("hanzi_choice") {
			//? word by lesson
			randomList = wordList.filter((w) => {
				return w.ke === trainingLesson;
			})
			randomList = randomizeList(randomList);

			store.dispatch({type: "UPDATE_TRAINING_LIST", payload: randomList});
		}
		store.dispatch({type: "IN_TRAINING", payload: true});
	}

	return (
		<section className="training_form">

			<div className="filters_section">

				<div className="zt_training_type">
					<label>Type d'entrainement : </label>
					<div className="select_background_training">
						<select value={trainingType} onChange={(e) => changeTrainingType(e, e.target.value)} id="zt_select_training_type" className="select_filter">
							<option value="xiezi">写字 => Écriture</option>
							<option value="free">写汉字 => Libre</option>
							<option value="hanzi_choice">选择汉字 => Choix</option>
							<option value="pinyin">写拼音 => Pinyin</option>
						</select>
					</div>
				</div>

				<div className="filters_btn_container">
					{ trainingType !== "free" &&
						<div className="filters_container">

							{ trainingType === "xiezi" &&
								<div className="select_background_training">
									<select value={trainingHanziWord} onChange={(e) => changeHanziWord(e, e.target.value)} id="zt_select" className="select_filter">
										<option value="hanzi">汉字</option>
										<option value="word">词语</option>
									</select>
								</div>
							}

							<div className="select_background_training">
								<select value={trainingLesson} onChange={(e) => changeTrainingLesson(e, e.target.value)} id="zt_h_select_lesson" className="select_filter">
									{ lessonList.map((ke, index, array) => (
										<option key={index} value={array[array.length - 1 -index]}>{array[array.length - 1 - index]}</option>
									))}
								</select>
							</div>

						</div>
					}
				</div>
				
				{ trainingType === "free" &&
					<div className="zt_hanzi_free">
						<p>Entrer une liste de caractères afin de travailler sur cette liste en particulier, exemple : 个都你他的我己每有国</p>
						<p>Le caractère sera ignoré s'il n'est pas référencé dans la liste de l'application.</p>
						<input id="free_input" type="text" />
					</div>
				}
			</div>

			<button className="startBtn" onClick={(e) => start(e)}>开始</button>
			
		</section>
	)
}


export default TrainingForm;