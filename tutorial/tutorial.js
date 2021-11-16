let counterTutorial = 1;
// eslint-disable-next-line no-unused-vars
function setupTutorial() {
  document.getElementById('skipButton').onclick = () => {
    document.getElementById('tutorial').style.display = 'None';
  };

  if (counterTutorial === 12) {
    document.getElementById('finishButton').onclick = () => {
      document.getElementById('tutorial').style.display = 'None';
    };
  } else {
    document.getElementById('nextButton').onclick = () => {
      if (counterTutorial < 12) {
        counterTutorial++;
      }
      updateTutorial();
    };
  }

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
      <h3>Welcome to Path & Trajectory Planning Visualizer!</h3>
      <h6>This short tutorial will walk you through all of the features of
      this application.</h6>
      <p>If you want to dive right in, feel free to press the "Skip Tutorial"
      button below. Otherwise, press "Next"!</p>
      <div id="tutorialCounter">1/12</div>
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
      <h3>What is a Trajectory Planner ?</h3>
      <h6>At its core, a trajectory planner tries to find a
      time-dependent path (hence trajectory) to get from a starting position
      to a goal position.<br><br>
      It has a short planning horizon and therfore needs to dynamically
      replan its trajectory, until it finally reaches its goal. This
      gives it the possibility to adapt to moving obstacles!</h6>
      <p></p>
      <div id="tutorialCounter">2/12</div>
      <img id="mainTutorialImage" src="../assets/trajectory.jpg">
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
      are planned in parallel (explorative approach), a cost function is
      applied to each and the best is used for further exploration.<br><br>
      For more flexibility, trajectories itself are composed of several segments
      with fixed length. Each segment itsself is a trajectory.</h6>
      <p></p>
      <div id="tutorialCounter">3/12</div>
      <img id="mainTutorialImage" src="../assets/exploration-sketch.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 4:
      document.getElementById('tutorial').innerHTML = `
      <h3>Put yourself in position!</h3>
      <h6>To make it a bit more realistic, your starting position will be
      simulated as car. You can drag and drop it to move it to a desired
      position. You can also rotate the car! 
      Your goal is just simulated as a point. For simplicity the end direction
      of the car is not considered. Also place your goal at the desired
      position!</h6>
      <p></p>
      <div id="tutorialCounter">4/12</div>
      <img id="mainTutorialImage" src="../assets/ego-goal.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 5:
      document.getElementById('tutorial').innerHTML = `
      <h3>Put some obstacles in between</h3>
      <h6>To make things more interesting you can put obstacles in the way.
      To do so, just click some cells within the grid. The state of the cell
      will be toggled with each click. You can also hold down the left mouse
      button and move the mouse to place many obstacles at once.</h6>
      <p></p>
      <div id="tutorialCounter">5/12</div>
      <img id="mainTutorialImage" src="../assets/obstacles.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 6:
      document.getElementById('tutorial').innerHTML = `
      <h3>Off we go!</h3>
      <h6>Finally, use the controls in the top middle to start, pause or reset
      the planner. You can also just step one cycle, if you would like to have
      a closer look at some scenarios. Your car should now start moving in the
      direction of the goal. However it will only try to minimize the direct
      connection (Euclidian Distance) between your current position and the
      goal. Therefore, it might get stuck on the way. There are several things
      you can do, to help your car nonetheless to reach the goal!</h6>
      <p></p>
      <div id="tutorialCounter">6/12</div>
      <img id="mainTutorialImage" src="../assets/controls.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 7:
      document.getElementById('tutorial').innerHTML = `
      <h3>Give a path for guidance!</h3>
      <h6>At any time, you can start a path planner (your trajectory
      planner must be in paused state). The Path planner uses an A*
      algorithm to find the closest path to your goal considering the
      obstacles you have placed. Your car will then try to follow the
      path.</h6>
      <p></p>
      <div id="tutorialCounter">7/12</div>
      <img id="mainTutorialImage" src="../assets/path-planner.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 8:
      document.getElementById('tutorial').innerHTML = `
      <h3>More Layers, please!</h3>
      <h6>You can easily expand the range of each planning cycle by
      raising the number of layers. But be aware, the processing time
      will increase in a linear fashion.</h6>
      <div id="tutorialCounter">8/12</div>
      <img id="mainTutorialImage" src="../assets/adjust-layer-number.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 9:
      document.getElementById('tutorial').innerHTML = `
      <h3>Better Range without increasing Processing Time?</h3>
      <h6>You can expand the range as well by increasing the layer length for
      each segment. This will give you more range by constant time complexity.
      However, the car will be much less able to maneuver around obstacles.</h6>
      <div id="tutorialCounter">9/12</div>
      <img id="mainTutorialImage" src="../assets/adjust-layer-length.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 10:
      document.getElementById('tutorial').innerHTML = `
      <h3>How are obstacles detected?</h3>
      <h6>On each cycle, between the starting position and end position of
      a single segment a linear interpolation is applied. You can change the
      interval of the interpolation (increasing interpolation time, means less
      sample points and a linear decrease in processing time). However, if the
      interpolation interval is to big, obstacles might not be detected and
      ghosting can occur!</h6>
      <div id="tutorialCounter">10/12</div>
      <img id="mainTutorialImage" src="../assets/adjust-interpolation.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 11:
      document.getElementById('tutorial').innerHTML = `
      <h3>Smoother driveability?</h3>
      <h6>As stated earlier, the planner calculates a huge amount of
      trajectories in parallel. The number of these trajectories is determined
      by defining desired velocities and steering angles the car should be in
      at the end of each trajectory. The total number of trajectories will be
      the number of end steering angles times the number of end velocities. But
      be careful this will directly effect your processing time, since we are 
      not parallelizing the calculation here! However this is also the strength
      of the algorithm. With the right hardware (like a graphic card) you can 
      increase the number of trajectories by only less increase in processing
      time!</h6>
      <div id="tutorialCounter">11/12</div>
      <img id="mainTutorialImage" src="../assets/sampling.jpg">
      <button id="nextButton" class="button" type="button">Next</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    case 12:
      document.getElementById('tutorial').innerHTML = `
      <h3>Congratulations!</h3>
      <h6>You made it through the tutorial. Have fun with the planner. However
      keep in mind, that the implementation is not perfect. It is mainly
      designed as visualization and object of learning.<br><br>
      Have fun playing around and be careful with the parametrization!</h6>
      <div id="tutorialCounter">12/12</div>
      <img id="mainTutorialImage" src="../assets/traj-planner.jpg">
      <button id="finishButton" class="button" type="button">Finish</button>
      <button id="previousButton" class="button" type="button">Previous
      </button>
      <button id="skipButton" class="button" type="button">Skip Tutorial
      </button>
      `;
      break;
    default:
      break;
  }
  setupTutorial();
}
