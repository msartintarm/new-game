
/*
    Determines precedence of elements in handler map
    1. target element class name -- example the_button
    2. target element tag name (uppercase) -- for example Canvas
*/
const getElemKey = (elem) => { return elem.className || elem.tagName; };

/* Looks for handler defined in mapping for target element */
const handler = (e, map) => {
    const theFunction = map[getElemKey(e.target)];
    return theFunction? theFunction(e):
        map.default? map.default(e):
            null;
};

const eventmap = {
    tick: {}
};

const registeredHandlerMap = { tick: {} };
const tickCountMap = {};

const registerHandler = (evName, key, theFunction) => {

    // invoke page level function if it doesn't exist already
    if (!(evName in registeredHandlerMap)) {
        eventmap[evName] = {};
        registeredHandlerMap[evName] =
            (e) => { handler(e, eventmap[evName]); };
        document.addEventListener(evName, registeredHandlerMap[evName]);
    }
    eventmap[evName][key] = theFunction;
};

const deregisterHandler = (evName, key) => {
    if (evName in registeredHandlerMap &&
        key in registeredHandlerMap[evName]) {
        delete eventmap[evName][key];
    }
};

/* lets you query whether a tick event is active */
const checkTickEvent = (key) => {
    return (key in registeredHandlerMap.tick);
};

/* get rid of this event */
const deregisterTickEvent = (key) => {
    if (checkTickEvent(key)) {
        delete eventmap.tick[key];
        delete registeredHandlerMap.tick[key];
        return;
    }
};

/* unique key for function,
    function itself,
    num times to run (0 if unlimited),
    replace if should override previous function */
const registerTickEvent = (key, theFunction, numTimes, replace) => {
    if (key in registeredHandlerMap.tick) {
        if (!replace) return; // no duplicate functions
    }

    eventmap.tick[key] = theFunction;
    tickCountMap[key] = 0;

    registeredHandlerMap.tick[key] = () => {
        if (numTimes > 0 && tickCountMap[key] >= numTimes ) {
            deregisterTickEvent(key);
            return;
        }
        tickCountMap[key] += 1;
        eventmap.tick[key]();
    };
};

const onTick = () => { // call after requesting animation frame
    const theList = registeredHandlerMap.tick;
    for (const name in theList) {
        theList[name]();
    }
}

export { registerHandler, deregisterHandler, checkTickEvent, registerTickEvent, deregisterTickEvent, onTick };
