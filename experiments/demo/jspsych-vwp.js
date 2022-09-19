/**
 * jsPsych 4-AFC task
 *
 * Martin Zettersten
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['vwp'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('explore-choice', 'stimuli', 'image');
  jsPsych.pluginAPI.registerPreload('coact-test', 'audio', 'audio');

  plugin.info = {
    name: 'explore-choice',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'A stimulus is a path to an image file.'
      },
      audio: {
        type: jsPsych.plugins.parameterType.AUDIO,
        pretty_name: 'Audio',
        default: undefined,
        array: false,
        description: 'Audio to be played'
      },
      canvas_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Canvas size',
        array: true,
        default: [800,800],
        description: 'Array specifying the width and height of the area that the animation will display in.'
      },
      image_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image size',
        array: true,
        default: [250,250],
        description: 'Array specifying the width and height of the images to show.'
      },
      instruction: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Instruction',
        array: false,
        default: "",
        description: 'instruction shown to participant'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      trial_ends_after_audio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Trial ends after audio',
        default: false,
        description: 'If true, then the trial will end as soon as the audio file finishes playing.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    
    // setup stimulus
    var context = jsPsych.pluginAPI.audioContext();
    var audio;
    // record webaudio context start time
    var start_time;
    // variable to keep track of timing info and responses
    var responses = [];
  	var choice = "NA";
 	 var choiceLocation = "NA";
 	 var rt = "NA";
  	var end_time = "NA";
    
  var trial_data={};

    // load audio file
    jsPsych.pluginAPI.getAudioBuffer(trial.audio)
      .then(function (buffer) {
        if (context !== null) {
          audio = context.createBufferSource();
          audio.buffer = buffer;
          audio.connect(context.destination);
        } else {
          audio = buffer;
          audio.currentTime = 0;
        }
        setupTrial();
      })
      .catch(function (err) {
        console.error(`Failed to load audio file "${trial.audio}". Try checking the file path. We recommend using the preload plugin to load audio files.`)
        console.error(err)
      });
	
    display_element.innerHTML = "<svg id='jspsych-test-canvas' width=" + trial.canvas_size[0] + " height=" + trial.canvas_size[1] + "></svg>";

    var paper = Snap("#jspsych-test-canvas");
	
  var rect1 = paper.rect(25, 75, 300,300,10);
  rect1.attr({
	  fill: "#ffffff",
	  stroke: "#000",
	  strokeWidth: 5
  });
  
  var rect2 = paper.rect(475, 75, 300,300,10);
  rect2.attr({
	  fill: "#ffffff",
	  stroke: "#000",
	  strokeWidth: 5
  });
  
  var rect3 = paper.rect(25, 475, 300,300,10);
  rect3.attr({
	  fill: "#ffffff",
	  stroke: "#000",
	  strokeWidth: 5
  });
  
  var rect4 = paper.rect(475, 475, 300,300,10);
  rect4.attr({
	  fill: "#ffffff",
	  stroke: "#000",
	  strokeWidth: 5
  });
  
  var imageLocations = {
	  topleft: [50, 100],
	  topright: [500, 100],
	  bottomleft: [50, 500],
	  bottomright: [500, 500],
	  
  };

  var instruction = paper.text(400,95,trial.instruction);
  instruction.attr({
		  "text-anchor": "middle",		  
		  "font-weight": "bold",
		  "font-size": 20
	  });
  
  var image1 = paper.image(trial.stimuli[0], imageLocations["topleft"][0], imageLocations["topleft"][1], trial.image_size[0],trial.image_size[1]);
  var image2 = paper.image(trial.stimuli[1], imageLocations["topright"][0], imageLocations["topright"][1], trial.image_size[0],trial.image_size[1]);
  var image3 = paper.image(trial.stimuli[2], imageLocations["bottomleft"][0], imageLocations["bottomleft"][1], trial.image_size[0],trial.image_size[1]);
  var image4 = paper.image(trial.stimuli[3], imageLocations["bottomright"][0], imageLocations["bottomright"][1], trial.image_size[0],trial.image_size[1]);
  
    function setupTrial() {
     // set up end event if trial needs it
      if (trial.trial_ends_after_audio) {
        audio.addEventListener('ended', endTrial);
      }

      // start time
      start_time = performance.now();

      // start audio
      if (context !== null) {
        start_time = context.currentTime;
        audio.start(start_time);
      } else {
        audio.play();
      }

      // launch image choices
      image_choices()

    // end trial if time limit is set
      if (trial.trial_duration !== null) {
        jsPsych.pluginAPI.setTimeout(function () {
          endTrial();
        }, trial.trial_duration);
      }
    }


function image_choices() {
  image1.click(function() {
	  rect1.attr({
		  fill: "#00ccff",
		  "fill-opacity": 0.5
	  });
	  choice = trial.stimuli[0];
	  choiceLocation = "pos1";
	  inputEvent();
  });

  image2.click(function() {
	  rect2.attr({
		  fill: "#00ccff",
		  "fill-opacity": 0.5
	  });
	  choice = trial.stimuli[1];
	  choiceLocation = "pos2";
	  inputEvent();
  });
  
  image3.click(function() {
	  rect3.attr({
		  fill: "#00ccff",
		  "fill-opacity": 0.5
	  });
	  choice = trial.stimuli[2];
	  choiceLocation = "pos3";
	  inputEvent();
  });

  image4.click(function() {
	  rect4.attr({
		  fill: "#00ccff",
		  "fill-opacity": 0.5
	  });
	  choice = trial.stimuli[3];
	  choiceLocation = "pos4";
	  inputEvent();
	  
  });
};

  function inputEvent() {
  	image1.unclick();
		image2.unclick();
		image3.unclick();
		image4.unclick();

	  end_time = performance.now();
	  rt = end_time - start_time;
	  setTimeout(function(){
	  	endTrial();
	  },500);
  }


    function endTrial() {

    	// stop the audio file if it is playing
      // remove end event listeners if they exist
      if (context !== null) {
        audio.stop();
      } else {
        audio.pause();
      }
      audio.removeEventListener('ended', endTrial);
		

      display_element.innerHTML = '';

	  
      var trial_data = {
		//"label": trial.label,
		start_time: start_time,
		end_time: end_time,
		stimuli: trial.stimuli,
		image1: trial.stimuli[0],
		image2: trial.stimuli[1],
		image3: trial.stimuli[2],
		 image4: trial.stimuli[3],
		choiceLocation: choiceLocation,
		choiceImage: choice,
		rt: rt
	};

      jsPsych.finishTrial(trial_data);
	  
    }
  };

  return plugin;
})();
