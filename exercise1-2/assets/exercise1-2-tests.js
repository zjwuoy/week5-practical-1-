import { simulateMousePosition, TestCircle, TestResults, TestTriangle, advanceToFrame, checkBackgroundIsCalledInDraw, checkCanvasSize, checkShapes, getShapes, runMouseClick, testShapesMatchInOrder } from "https://cdn.jsdelivr.net/gh/Supportive-IDE/p5js-testing-demo@latest/p5jsTestingLibrary.js";

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

function createStar(x, y) {
    return [
        new TestTriangle(x, y - 50, x - 20, y, x + 20, y),
        new TestTriangle(x - 50, y - 20, x, y - 20, x, y + 10),
        new TestTriangle(x + 50, y - 20, x, y - 20, x, y + 10),
        new TestTriangle(x - 20, y - 5, x, y + 10, x - 35, y + 30),
        new TestTriangle(x, y + 10, x + 20, y - 5, x + 35, y + 30)
    ];
}

function fall(expected) {
    for (const s of expected) {
        s.y += 2;
        s.h += 2;
        s.y1 += 2;
        s.y2 += 2;
        s.y3 += 2;
    }
}

async function runTests(canvas) {
    canvas.style.pointerEvents = "none";
    const resultsDiv = document.getElementById("results");
    checkBackgroundIsCalledInDraw();
    const expected = [];
    // mouseX = 30;
    // mouseY = 45;
    simulateMousePosition(30, 45);
    const listener = runMouseClick();
    if (!listener) {
        TestResults.addFail("No mouse event listener has been implemented. Implement <code>mouseClicked()</code>.");
    }
    expected.push(...createStar(30, 45));
    await advanceToFrame(frameCount + 1);
    let shapes = getShapes();
    if (testShapesMatchInOrder(expected, shapes, false)) {
        TestResults.addPass("When the mouse is first clicked, a star is added in the expected location.");
    } else {
        TestResults.addFail("When the mouse is clicked, a star should be drawn at the mouse coordinates.");
    }
    // updated the expected shapes
    fall(expected);
    await advanceToFrame(frameCount + 1);
    shapes = getShapes();
    if (testShapesMatchInOrder(expected, shapes, false)) {
        TestResults.addPass("When there is one star, it falls 2 pixels after one frame.");
    } else {
        TestResults.addFail("The first star does not appear to fall by 2 pixels after one frame.");
    }
    // second click
    // mouseX = 275;
    // mouseY = 33;
    simulateMousePosition(275, 33);
    runMouseClick();
    fall(expected);
    expected.push(...createStar(275, 33));
    await advanceToFrame(frameCount + 1);
    shapes = getShapes();
    if (testShapesMatchInOrder(expected, shapes, false)) {
        TestResults.addPass("When the mouse is clicked again, a second star is added in the expected location. The first star falls two pixels down the screen.");
    } else {
        TestResults.addFail("When the mouse is clicked again, a second star should be drawn at the mouse coordinates and, on the next frame, the first star should fall another two pixels down the screen.");
    }
    // updated the expected shapes
    fall(expected);
    await advanceToFrame(frameCount + 1);
    shapes = getShapes();
    if (testShapesMatchInOrder(expected, shapes, false)) {
        TestResults.addPass("When there are two stars, both fall 2 pixels after one frame.");
    } else {
        TestResults.addFail("One or both stars are not updated after one frame.");
    }
    TestResults.display(resultsDiv);
}


const loadTimer = setInterval(waitForP5, 500);
