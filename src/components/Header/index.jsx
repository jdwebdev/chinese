import React from "react";
import colors from "../../utils/style/colors";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useStore } from "react-redux";
import { Link } from "react-router-dom";

const HeaderLink = styled(Link)`
  color: white;
  font-size: 20px;
  width: 76px;
  padding: 0px 5px 0 5px;
  border: 0px;
  border-left: 2px solid white;
  background-color: ${colors.red};
  border-radius: 0;
  height: 60px;
  text-decoration: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
	

  ${({ activebtn }) =>
    activebtn === "true" &&
    `color: ${colors.red}; 
    font-size: 26px;
    background-color: white;
    border-radius: 0 0 0 10px;
    font-weight: bold;

    &:hover {
      cursor: default;
    }
  `};
  ${({ activebtn }) =>
    activebtn !== "true" &&
	
      `
			transition: ease 0.3s;
			&:hover {
        cursor: pointer;
        font-size: 22px;
        background-color: rgba(240,240,240);
        color: ${colors.red}; 
        font-weight: bold;
				transition: ease 0.3s;
      }
  `};
`;

function Header() {
  
  const store = useStore();
  const [lessonMode, setLessonMode] = useState(store.getState().mode === "lesson");
  const [windowWidth, setWindowWidth] = useState(store.getState().windowWidth);
	const [modal, setModal] = useState(store.getState().modal);

  useEffect(() => {
    window.addEventListener("resize", event => {
      let bChange = false;
      if (store.getState().windowWidth >= 1000) {
        bChange = (window.innerWidth < 1000);
      } else {
        bChange = (window.innerWidth >= 1000);
      }
      if (bChange) {
        store.dispatch({type: "CHANGE_WINDOW_WIDTH", payload: window.innerWidth});
      }
    });
  }, []);

  useEffect(() => {
    store.subscribe(() => {setWindowWidth(store.getState().windowWidth)});
    store.subscribe(() => {setModal(store.getState().modal)});
  }, [store]);

  function changeMenu(e, pMode) {
		e.stopPropagation();
    store.dispatch({type: "CHANGE_MODE", payload: pMode});
    setLessonMode(pMode === "lesson" ? true : false);
  }

	function closeModal(e) {
		if (modal) {
			store.dispatch({type: "CURRENT_HANZI", payload: -1});
			store.dispatch({type: "CURRENT_WORD", payload: -1});
			store.dispatch({type: "OPEN_CLOSE_MODAL", payload: false});
		}
	}

	function openHelpModal() {
		store.dispatch({type: "HELP", payload: true});
		store.dispatch({type: "OPEN_CLOSE_MODAL", payload: true});
	}

  return (
    <header onClick={(e) => closeModal(e)}>
      <h1>汉语 {windowWidth >= 1000 && (lessonMode ? "- 课" : "- 练习" )}</h1>
      <nav>
        <HeaderLink
          to="chinese/"
          activebtn={`${lessonMode}`}
          onClick={(e) => changeMenu(e, "lesson")}
        >
          课
        </HeaderLink>
        <HeaderLink
          to="chinese/training"
          activebtn={`${!lessonMode}`}
          onClick={(e) => changeMenu(e, "training")}
        >
          练习
        </HeaderLink>
        <button className="help_btn" onClick={(e) => openHelpModal()}>?</button>
      </nav>
    </header>
  );
}

export default Header;
