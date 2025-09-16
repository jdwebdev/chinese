import React from "react";
import { useState, useEffect } from "react";
import { useStore } from "react-redux";
import { hanziList, lessonList, bushouList, wordList } from "../../datas/hanzi.js";

function LessonForm() {

	const store = useStore();
	const [searchFilter,setSearchFilter] = useState(store.getState().searchFilter);
	const [lessonFilter,setLessonFilter] = useState(store.getState().lessonFilter);
	const [searchValue,setSearchValue] = useState("");
	
	useEffect(() => {
			store.subscribe(() => {setSearchFilter(store.getState().searchFilter)});
			store.subscribe(() => {setLessonFilter(store.getState().lessonFilter)});
	}, [store]);

	function changeFilter(pTargetId, pFilter) {
		let sFilter = searchFilter;
		let lFilter = lessonFilter;
		if (searchValue !== "") setSearchValue("");

		switch(pTargetId) {
			case "z_select": 
				sFilter = parseInt(pFilter);
				lFilter = "all";
				break;
			case "z_select_lesson": 
				lFilter = pFilter;
				break;
			case "bushou_select":
				break;
				// lFilter = "all";
			default:
				break;
		}

		/*
		0: Hanzi    => select Lesson = "all" => all HANZI
								=> select Lesson = "~ke" => "~ke" HANZI
		1: Bushou   => select bushou = "all" => NOTHING
								=> select bushou = "~bu" => sore
		2: Word     => select Lesson = "all" => all WORD
								=> select Lesson = "~ke" => ~ke WORD
		3: Chengyu  => all
		4: Text     => select Lesson = "all" => all TEXT
								=> select Lesson = "~ke" => ~ke TEXT
		*/

		let hanziResultList = [];
		let wordResultList = [];

		switch(sFilter) {
			case 0:
				hanziResultList = hanziList.filter((h) => {
					return (lFilter === "all" || h.ke === lFilter)
				});
				break;
			case 1:
				hanziResultList = hanziList.filter((h) => {
					return (h.bushou === pFilter)
				});
				break;
			case 10:
				let number = 1;
				hanziList.forEach(h => {
					if (parseInt(h.stroke) > number) number = h.stroke;
				});
				for (let i = 0; i < number; i++) {
					hanziResultList[i] = hanziList.filter((h) => {
						return (h.stroke == (i+1))
					});
				}
				break;
			case 2:
				wordResultList = wordList.filter((w) => {
					return (lFilter === "all" || w.ke === lFilter)
				})
				break;
			case 3:
				wordList.forEach((w) => {
					if (w.gram === "Chengyu") {
						wordResultList.push(w);
					}
				});
				break;
			default: 
		}
		store.dispatch({type: "CHANGE_HANZI_LIST", payload: {hanziResultList: hanziResultList, wordResultList: wordResultList, searchFilter: sFilter, lessonFilter: lFilter}});
	}

	function createBushouSelect() {
		let optionArr = [];
		let key = 0;
		optionArr.push(<option key={-1} value="all">Sélection</option>);
		bushouList.forEach(b => {
			optionArr.push(<option key={key} value={b.nb} disabled>----- {b.nb}画 -----</option>);
			key++
				b.key.forEach(k => {
					optionArr.push(<option key={key} value={k}>{k}</option>);
					key++
				});
		});
		
		return <select id="bushou_select" className="select_lesson" onChange={e => changeFilter(e.target.id, e.target.value)}>
				{optionArr.map((o) => {return o})}
			</select>
	}

	function inputOnChange(value, stop = false) {
		setSearchValue(value);
	}

	function search(e = null) {
		if (e !== null) e.preventDefault();
		let hanziResultList = [];
		let wordResultList = [];
		// console.log("searchValue: " + searchValue);

		if (searchValue.includes("h()")) {
			if (searchValue.slice(0, 3) == "h()") {
				let currentHanziList = "";
        let dame = ` ()0，[]·/…~.？～,=V1234567890N/"XxYO+QAB！!、`;
        let newHanziList = "";
        hanziList.forEach(h => {
            currentHanziList += h.hanzi;
        });

        if (searchValue == "h()") {
            wordList.forEach(w => {
                for (let i = 0; i < w.hanzi.length; i++) {
                    if (!(currentHanziList.includes(w.hanzi[i]))) {
                        if (!(newHanziList.includes(w.hanzi[i])) && !(dame.includes(w.hanzi[i]))) {
                            newHanziList += w.hanzi[i];
                        }
                    }
                }
            });
        } else {
					let research = searchValue.split("h() ")[1]
					// console.log("research: " + research);
					for (let i = 0; i < research.length; i++) {
						if (!(currentHanziList.includes(research[i]))) {
							if (!(newHanziList.includes(research[i])) && !(dame.includes(research[i]))) {
								newHanziList += research[i];
							}
						}
					}
        }

				console.log(newHanziList);

			}
		}
		switch(searchFilter) {
			case 0: //? Hanzi
				hanziList.forEach((h) => {
					if (searchValue === "" || h.hanzi.includes(searchValue)) {
						hanziResultList.push(h);
					} else {
						if (searchValue.length > 1) {
							for (let i = 0; i < searchValue.length; i++) {
								if (h.hanzi.includes(searchValue[i]) && !hanziResultList.includes(h)) {
									hanziResultList.push(h);
								}
							}
						}
						if (cleanPinyin(h.pinyin).includes(cleanPinyin(searchValue.toLowerCase()))) {
							if (cleanPinyin(h.pinyin) === cleanPinyin(searchValue.toLowerCase())) {
								hanziResultList.unshift(h);
							} else {
								hanziResultList.push(h);
							}
						}
					}
				});

				if (searchValue !== "" ) {
					wordList.forEach((w) => {
						if (searchValue === "" || w.hanzi.includes(searchValue)) {
							wordResultList.unshift(w);
						}
					});
				}
			break;
			case 2: //? Word
				wordList.forEach((w) => {
					if (searchValue === "" || w.hanzi.includes(searchValue)) {
						wordResultList.unshift(w);
					} else {
						if (cleanPinyin(w.pinyin).includes(cleanPinyin(searchValue.toLowerCase()))) {
							if (cleanPinyin(w.pinyin) === cleanPinyin(searchValue.toLowerCase())) {
								wordResultList.unshift(w);
							} else {
								wordResultList.push(w);
							}
						}
					}
				});
				break;
			default:
		}

		store.dispatch({type: "CHANGE_HANZI_LIST", payload: {hanziResultList: hanziResultList, wordResultList: wordResultList, searchFilter: searchFilter, lessonFilter: lessonFilter}});
	}
	function deleteInput(e, a ="nope") {
		e.preventDefault();
		setSearchValue("");
		document.getElementById("z_input").focus();
	}
	function cleanPinyin(pPinyin) {
			let a = "āáǎà";
			let i = "īíǐì";
			let u = "ūúǔùǖǘǚǜ";
			let e = "ēéěè";
			let o = "ōóǒò";
			let cleanedPinyin = "";
			for (let j = 0; j < pPinyin.length; j++) {
					if (a.includes(pPinyin[j])) {
					cleanedPinyin += "a";
					} else if (i.includes(pPinyin[j])) {
					cleanedPinyin += "i";
					} else if (u.includes(pPinyin[j])) {
					cleanedPinyin += "u";
					} else if (e.includes(pPinyin[j])) {
					cleanedPinyin += "e";
					} else if (o.includes(pPinyin[j])) {
					cleanedPinyin += "o";
					} else {
					cleanedPinyin += pPinyin[j];
					}
			}
			return cleanedPinyin;
	}

	
	return (
		<section className="search_section">
			{/* filter: {searchFilter} lesson: {lessonFilter} */}
			<form className="search_form" action="">
				<input 
					className="search_input"
					id="z_input"
					type="text"
					placeholder="汉字或者拼音"
					value={searchValue}
					onChange={(e) => inputOnChange(e.target.value)}
					
				/>
				<button className="searchBtn" onClick={(e) => search(e)}>检索</button>
				{searchValue !== "" && /* Put here with absolute position to prevent Form submit with Delete Btn instead of Search Btn */
					<button className="delete_btn" onClick={(e) => deleteInput(e, "aaa")}>X</button>
				}
			</form>
			<div className="select_container">
				<div className="select_background_lesson">
					<select name="" id="z_select" className="select_type"
						value={searchFilter}
						onChange={e => changeFilter(e.target.id, e.target.value)}
					>
						<option value={0}>汉字 Caractères</option>
						<option value={1}>部首 Clés / Radicaux</option>
						<option value={10}>笔画数 Traits</option>
						<option value={2}>词语 Mots</option>
						<option value={3}>成语 Chengyu</option>
						{/* <option value={4}>课文 Textes</option> */}
					</select>
				</div>
				<div className="select_background_lesson" style={ searchFilter !== 1 ? {display: "none"} : {} }>
					{createBushouSelect()}
				</div>
				{ searchFilter !== 1 && searchFilter !== 3 && searchFilter !== 10 && 
				<div className="select_background_lesson">
					<select name="" id="z_select_lesson" className="select_lesson"
						onChange={e => changeFilter(e.target.id, e.target.value)}
						value={lessonFilter}
					>
						<option value="all">课 Leçons</option>
						{ lessonList.map((ke, index, array) => (
							<option key={index} value={array[array.length - 1 -index]}>{array[array.length - 1 - index]}</option>
						))}
					</select>
				</div>
				}
			</div>
			<span id="z_resultNb" className="resultNb"></span>
		</section>
	)
}

export default LessonForm;