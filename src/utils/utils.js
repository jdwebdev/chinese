
export function id(pId) {
	return document.getElementById(pId);
}

export function rnd(pMin, pMax) {
	//? pMax NON COMPRIS
	return Math.floor(Math.random() * (pMax - pMin)) + pMin;
}

export function none(element) {
	element.style.display = "none";
}

export function unset(element) {
	element.style.display = "unset";
}

export function randomizeList(pList) {
	let tmp = 0;
	let rndIndex = 0;
	for (let i = 0; i < pList.length; i++) {
			rndIndex = rnd(0, pList.length);
			tmp = pList[i];
			pList[i] = pList[rndIndex];
			pList[rndIndex] = tmp;
	}

	return pList;
}