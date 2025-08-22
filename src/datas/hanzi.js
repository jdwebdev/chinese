import { hanziImportedList, wordImportedList, exampleImportedList, lessonImportedList, expressionImportedList } from "./importedDatas.js";

// console.log("Hanzi.js");
const HANZI_LIST = hanziImportedList;
const WORD_LIST = wordImportedList;
const LESSON_LIST = lessonImportedList;
const EXAMPLE_LIST = exampleImportedList;
const EXPRESSION_LIST = expressionImportedList;
const BUSHOU_LIST = [
	{ nb: 1, key: ["一", "丿", "丶", "乙", "乛", "乚", "亅", "丨"] },
	{ nb: 2, key: ["十","厂","匚","卜","冂","八","丷","人","亻","勹","儿","匕","几","亠","冫","冖","凵","卩","刂","刀","阝","力","又","厶","廴","讠","匕","二","入","㔾"] },
	{ nb: 3, key: ["宀","艹","囗","口","门","子","小","大","马","山","巾","弓","辶","扌","彳","尢","尸","氵","工","士","土","夕","纟","干","彐","寸","犭","己","飞","饣","广","女","夂","廾","彡","巳","川","弋","幺","巛"] },
	{ nb: 4, key: ["王","车","木","礻","火","灬","日","曰","文","月","水","长","戈","心","气","耂","父","贝","见","牛","牜","攵","支","比","爫","欠","片","止","户","斤","手","风","歹","韦","瓦","毛","牙","氏","旡","殳","犬","斗","无","冃"] },
	{ nb: 5, key: ["钅","衤","穴","疒","白","白","田","矢","石","母","目","立","龙","生","鸟","癶","罒","玉","禾","皿","瓜","皮","矛","甘"] },
	{ nb: 6, key: ["衣","⺮","自","糸","米","覀","肉","舌","页","虫","舟","行","耳","色","羽","虍","羊","而","至","艮","缶","齐","血","臼","聿"] },
	{ nb: 7, key: ["足", "走", "酉", "里", "辛", "身", "角", "豕", "豆", "豸", "辰"] },
	{ nb: 8, key: ["非", "鱼", "雨", "隹", "青", "齿", "采", "隹"] },
	{ nb: 9, key: ["面", "音", "首", "香", "鬼", "革", "髟"] },
	{ nb: 10, key: ["高"] },
	{ nb: 11, key: ["麻", "黄"] },
	{ nb: 12, key: ["黑", "黍", "鼎"] },
	{ nb: 13, key: ["鼠"] },
	{ nb: 14, key: ["鼻"] },
];
const GRAM_LIST = [];

fillGramList();

function fillGramList() {
	GRAM_LIST["N."] = "Nom";
	GRAM_LIST["M.P."] = "Mot de position";
	GRAM_LIST["M.T."] = "Mot de temps";
	GRAM_LIST["Loc."] = "Locatif";
	GRAM_LIST["Pron."] = "Pronom";
	GRAM_LIST["Pron.Int"] = "Pronom interrogatif";
	GRAM_LIST["V."] = "Verbe";
	GRAM_LIST["V.D."] = "Verbe de direction";
	GRAM_LIST["V.Aux"] = "Verbe auxiliaire";
	GRAM_LIST["Adj."] = "Adjectif";
	GRAM_LIST["Num."] = "Numéral";
	GRAM_LIST["Spec."] = "Spécificatif";
	GRAM_LIST["Adv."] = "Adverbe";
	GRAM_LIST["Prep."] = "Préposition";
	GRAM_LIST["Conj."] = "Conjonction";
	GRAM_LIST["Part."] = "Particule";
	GRAM_LIST["S."] = "Sujet";
	GRAM_LIST["P."] = "Prédicat";
	GRAM_LIST["O."] = "Complément d'objet";
	GRAM_LIST["Deter."] = "Déterminatif";
	GRAM_LIST["Comple."] = "Complément";
	GRAM_LIST["C.C."] = "Complément circonstanciel";
	GRAM_LIST["V & N"] = "Verbe & Nom";
	GRAM_LIST["Prep & V"] = "Préposition & Verbe";
	GRAM_LIST["N & Spec"] = "Nom & spécificatif";
	GRAM_LIST["N & V.D"] = "Nom & Verbe de direction";
	GRAM_LIST["V.O."] = "Verbe + Objet";
	GRAM_LIST["Adv & Adj"] = "Adverbe & Adjectif";
	GRAM_LIST["V & Adj"] = "Verbe & Adjectif";
	GRAM_LIST["N & Adj"] = "Nom & Adjectif";
	GRAM_LIST["N & MT"] = "Nom & Mot de temps";
	GRAM_LIST["Chengyu"] = "Chéngyǔ";
	GRAM_LIST["N & Spec"] = "Nom & Spécificatif";
	GRAM_LIST["NP"] = "Nom propre";
	GRAM_LIST["Suff"] = "Suffixe";
	GRAM_LIST["Pref"] = "Préfixe";
	GRAM_LIST["V & Suff"] = "Verbe & Suffixe";
	GRAM_LIST["N Adv Adj"] = "Nom & Adverbe & Adjectif";
	GRAM_LIST["N V Adj"] = "Nom & Verbe & Adjectif";
	GRAM_LIST["V Conj"] = "Verbe & Conjonction";
	GRAM_LIST["V Adv"] = "Verbe & Adverbe";
	GRAM_LIST["Exp"] = "Expression";
	GRAM_LIST["Result"] = "Résultatif";
}

export const bushouList = BUSHOU_LIST;
export const lessonList = LESSON_LIST;
export const wordList = WORD_LIST;
export const hanziList = HANZI_LIST;
export const gramList = GRAM_LIST;
export const exampleList = EXAMPLE_LIST;
export const expressionList = EXPRESSION_LIST;