import { TestCircle, TestResults, checkBackgroundIsCalledInDraw, checkCanvasSize, checkShapes, getShapes, runMouseClick } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

/**
 * A hacky solution to wait for p5js to load the canvas. Include in all exercise test files.
 */
function waitForP5() {
    const canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
        clearInterval(loadTimer);
        runTests(canvases[0]);
    }
}

function arraysAreEqual(expected, actual) {
    if (expected === undefined || actual === undefined || expected.length !== actual.length) {
        return false;
    }
    for (const i in expected) {
        if (expected[i] !== actual[i]) {
            return false;
        }
    }
    return true;
}


function checkDiametersSetup() {
    const expected = [360, 280, 200, 150];
    try {
        if (diameters && arraysAreEqual(expected, diameters)) {
            TestResults.addPass("There is a global array variable called <code>diameters</code> that contains the expected values.");
            return true;
        } else {
            TestResults.addFail(`The sketch contains a global array variable called <code>diameters</code> but it does not contain the expected values. Expected [${expected.join()}], found [${diameters.join()}]`);
            return false;
        }
    } catch (e) {
        TestResults.addFail("Sketch does not contain a global variable called <code>diameters</code>.");
        return false;
    }
}

function checkColourValsSetup() {
    const expected = [60, 140, 180, 255];
    try {
        if (colourVals && arraysAreEqual(expected, colourVals)) {
            TestResults.addPass("There is a global array variable called <code>colourVals</code> that contains the expected values.");
            return true;
        } else {
            TestResults.addFail(`The sketch contains a global array variable called <code>colourVals</code> but it does not contain the expected values. Expected [${expected.join()}], found [${colourVals.join()}]`);
            return false;
        }
    } catch (e) {
        TestResults.addFail("Sketch does not contain a global variable called <code>colourVals</code>.");
        return false;
    }
}

function checkCircleDiameters() {
    const expectedShapes = [
        new TestCircle(width / 2, height / 2, 360),
        new TestCircle(width / 2, height / 2, 280),
        new TestCircle(width / 2, height / 2, 200),
        new TestCircle(width / 2, height / 2, 150)
    ]
    const actual = getShapes();
    checkShapes(expectedShapes, actual, true, false);
}

function checkMouseClick(expected, prefixMsg) {
    let clickExists = runMouseClick(expected);
    // check pop, unshift
    if (arraysAreEqual(expected, colourVals)) {
        TestResults.addPass(`The ${prefixMsg} the mouse is clicked, the <code>colourVals</code> array has the expected values.`);
    } else {
        TestResults.addFail(`The ${prefixMsg} the mouse is clicked, the value of <code>colourVals</code> should be <code>[${expected.join()}]</code>. Found <code>[${colourVals.join()}]</code>.${clickExists ? "" : " Have you implemented <code>mouseClicked()</code>?"}`);
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkCanvasSize(400, 400);
    const diaCorrect = checkDiametersSetup();
    const colCorrect = checkColourValsSetup();
    if (diaCorrect) {
        checkCircleDiameters();
    }
    if (colCorrect) {
        checkMouseClick([255, 60, 140, 180], "first time");
        checkMouseClick([180, 255, 60, 140], "second time");
        checkMouseClick([140, 180, 255, 60], "third time");
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
