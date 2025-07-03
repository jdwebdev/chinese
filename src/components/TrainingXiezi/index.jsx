import React from "react";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";
import { id } from "../../utils/utils.js"
import TrainingEnd from "../TrainingEnd";

import styled from "styled-components";

const VocContainer = styled.ul`
	height: 500px;
  max-height: ${window.innerHeight - 420}px;
`;

function TrainingXiezi() {

	const store = useStore();
	const trainingList = useState(store.getState().trainingList)[0];
	const [trainingIndex,setTrainingIndex] = useState(store.getState().trainingIndex);
	const trainingHanziWord = useState(store.getState().trainingHanziWord)[0];

	const [checked,setChecked] = useState(false);
	const [okList,setOkList] = useState([]);
	const [koList,setKoList] = useState([]);
	const [end,setEnd] = useState(false);

	useEffect(() => {
    store.subscribe(() => { setTrainingIndex(store.getState().trainingIndex) })
  }, [store]);

	function check(e) {
		const progressBar = id("zt_progressBar");
		progressBar.style.width = ((trainingIndex+1) / trainingList.length) * 100 + "%";
		setChecked(true);
	}

	function next(ok) {


		setChecked(false);
		if (ok) {
			okList.push(trainingList[trainingIndex]);
			setOkList(okList);
		} else {
			koList.push(trainingList[trainingIndex]);
			setKoList(koList);
		}
		
		if (trainingIndex >= trainingList.length-1) {
			setEnd(true);

		} else {
			store.dispatch({type: "UPDATE_TRAINING_INDEX", payload: trainingIndex+1 });
		}
	}

	return (
		<>
		{ !end && 
			<div>
				<div className="progress_bar_container">
					<span id="currentIndex">{trainingIndex+1}/{trainingList.length}</span>
					<div id="zt_progressBar" className="progressBar"></div>
				</div>
		
				<p className="toFind">{ !checked ? <span>？</span> : <span>{trainingList[trainingIndex].hanzi}</span> }</p>

				{ trainingList[trainingIndex].fanti === "" &&
					<p className="no_zt_fanti ">(繁體)</p>
				} 
				{ trainingList[trainingIndex].fanti !== "" &&
					<p className="zt_fanti">{ checked ? trainingList[trainingIndex].fanti : "(繁體)"}</p>
				}
				
				<p className="zt_pinyin">{trainingList[trainingIndex].pinyin}</p>

				{ trainingHanziWord === "word" && 
					<p className="zt_word_yisi">{trainingList[trainingIndex].yisi}</p>
				}
				{ trainingHanziWord !== "word" &&
					<VocContainer className="zt_vocContainer">
						{ trainingList[trainingIndex].ciyuList.map((w, index) => (
							<li key={index} className={index === 0 ? "zt_ciyu zt_ciyuBorder" : "zt_ciyu"}>{/*zt_ciyuBorder*/}
								<div className="zt_ciyu_ciyuPinyin">
										<p className="zt_wordToFind">{!checked ? <span>?</span> : <span>{w.hanzi}</span>}</p>
										<p>{w.pinyin}</p>
								</div>
								<p className="zt_yisi">{w.yisi}</p>
							</li>
						))}
					</VocContainer>
				}

				{ !checked && <button className="zt_check" onClick={(e) => check(e)}>Check</button> }
				{ checked && <div id="zt_nextBtn_container">
						<button id="zt_fail" onClick={(e) => next(false)}>错</button>
						<button id="zt_win" onClick={(e) => next(true)}>对</button>
					</div> 
				}
			</div>
		} 
		{ end && 
			<TrainingEnd okList={okList} koList={koList} />
		}
	
		</>
	)


} 

export default TrainingXiezi;


