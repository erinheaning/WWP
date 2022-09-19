/**
 * jsPsych 4-AFC task
 *
 * Martin Zettersten
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['vwp-prompt'] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('vwp-prompt', 'stimuli', 'image');

  plugin.info = {
    name: 'vwp-prompt',
    description: '',
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'A stimulus is a path to an image file.'
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
    }
  }

  plugin.trial = function(display_element, trial) {
    
    // variable to keep track of timing info and responses
    var start_time = 0;
    var responses = [];
 	 var rt = "NA";
  	var end_time = "NA";
    
  var trial_data={};

    // start timer for this trial
    start_time = performance.now();
	
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
  
  var center_trigger = paper.circle(400,425,50)
    center_trigger.attr({
      fill: "#ff7373",
      stroke: "#000",
      strokeWidth: 4

    });

  center_trigger.click(function() {
        center_trigger.animate({
          fill: "#008080"
        },300);

        center_trigger.unclick();
        // measure rt
        end_time = performance.now();
        rt = end_time - start_time;
          endTrial();
        });

    function endTrial() {
		

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
		rt: rt
	};

      jsPsych.finishTrial(trial_data);
	  
    }
  };

  return plugin;
})();
