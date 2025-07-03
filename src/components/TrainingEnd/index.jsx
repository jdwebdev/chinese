import React from "react";
import { useStore } from "react-redux";
import { useState } from "react";

function TrainingEnd(props) {
	const store = useStore();
	const [trainingList,setTrainingList] = useState(store.getState().trainingList);
	const [trainingHanziWord,setTrainingHanziWord] = useState(store.getState().trainingHanziWord);

	const okList = props.okList;
	const koList = props.koList;

	return (
	<div>
		{ koList.length === 0 &&
			<p className="zt_result">Bravo ! 0 erreur sur {trainingList.length} !</p> 
		} 
		{ koList.length > 0 &&
			<p className="zt_result">Erreur(s) : {koList.length} sur {trainingList.length} !</p>
		}
		{ trainingHanziWord !== "word" &&
			<p>
				{koList.map((h) => (
					<span>{h.hanzi}</span>
				))}
			</p>
		}
		<ul>
			{koList.map((h) => {
				if (trainingHanziWord === "hanzi") {
					return (<li className="zt_result_list">{h.hanzi} : {h.pinyin}</li>)
				} else {
					return (<li className="zt_result_list">{h.hanzi} : {h.pinyin} : {h.yisi}</li>)
				}
			})}
		</ul>
		{okList.length > 0 &&
			<>
				<p className="zt_tooEasy">Trop facile <span className="zt_easy_heart">♥♥♥</span> :</p>
				<ul>
					{okList.map((h) => {
						if (trainingHanziWord === "hanzi") {
							return (<li className="zt_result_list">{h.hanzi} : {h.pinyin}</li>)
						} else {
							return (<li className="zt_result_list">{h.hanzi} : {h.pinyin} : {h.yisi}</li>)
						}
					})}
				</ul>
			</>
		}
	</div>)

	
}

export default TrainingEnd;