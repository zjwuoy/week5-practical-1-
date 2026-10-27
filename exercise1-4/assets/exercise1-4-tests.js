import { TestResults, advanceToFrame, checkBackgroundIsCalledInDraw, getShapes, runMouseClick, simulateKeyboardEvent } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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

async function clickTheMouse(hist) {
    window.mock_mouseX = random(width);
    window.mock_mouseY = random(height);
    hist.push({
        x: window.mock_mouseX,
        y: window.mock_mouseY
    });
    runMouseClick();
    await advanceToFrame(frameCount+1);
}

async function pressAKey(keyName, hist) {
    if (window.hasOwnProperty("keyPressed"))
        simulateKeyboardEvent(keyPressed, keyName);
    if (window.hasOwnProperty("keyReleased"))
        simulateKeyboardEvent(keyReleased, keyName);
    if (keyName === "z") {
        hist.pop();
    }
    await advanceToFrame(frameCount+1);
}

function checkLocations(hist, msgPrefix) {
    const actualShapes = getShapes();
    if (actualShapes.length !== hist.length) {
        TestResults.addFail(`${msgPrefix}, ${hist.length} shapes were expected but ${actualShapes.length} were found.`);
    } else {
        let allMatch = true;
        for (let i = 0; i < actualShapes.length; i++) {
            if (hist[i].x !== actualShapes[i].x || hist[i].y !== actualShapes[i].y) {
                allMatch = false;
                break;
            }
        }
        if (allMatch) {
            TestResults.addPass(`${msgPrefix}, the expected shapes are on the canvas.`);
        } else {
            TestResults.addFail(`${msgPrefix}, shapes were expected at the following locations: ${hist.map(h => "(" + h.x + ", " + h.y + ")").join(", ")}. Shapes were found at: ${actualShapes.map(h => "(" + h.x + ", " + h.y + ")").join(", ")}.`)
        }
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkBackgroundIsCalledInDraw();
    const hist = [];
    await clickTheMouse(hist);
    checkLocations(hist, "When the mouse is clicked for the first time");
    await clickTheMouse(hist);
    checkLocations(hist, "When the mouse is clicked a second time");
    await pressAKey("z", hist);
    checkLocations(hist, "when the 'z' key is pressed to undo");
    await pressAKey(" ", hist);
    checkLocations(hist, "when the space bar is pressed and nothing should happen");
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
