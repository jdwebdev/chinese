import React from "react";
import { useStore } from "react-redux";
import { useState, useEffect } from "react";
import styled from "styled-components";

import LessonForm from "../../components/LessonForm";
import Modal from "../../components/Modal";


const ResultSection = styled.div`
  overflow-y: scroll;
  height: ${window.innerHeight - 172}px;
  max-width: 1000px;
  margin: 0 auto;
`;

function Home() {
  
  const store = useStore();
  const [currentHanziList, setCurrentHanziList] = useState(store.getState().currentHanziList);
  const [currentWordList, setCurrentWordList] = useState(store.getState().currentWordList);
  const [windowWidth, setWindowWidth] = useState(store.getState().windowWidth);
  const [modal, setModal] = useState(store.getState().modal);
  const [currentHanzi, setCurrentHanzi] = useState(store.getState().currentHanzi);
  const [currentWord, setCurrentWord] = useState(store.getState().currentWord);
  const [help, setHelp] = useState(store.getState().help);

  useEffect(() => {
    store.subscribe(() => { setCurrentHanziList(store.getState().currentHanziList) });
    store.subscribe(() => { setCurrentWordList(store.getState().currentWordList) });
    store.subscribe(() => { setWindowWidth(store.getState().windowWidth) });
    store.subscribe(() => { setModal(store.getState().modal) });
    store.subscribe(() => { setCurrentHanzi(store.getState().currentHanzi) });
    store.subscribe(() => { setCurrentWord(store.getState().currentWord) });
    store.subscribe(() => { setHelp(store.getState().help) });
  }, [store]);

  function fillHanziResultSection() {
		let hanziPerRow = windowWidth >= 1000 ? 12 : 6;

		let liArray = [];
		const ulArray = [];
		let count = 0;
		for (let i = currentHanziList.length-1; i >= 0; i--) {
			count++
			liArray.push(<li key={i} className="oneHanzi" onClick={(e) => openPopup(currentHanziList[i].id,"h")}>{currentHanziList[i].hanzi}</li>)
			if (i === 0) {
				if (count < hanziPerRow) {
					let diff = hanziPerRow - count;
					for (let j=0; j < diff; j++) {
							liArray.push(<li key={i+"_"+j} className="no_border"></li>);
					}
					count = hanziPerRow;
			}
			}
			if (count === hanziPerRow) {
				count = 0;
				ulArray.push(
					<ul key={"ul_"+i} className="one_line">
						{liArray.map((li) => li )}
					</ul>
				);
				liArray = [];
			}
		}

		return ulArray.map((ul) => ul);
  }

	function openPopup(pId, pFrom) {
		if (pFrom === "h") {
			store.dispatch({type: "CURRENT_HANZI", payload: pId});
		} else if (pFrom === "w") {
			store.dispatch({type: "CURRENT_WORD", payload: pId});
		}
		store.dispatch({type: "OPEN_CLOSE_MODAL", payload: true});
	}

	function cleanWord(pWord) {
		let cleanedWord = pWord;
		if (pWord.includes("[")) {
			cleanedWord = pWord.split("[")[0];
			cleanedWord = cleanedWord.slice(0, cleanedWord.length-1);
		}
		return cleanedWord;
	}

  return <div>
	{modal && <Modal hanziId={currentHanzi} wordId={currentWord} help={help} />}

	<LessonForm />
	<div className="result_nb">
		{ currentHanziList.length > 0 && currentWordList.length > 0 &&
			<p>{currentHanziList.length} + {currentWordList.length} résultats</p>
		}
		{ currentHanziList.length > 0 && currentWordList.length === 0 &&
			<p>{currentHanziList.length} résultats</p>
		}
		{ currentWordList.length > 0 && currentHanziList.length === 0 &&
			<p>{currentWordList.length} résultats</p>
		}
	</div>
	
	<ResultSection>
		{/* <ul className="hanziList">
			{currentHanziList.map(( val, index, array ) => (
				<li key={index} className="oneHanzi" onClick={(e) => openPopup(array[array.length -1-index].id,"h")}>{array[array.length -1-index].hanzi}</li>
			))}
		</ul> */}
		{fillHanziResultSection()}

		{currentWordList.map( ({ id, hanzi }) => (
			<div key={id} className="one_result" onClick={(e) => openPopup(id,"w")}>{cleanWord(hanzi)}</div>
		))}
	</ResultSection>

  </div>
  ;
}

export default Home;
