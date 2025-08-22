import React from "react";
import { useStore } from "react-redux";
// import { useState, useEffect } from "react";
import { hanziList, wordList, gramList, exampleList, expressionList } from "../../datas/hanzi.js";

import styled from "styled-components";

const WordDetails = styled.div`
  max-height: ${window.innerHeight - 200}px;
`;

function Modal(props) {

	const store = useStore();
	let hanzi = null;
	if (props.hanziId > -1) {
		hanzi = hanziList[props.hanziId-1]; //? -1 car les Hanzi commencent à 1
	}
	let word = null;
	if (props.wordId > -1) {
		word = wordList[props.wordId-1]; //? -1 car les Word commencent à 1
	}
	let help = props.help;

	function displayPinyin(e, pIndex) {
		e.stopPropagation();
		const pinyin = document.getElementById("pinyin_"+pIndex)
		const pinyin_void = document.getElementById("pinyin_void_"+pIndex)
		if (pinyin_void === null) return
		pinyin.style.display = "flex";
		pinyin_void.style.display = "none";
	}

	function closeModal(e, pOk = false) {
		e.stopPropagation();
		if (pOk) {
			store.dispatch({type: "CURRENT_HANZI", payload: -1});
			store.dispatch({type: "CURRENT_WORD", payload: -1});
			store.dispatch({type: "HELP", payload: false});
			store.dispatch({type: "OPEN_CLOSE_MODAL", payload: false});
		}
	}

	function displayWordPinyin(e) {
		e.stopPropagation();
		const pinyin = document.getElementById("word_pinyin")
		const pinyin_void = document.getElementById("word_pinyin_void")
		pinyin.style.display = "flex";
		pinyin_void.style.display = "none";
	}

	function displayExampleList(index, pPhrase) {
		
		let phrase = "";
		let i = 0;
		if (pPhrase.includes("a")) {
			pPhrase = parseInt(pPhrase);
			phrase = "・" + expressionList[pPhrase].phrase.replaceAll(word.cleaned,`&&&${word.cleaned};;;`);
			phrase += " | " + expressionList[pPhrase].yisi;
		} else {
			pPhrase = parseInt(pPhrase);
			phrase = "・" + exampleList[pPhrase].phrase.replaceAll(word.cleaned,`&&&${word.cleaned};;;`);
		}
		
		let uniqueIndex = 0;

		let phraseArr = phraseToArr(phrase);
		let elementArr = [];
		let currentIsAND = false;
		elementArr = phraseArr.map((p, index, arr) => {
			uniqueIndex++
			if (p === "&&&") {
				currentIsAND = true;
				return <span key={uniqueIndex} className="word_in_example">{arr[index+1]}</span>
			} else if (p !== "&&&" && p !== ";;;" && !currentIsAND) {
				return <span key={uniqueIndex}>{p}</span>
			} else if (p === ";;;") {
				currentIsAND = false;
			}
			
			return null;
		})
		elementArr = elementArr.filter(e => {
			return e !== null;
		})

		return <li key={index}>
			{elementArr.map((e) => e)}
		</li>
	}

	// phraseToArr("晚上好&&&你;;;看，那个人朝&&&你;;;招手呢。");
	function phraseToArr(phrase) {
		let bOk = true;
		let position = 0;
		let indexArr = [];
		let index = -1;
		let refArr = [];
		let bFirst = true;
		let bGetFirstPart = false;
		while (bOk) {
			index = phrase.indexOf("&&&", position);

			if (bFirst && index > 0) { //? &&& n'est pas à la position 0. Il faut récupérer le début de la phrase
				bGetFirstPart = true;
			}

			if (index > -1) {
				if (!indexArr.includes(index)) {
					indexArr.push(index);
					position = index;
					index = phrase.indexOf(";;;", position);
					refArr.push({start: position, end: index});
				}
				position++;
			} else {
				bOk = false;
			}
			bFirst = false;
		}
	
		let stringArr = [];
		let previous = -1;
		bFirst = true;
		refArr.forEach(r => {
			if (bFirst) {
				bFirst = false;
				if (bGetFirstPart) {
					stringArr.push(phrase.slice(0, r.start));
				}
			} else {
				stringArr.push(phrase.slice(previous, r.start));
			}
			stringArr.push(phrase.slice(r.start, r.start+3));
			stringArr.push(phrase.slice(r.start+3, r.end));
			stringArr.push(phrase.slice(r.end, r.end+3))
			previous = r.end+3;
			
		});
		stringArr.push(phrase.slice(previous, phrase.length));
		return stringArr;
	}



	return (
		<div id="modal" onClick={(e) => closeModal(e, true)}>
			<div id="popup">
				<div className="oneResult" onClick={(e) => closeModal(e, true)}>
					<div className="oneResult_subpart">

						{hanzi !== null &&
						(<>
							<div className="word_container">
								<div className="hanzi">
									{hanzi.hanzi}
									{hanzi.fanti !== "" && <span className="fanti">({hanzi.fanti})</span>}
								</div>
								<div className="hanziPinyin">{hanzi.pinyin}</div>
							</div>
							<WordDetails className="word_details">
								<ul>
									{ hanzi.ciyuList.map((w, index) => (
										<li key={index} className="voc" onClick={(e) => displayPinyin(e, index)}>
											<div className="voc_cy">
												<p className="voc_ciyu">{wordList[w].hanzi}</p>
												{wordList[w].pinyin !== "" &&
													<p id={"pinyin_void_"+index} className="voc_pinyin_void"><span className="void_span">?</span></p>
												}
												<p id={"pinyin_"+index} className="voc_pinyin">{wordList[w].pinyin}</p>
											</div>
											<p className="voc_fayu">{wordList[w].yisi}</p>
										</li>
									))}
								</ul>
							</WordDetails>
							</>
						)}
						{word !== null &&
						(<>
							<div className="word_container">
								<div className="hanzi">{word.hanzi}</div>
							</div>
							{word.fanti !== "" &&  <p className="word_fanti">{word.fanti}</p>}
							
							<WordDetails className="word_details" onClick={(e) => displayWordPinyin(e)}>
								<p id="word_pinyin_void" className="word_pinyin_void"><span className="word_pinyin_void_span">?</span></p>
								<p id="word_pinyin" className="word_pinyin">{word.pinyin}</p>
								<p className="word_yisi">{word.yisi}</p>
								<p className="gram">{gramList[word.gram] !== undefined ? "["+gramList[word.gram]+"]" : ""}</p>
								<span className="lesson_number">{word.ke} 课</span>
							</WordDetails>
							{word.exampleList.length > 0 && 
								<ul className="word_example_list">
									{word.exampleList.map((ex, index) => (
										displayExampleList(index, ex)
									))}
								</ul>
							}
							</>
						)}
						{ help &&
							(<>
								<h2 className="help_main_title">Historique</h2>
								<div className="help_container">
									<ul>
										<li>
											<p className="date">2025年3月2日<span className="app_version">V. 1.0</span></p>
											<h3 className="help_title">--- Mise en production ---</h3>
											<p>Mise en production de la version React responsive de
												<a href="https://jdwebdev.github.io/chinois/" target="_blank"> l'application d'origine en JS vanilla.</a>
											</p>
										</li>
									</ul>
								</div>
							</>
							)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default Modal;