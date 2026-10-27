import { simulateMousePosition, TestCircle, TestResults, advanceToFrame, checkBackgroundIsCalledInDraw, checkCanvasSize, getShapes, testShapesMatchWithoutOrder } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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

function createExpectedShapes(xVals, yVals) {
    const shapes = [];
    for (let i = 0; i < xVals.length; i++) {
        shapes.push(new TestCircle(xVals[i], yVals[i], 20 - (xVals.length - (i + 1)) * 2));
    }
    return shapes;
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkBackgroundIsCalledInDraw();
    // On load
    const xVals = [window.mock_mouseX];
    const yVals = [window.mock_mouseY];
    await advanceToFrame(frameCount + 1);


    // Frame 2
    // window.mock_mouseX = 3;
    // window.mock_mouseY = 5;
    simulateMousePosition(3, 5);
    xVals.push(window.mock_mouseX);
    yVals.push(window.mock_mouseY);
    await advanceToFrame(frameCount + 1);

    // Frame 3
    // window.mock_mouseX = 6;
    // window.mock_mouseY = 6;
    simulateMousePosition(6, 6);
    xVals.push(window.mock_mouseX);
    yVals.push(window.mock_mouseY);
    await advanceToFrame(frameCount + 1);


    // Frame 4
    // window.mock_mouseX = 5;
    // window.mock_mouseY = 7;
    simulateMousePosition(5, 7);
    xVals.push(window.mock_mouseX);
    yVals.push(window.mock_mouseY);
    await advanceToFrame(frameCount + 1);

    // Frame 5
    // window.mock_mouseX = 7;
    // window.mock_mouseY = 10;
    simulateMousePosition(7, 10);
    xVals.push(window.mock_mouseX);
    yVals.push(window.mock_mouseY);
    await advanceToFrame(frameCount + 1);

    // Frame 6
    // window.mock_mouseX = 11;
    // window.mock_mouseY = 11;
    simulateMousePosition(11, 11);
    xVals.push(window.mock_mouseX);
    yVals.push(window.mock_mouseY);
    await advanceToFrame(frameCount + 1);

    // 5 most recent
    const expected1 = createExpectedShapes(xVals.slice(1), yVals.slice(1));
    // Doesn't include the most recent
    const expected2 = createExpectedShapes(xVals.slice(0, 5), yVals.slice(0, 5));
    const actual = getShapes();
    if (actual.length === 5) {
        TestResults.addPass("There are 5 shapes");
    } else {
        TestResults.addFail(`Expected 5 shapes but found ${actual.length}`);
    }

    if (testShapesMatchWithoutOrder(expected1, actual)) {
        TestResults.addPass("There are 5 circles following the mouse. The most recently added circle is 20 pixels in diameter. Each older circle is 2px smaller than the one that came after it.");
    } 
    else if (testShapesMatchWithoutOrder(expected2, actual)) {
        TestResults.addPass("There are 5 circles following the mouse. The most recent circle is 20 pixels in diameter. Each older circle is 2px smaller than the one that came after it.")
    }
    else {
        let msg = "The shapes aren't quite right. The following shapes were expected: ";
        msg += expected1.map(s => `${s.type} at ${s.x}, ${s.y} with a diameter of ${s.w}px`).join("; ") + ". The following shapes were found: ";
        msg += actual.map(s => `${s.type} at ${s.x}, ${s.y} with a diameter of ${s.w}px`).join("; ") + ".";
        TestResults.addFail(msg);
    }

    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
