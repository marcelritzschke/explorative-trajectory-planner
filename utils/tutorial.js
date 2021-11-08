let counterTutorial = 1;
// eslint-disable-next-line no-unused-vars
function setupTutorial() {
  document.getElementById('skipButton').onclick = () => {
    document.getElementById('tutorial').style.display = 'None';
  };

  document.getElementById('nextButton').onclick = () => {
    if (counterTutorial < 9) {
      counterTutorial++;
    }
    updateTutorial();
  };

  document.getElementById('previousButton').onclick = () => {
    if (counterTutorial > 1) {
      counterTutorial--;
    }
    updateTutorial();
  };
}

function updateTutorial() {
  switch (counterTutorial) {
    case 1:
      document.getElementById('tutorial').innerHTML = `
      <h3>Welcome to Explorative Trajectory Planning Visualizer!</h3>
      <h6>This short tutorial will walk you through all of the features of
      this application.</h6>
      <p>If you want to dive right in, feel free to press the "Skip Tutorial"
      button below. Otherwise, press "Next"!</p>
      <div id="tutorialCounter">1/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 2:
      document.getElementById('tutorial').innerHTML = `
      <h3>What is an Explorative Trajectory Planner ?</h3>
      <h6>At its core, an explorative trajectory planner tries to find a
      time-dependent path (hence trajectory) to get from a starting position
      to a goal position.<br><br>
      It has a short planning horizon and therfore needs to dynamically
      replan its trajectory, until it finally reaches its goal. This
      gives it the possibility to adapt to moving obstacles!</h6>
      <p></p>
      <div id="tutorialCounter">2/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 3:
      document.getElementById('tutorial').innerHTML = `
      <h3>What is the concept behind ?</h3>
      <h6>Under the hood, for each iteration a massive amount of trajectories
      are planned in parallel, a cost function is applied to each and the
      cheapest is chosen.<br><br>
      For more flexibility, trajectories itself are composed of several segments
      with fixed length. Each segment itsself is a trajectory.</h6>
      <p></p>
      <div id="tutorialCounter">3/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 4:
      document.getElementById('tutorial').innerHTML = `
      <h3>Let's get started!</h3>
      <h6>Drag and drop the car to move it to a desired position. You can also
      rotate the car! Do the same with the goal position. Click into cells of
      the grid to place some obstacles. You can also hold down the left mouse
      button and move the mouse to place walls!<br><br>
      Use the controls in the top middle to start, pause and reset the planner,
      or just step one cycle.</h6>
      <p>Congratulations! Hopefully you have been kind by placing obstacles and
      your car should have reached the goal. Now let's get into the settings.
      </p>
      <div id="tutorialCounter">4/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 5:
      document.getElementById('tutorial').innerHTML = `
      <h3>More Layers, please!</h3>
      <h6>You can easily expand the range of each planning cycle by
      raising the number of layers. But be aware, the processing time
      will increase with a linear time complexity with the layer number.</h6>
      <div id="tutorialCounter">5/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 6:
      document.getElementById('tutorial').innerHTML = `
      <h3>Better Range without increasing Processing Time?</h3>
      <h6>You can expand the range as well by increasing the layer length for
      each segment. This will give you more range by constant time complexity.
      However, the car will be much less able to maneuver around obstacles.</h6>
      <div id="tutorialCounter">6/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 7:
      document.getElementById('tutorial').innerHTML = `
      <h3>How are obstacles detected?</h3>
      <h6>On each cycle, between the starting position and end position of
      a single segment a linear interpolation is applied. You can change the
      interval of the interpolation (increasing interpolation time, means less
      sample points and a linear decrease in processing time). However, if the
      interpolation interval is to big, obstacles might not be detected! Really
      like a ghost car then :)</h6>
      <div id="tutorialCounter">7/9</div>
      <img id="mainTutorialImage" src="">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
  }
  setupTutorial();
}
