(function(){
const defaultResultType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
const VERSION = "0.0.1";

function advanceFind(opts){
	const {tagName, attrs, context, global=true, contains=true} = opts;
	if(context && context.constructor===Object){
		context = advanceFind(context);
	}else if(typeof(context)==="string"){
		context = findNode(context, null);
		if(context){
			context = context.snapshotItem(0);
		}
	}
	return lookup(tagName, attrs, context || document, global, contains);
}

function lookup(tagName, attrs, context, isGlobal, isContains){
	const expr = getFinalExpr(tagName, attrs, isGlobal, isContains);
	let ret = evaluate(expr, context, defaultResultType);
	if(ret.snapshotLength){
		return ret.snapshotLength > 1 ? ret : ret.snapshotItem(0);
	}
	return ret;
}
function findNode(selector, context){
	/*
	use selector as id, name, class, tagName, text, value
	context could be a selector, dom, or null
	*/
	if(!selector){
		return null;
	}

	let ret;
	try{
		ret = document.querySelectorAll(selector);
	}catch(e){}
	if(ret && ret.length){
		return ret.length > 1 ? ret : ret[0];
	}
	if(typeof(context) === "string"){
		context = findNode(context, null);
	}
	context = context || document;
	
	const possibleAttrs = [
		{text: selector},
		{value: selector},
	];
	let result, 
		possibleIdx = 0,
		attr = possibleAttrs[possibleIdx];
	while(!result && attr){
		result = lookup(null, attr, context, true, true);
		possibleIdx++;
		attr = possibleAttrs[possibleIdx];
	}
	return result;
}

function evaluate(expr, context=document, resultType){
	return document.evaluate(expr, context, null, resultType, null);
}

function getFinalExpr(tagName, attrs, isGlobal, isContains){
	tagName = tagName || "*";
	const prefix = getPrefixExpr(tagName, isGlobal);
	const condition = getConditionExpr(attrs, isContains);
	return prefix + condition;
}

function getPrefixExpr(tagName, isGlobal){
	let prefix = isGlobal ? ".//" : "./";
	return `${prefix}${tagName}`;
}

function getConditionExpr(objs, isContains){
	let ret = Object.keys(objs || {}).map((key, i)=>{
		return pairExpr(key, objs[key], isContains)
	}).join(" and ");
	if(ret.length){
		return `[${ret}]`;
	}
	return "";
}

function pairExpr(key, value, isContains){
	var keyMap = {
		"text": "text()"
	};
	key = keyMap[key] || `@${key}`;

	if(isContains){
		return `contains(${key}, "${value}")`;
	}else{
		return `${key}="${value}"`;
	}
}
function version(){
	return VERSION;
}

if(typeof module!=="undefined" && module.exports){
	module.exports = {
		findNode,
		advanceFind,
		version
	};
}else{
	window.Finder = {
		findNode,
		advanceFind,
		version
	};
}
})();