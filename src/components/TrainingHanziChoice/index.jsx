import React from "react";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";
import { hanziList } from "../../datas/hanzi.js";
import { id, rnd, randomizeList } from "../../utils/utils.js";
import TrainingEnd from "../TrainingEnd";

function TrainingHanziChoice() {

	const store = useStore();
	const trainingList = useState(store.getState().trainingList)[0];
	const [trainingIndex,setTrainingIndex] = useState(store.getState().trainingIndex);

	// const [answerList,setAnswerList] = useState([]);
	// const [hanziToFind,setHanziToFind] = useState("");

	const [okList,setOkList] = useState([]);
	const [koList,setKoList] = useState([]);
	const [end,setEnd] = useState(false);

	let hanziToFind = "";
	let bChoiceDone = false;
	let bHanziChoiceOK = true;

	useEffect(() => {
    store.subscribe(() => { setTrainingIndex(store.getState().trainingIndex) })
  }, [store]);



	function checkHanziChoice(e, hanzi) {
		if (!bChoiceDone) {
			let selectedOne = id(hanzi);
			if (hanziToFind === hanzi) {
				

					let elementList = document.getElementsByClassName("zt_hanzichoice_invisible");
					elementList = Array.prototype.filter.call(
							elementList,
							(element) => element.nodeName === "DIV",
					);
					elementList.forEach(e => {
							e.classList.remove("zt_hanzichoice_invisible");
							e.classList.add("zt_hanzichoice_correct");
							e.innerHTML = hanzi;
					});
					selectedOne.classList.add("zt_hanzichoice_correct");
					let zt_hanzichoice_next = id("zt_hanzichoice_next");
					zt_hanzichoice_next.style.display = "unset";

					bChoiceDone = true;
					const progressBar = id("zt_progressBar");
					progressBar.style.width = ((trainingIndex+1) / trainingList.length) * 100 + "%";

					if (bHanziChoiceOK) {
						okList.push(trainingList[trainingIndex]);
						setOkList(okList);
					}

			} else {
				selectedOne.classList.add("zt_hanzichoice_incorrect");
				if (bHanziChoiceOK) {
					bHanziChoiceOK = false;
					koList.push(trainingList[trainingIndex]);
					setKoList(koList);
				}
			}
		}
	}
	
	function next(e) {
		bHanziChoiceOK = true;
		bChoiceDone = false;
		e.target.style.display = "none";
		let newIndex = trainingIndex+1;

		if (newIndex >= trainingList.length) {
			setEnd(true);
		} else {
			store.dispatch({type: "UPDATE_TRAINING_INDEX", payload: (newIndex) });
		}
	}

	function createHanziToFindPart() {
		let tempHanziToFind = null;
    const wordToFind = trainingList[trainingIndex];
		let cleanedWord = "";
    if (wordToFind.hanzi.includes("[")) {
			cleanedWord = wordToFind.hanzi.split("[")[0];
			wordToFind.hanzi = cleanedWord.slice(0, cleanedWord.length-1);
    }

    if (wordToFind.hanzi.includes(".")) wordToFind.hanzi = wordToFind.hanzi.replace(".", "");
    let bOk = false;
    let dameList = `"….,，()[]/·?〜+- ~～！？ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    while (!bOk) {
			tempHanziToFind = wordToFind.hanzi[rnd(0,wordToFind.hanzi.length)];
			if (dameList.includes(tempHanziToFind)) {
				bOk = false;
			} else {
				bOk = true;
			}
    }
		hanziToFind = tempHanziToFind;

		const wordArr = [];
		let word = "";
		for (let i = 0; i < wordToFind.hanzi.length; i++) {
			word += wordToFind.hanzi[i];
			if (i === 6 && wordToFind.hanzi.length > 7) {
				wordArr.push(word);
				word = "";
			} else if (i === wordToFind.hanzi.length-1) {
				wordArr.push(word);
			}
		};

		const elementsArr = [];
		let elementArr = [];
		for (let j = 0; j < wordArr.length; j++) {
			elementArr = [];
			for (let i = 0; i < wordArr[j].length; i++) {
				if (wordArr[j][i] === hanziToFind) {
					elementArr.push(<div key={j+"_"+i} className="zt_one zt_hanzichoice_invisible">？</div>);
				} else {
					elementArr.push(<div key={j+"_"+i} className="zt_one zt_hanzichoice_visible">{wordArr[j][i]}</div>);
				}
			}
			elementsArr.push(elementArr);
		}

		let finalArr = [];
		elementsArr.forEach(eArr => {
			finalArr.push(
				<div key={rnd(0, 1000)} className="zt_ones_container">
					{eArr.map(e => (
						e
					))}
				</div>
			);
		})

		return (
		<div id="zt_hanzichoice_container">
			{finalArr.map(a =>(
				a
			))}
		</div>
		);
	}

	function createChoicesPart() {

    let answerList = [];
    answerList.push(hanziToFind);

    for (let i = 0; i < 10; i++) {
			let temp = hanziList[rnd(hanziList.length - 200,hanziList.length)].hanzi;
			if (answerList.includes(temp)) {
				i--;
			} else {
				answerList.push(temp);
			}
    }
    
    for (let i = 0; i < 9; i++) {
			let temp = hanziList[rnd(0,hanziList.length-200)].hanzi;
			if (answerList.includes(temp)) {
				i--;
			} else {
				answerList.push(temp);
			}
    }
    answerList = randomizeList(answerList);

		const ulArray = [];
		let liArray = [];
		for (let i = 0; i < answerList.length; i++) {
			liArray.push(<li id={answerList[i]} key={answerList[i]+"_"+i} className="zt_answerchoice_hanzi" onClick={(e) => checkHanziChoice(e,answerList[i])}>{answerList[i]}</li>);
			if ( ((i+1) % 5) === 0) {
				ulArray.push(
					<ul key={i} className="zt_answerchoice_row">
						{liArray.map((e) => (e))}
					</ul>
				);
				liArray = [];
			} 
		}

		return <div id="zt_answerchoice_container">
			{ulArray.map(a =>(
				a
			))}
		</div>
	}

	return (
	<div>
		{ !end && (
			<>
			
			<div className="progress_bar_container">
				<span id="currentIndex">{trainingIndex+1}/{trainingList.length}</span>
				<div id="zt_progressBar" className="progressBar"></div>
			</div>

			<div className="zt_hanzichoice_main_container">

				{createHanziToFindPart()}

				<div>{trainingList[trainingIndex].pinyin}</div>
				<div id="zt_answerchoice_translation">{trainingList[trainingIndex].yisi}</div>

				{createChoicesPart()}

			</div>
			<button id="zt_hanzichoice_next" className="zt_check" onClick={(e) => next(e)}>Suivant</button>
			</>
		)}
		{ end && 
			<TrainingEnd okList={okList} koList={koList} />
		}
			
	</div>)
} 

export default TrainingHanziChoice;


