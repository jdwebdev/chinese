import React from "react";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";
import { id } from "../../utils/utils.js";
import TrainingEnd from "../TrainingEnd";
import styled from "styled-components";
import colors from "../../utils/style/colors";

const VocContainer = styled.ul`
	height: 500px;
  max-height: ${window.innerHeight - 420}px;
`;

function TrainingPinyin() {
	const store = useStore();
	const trainingList = useState(store.getState().trainingList)[0];
	const [trainingIndex,setTrainingIndex] = useState(store.getState().trainingIndex);

	const [checked,setChecked] = useState(false);
	const okList = useState([])[0];
	const koList = useState([])[0];
	const [end,setEnd] = useState(false);

	let bPinyinChecked = false;

	useEffect(() => {
    store.subscribe(() => { setTrainingIndex(store.getState().trainingIndex) })
  }, [store]);


	function focus() {
		const pinyin_keyboard = id("zt_pinyin_keyboard");
		pinyin_keyboard.style.display = "unset";
	}

	function insertPinyin(pPinyin) {
    const pinyin_input = id("zt_pinyin_input");
		pinyin_input.value += pPinyin;
    pinyin_input.focus();
	}

	function checkPinyin(e) {
		e.preventDefault();
		if (!bPinyinChecked) {
			bPinyinChecked = true;
			const pinyin_input = id("zt_pinyin_input");
			const zt_pinyinToFind = id("zt_pinyinToFind");
			let bPinyinOk = false;

			const progressBar = id("zt_progressBar");
			progressBar.style.width = ((trainingIndex+1) / trainingList.length) * 100 + "%";

			if (pinyin_input.value.toLowerCase().trim() === trainingList[trainingIndex].pinyin.toLowerCase()) {
				bPinyinOk = true;
			} else if (trainingList[trainingIndex].pinyin.includes("，")) { //? Multiple Pinyin
				let pinyinList = trainingList[trainingIndex].pinyin.split("，");
				pinyinList.forEach(p => {
					if (pinyin_input.value.toLowerCase().trim() === p.toLowerCase()) {
						bPinyinOk = true
					}
				});
			} 
			zt_pinyinToFind.style.color = bPinyinOk ? colors.green : colors.red;
			if (bPinyinOk) {
				okList.push(trainingList[trainingIndex]);
			} else {
				koList.push(trainingList[trainingIndex]);;
			}

			setChecked(true);
		}
		
	}

	function next() {
		bPinyinChecked = false;

		let newIndex = trainingIndex+1;
		if (newIndex >= trainingList.length) {
			setEnd(true);
		} else {
			const zt_pinyinToFind = id("zt_pinyinToFind");
			zt_pinyinToFind.style.color = "unset";
			setChecked(false);
			store.dispatch({type: "UPDATE_TRAINING_INDEX", payload: (newIndex) });
		}
	}

	return (
		<div>
			{ !end && (
				<>
				<div className="progress_bar_container">
					<span id="currentIndex">{trainingIndex+1}/{trainingList.length}</span>
					<div id="zt_progressBar" className="progressBar"></div>
				</div>
				<p className="toFind">{trainingList[trainingIndex].hanzi}</p>
				
				<p id="zt_pinyinToFind" className="zt_pinyin">{ !checked ? <span>？</span> : <span>{trainingList[trainingIndex].pinyin}</span>}</p>

				{ !checked &&
					<form className="zt_pinyin_form" action="">
							<input onFocus={(e) => focus()} className="search_input" id="zt_pinyin_input" type="text" placeholder="Écrivez le pinyin" />
							<button className="searchBtn" onClick={(e) => checkPinyin(e)}>Check</button>
					</form>
				}

				{ !checked &&
					<div id="zt_pinyin_keyboard">
							<ul>
									<li className="zt_button_list">
											<div className="zt_pinyin_block">
													<button onClick={(e) => insertPinyin('ā')}>ā</button>
													<button onClick={(e) => insertPinyin('á')}>á</button>
													<button onClick={(e) => insertPinyin('ǎ')}>ǎ</button>
													<button onClick={(e) => insertPinyin('à')}>à</button>
											{/* </div>
											<div className="zt_pinyin_block"> */}
													<button onClick={(e) => insertPinyin('ē')}>ē</button>
													<button onClick={(e) => insertPinyin('é')}>é</button>
													<button onClick={(e) => insertPinyin('ě')}>ě</button>
													<button onClick={(e) => insertPinyin('è')}>è</button>
											</div>
									</li>
									<li className="zt_button_list">
											<div className="zt_pinyin_block">
													<button onClick={(e) => insertPinyin('ī')}>ī</button>
													<button onClick={(e) => insertPinyin('í')}>í</button>
													<button onClick={(e) => insertPinyin('ǐ')}>ǐ</button>
													<button onClick={(e) => insertPinyin('ì')}>ì</button>
											{/* </div>
											<div className="zt_pinyin_block"> */}
													<button onClick={(e) => insertPinyin('ō')}>ō</button>
													<button onClick={(e) => insertPinyin('ó')}>ó</button>
													<button onClick={(e) => insertPinyin('ǒ')}>ǒ</button>
													<button onClick={(e) => insertPinyin('ò')}>ò</button>
											</div>
									</li>
									<li className="zt_button_list">
											<div className="zt_pinyin_block">
													<button onClick={(e) => insertPinyin('ū')}>ū</button>
													<button onClick={(e) => insertPinyin('ú')}>ú</button>
													<button onClick={(e) => insertPinyin('ǔ')}>ǔ</button>
													<button onClick={(e) => insertPinyin('ù')}>ù</button>
											{/* </div>
											<div className="zt_pinyin_block"> */}
													<button onClick={(e) => insertPinyin('ǖ')}>ǖ</button>
													<button onClick={(e) => insertPinyin('ǘ')}>ǘ</button>
													<button onClick={(e) => insertPinyin('ǚ')}>ǚ</button>
													<button onClick={(e) => insertPinyin('ǜ')}>ǜ</button>
											</div>
									</li>
							</ul>
					</div>
				}

				{ checked &&
					<div>
						<button onClick={(e) => next()} className="zt_check">Suivant</button>
					</div>
				}

				<VocContainer className="zt_vocContainer">
					{ trainingList[trainingIndex].ciyuList.map((w, index) => (
						<li key={index} className={index === 0 ? "zt_ciyu zt_ciyuBorder" : "zt_ciyu"}>
							<div className="zt_ciyu_ciyuPinyin">
								<p className="zt_wordToFind">{w.hanzi}</p>
								<p>{!checked ? <span>?</span> : <span>{w.pinyin}</span>}</p>
							</div>
							<p className="zt_yisi">{w.yisi}</p>
						</li>
					))}
				</VocContainer>
				</>)
			}
			{ end && 
				<TrainingEnd okList={okList} koList={koList} />
			}

        
    </div>)
} 

export default TrainingPinyin;


