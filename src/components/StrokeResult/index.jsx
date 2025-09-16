import React from "react";
import { useStore } from "react-redux";
import { useState } from "react";
import { hanziList, wordList, gramList, exampleList, expressionList } from "../../datas/hanzi.js";

import styled from "styled-components";

const WordDetails = styled.div`
  max-height: ${window.innerHeight - 200}px;
`;

function StrokeResult(props) {

	const store = useStore();
  const [currentHanziList, setCurrentHanziList] = useState(store.getState().currentHanziList);

	// console.log(currentHanziList[props.strokeId]);
return (
	<>
		<div className="one_result_stroke">--------------- {props.strokeId+1} ---------------</div>
	{currentHanziList[props.strokeId].map( ({ id, hanzi }) => (
		<div key={id} className="one_result" onClick={() => props.openPopup(id, "h")}>{hanzi}</div>
	))}
	</>
)

	// return (
	// 	<div>
	// 		TEST STROKE RESULT
	// 	</div>
	// )
}

export default StrokeResult;