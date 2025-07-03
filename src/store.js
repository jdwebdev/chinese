import { configureStore } from "@reduxjs/toolkit"
import { hanziList, lessonList } from "./datas/hanzi.js";

let state = {
	mode: "lesson",
	windowWidth: window.innerWidth,
	//? --- Home/Lesson
	searchFilter: 0, //?  0 汉字  1 部首  2 词语  3 成语  4 课文
	lessonFilter: "all",
	currentHanziList: hanziList,
	currentWordList: [],
	modal: false,
	currentHanzi: -1,
	currentWord: -1,
	//? --- Training
	inTraining: false,
	trainingType: "xiezi",
	trainingHanziWord: "hanzi",
	trainingLesson: lessonList[lessonList.length-1],
	trainingList: [],
	trainingIndex: 0,
	//? --- Help
	help: false
}

const reducer = (currentState, action) => {
	switch(action.type) {
		case 'CHANGE_MODE':
			let mode = action.payload;
			return { ...state, mode };
			// case 'CHANGE_SEARCH_FILTER':
			//     let searchFilter = action.payload;
			//     return { ...state, searchFilter };
		case 'CHANGE_HANZI_LIST':
			const currentHanziList = action.payload.hanziResultList;
			const currentWordList = action.payload.wordResultList;
			const searchFilter = action.payload.searchFilter;
			const lessonFilter = action.payload.lessonFilter;
			return { ...currentState, currentHanziList: [...currentHanziList], currentWordList: [...currentWordList], searchFilter, lessonFilter };
		case 'CHANGE_WINDOW_WIDTH':
			const windowWidth = action.payload;
			return { ...currentState, windowWidth };
		case 'OPEN_CLOSE_MODAL':
			const modal = action.payload;
			return { ...currentState, modal };
		case 'CURRENT_HANZI':
			const currentHanzi = action.payload;
			return { ...currentState, currentHanzi };
		case 'CURRENT_WORD':
			const currentWord = action.payload;
			return { ...currentState, currentWord };
		case 'CHANGE_TRAINING_TYPE':
			const trainingType = action.payload;
			return { ...currentState, trainingType };
		case 'CHANGE_TRAINING_H_W':
			const trainingHanziWord = action.payload;
			return { ...currentState, trainingHanziWord };
		case 'CHANGE_TRAINING_LESSON':
			const trainingLesson = action.payload;
			return { ...currentState, trainingLesson };
		case 'UPDATE_TRAINING_LIST':
			const trainingList = action.payload;
			return { ...currentState, trainingList: [...trainingList] };
		case 'IN_TRAINING':
			const inTraining = action.payload;
			return { ...currentState, inTraining };
		case 'UPDATE_TRAINING_INDEX':
			const trainingIndex = action.payload;
			return { ...currentState, trainingIndex };
		case 'HELP':
			const help = action.payload;
			return { ...currentState, help };
		default :
			return { ...currentState };
	}
}

export const store = configureStore(
	{
		preloadedState: state,
		reducer
	}
)
