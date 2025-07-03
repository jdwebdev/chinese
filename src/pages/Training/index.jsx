import React from "react";
import { useStore } from "react-redux";
import { useEffect, useState } from "react";

import TrainingForm from "../../components/TrainingForm";
import TrainingXiezi from "../../components/TrainingXiezi";
import TrainingHanziChoice from "../../components/TrainingHanziChoice";
import TrainingPinyin from "../../components/TrainingPinyin";

function Training() {

  const store = useStore();
	const [trainingType,setTrainingType] = useState(store.getState().trainingType);
	const [inTraining,setInTraining] = useState(store.getState().inTraining);
  


  useEffect(() => {
    store.subscribe(() => { setTrainingType(store.getState().trainingType) });
    store.subscribe(() => { setInTraining(store.getState().inTraining) });
  }, [store])

	function back() {
		store.dispatch({type: "IN_TRAINING", payload: false});
		store.dispatch({type: "UPDATE_TRAINING_INDEX", payload: 0 });
	}

  return <section className="training_section">

		{ !inTraining ? (
			<TrainingForm />
		) : (
			<button className="backBtn" onClick={(e) => back()}>Back</button>
		)}

		<div className="">
				{ inTraining && (trainingType === "xiezi" || trainingType === "free") &&
					<TrainingXiezi />
				}

				{ inTraining && trainingType === "hanzi_choice" &&
					<TrainingHanziChoice />
				}

				{ inTraining && trainingType === "pinyin" &&
					<TrainingPinyin />
				}
		</div>

		{/* 
		-Hanzi training (Hanzi inconnu (+fanti) avec pinyin et liste de vocabulaire)
		Btn Check & 对 错
			Xiezi Hanzi 
			Libre 
			Xiezi Word (mot inconnu (+fanti) avec pinyin et sens) 
				(sans liste voc et qqn diffs)
		
		-Choix
		Grille 5x4 
			hanzi_choice

		-Pinyin
		input avec grille de boutons qui apparait quand on focus
		Petit btn check
		Liste de voc
		*/}

	</section>
}

export default Training;
