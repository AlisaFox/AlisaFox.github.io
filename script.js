//basics for the floating links

function RandomObjectMover(obj, container) {
  this.$object = obj;
  this.$container = container;
  this.container_is_window = container === window;
  this.pixels_per_second = 100;
  this.current_position = { x: 0, y: 0 };
  this.is_running = false;
  this.lock = 0;
}

RandomObjectMover.prototype._getContainerDimensions = function() {
  if (this.$container === window) {
    return {
      height: this.$container.innerHeight,
      width: this.$container.innerWidth
    };
  } else {
    return {
      height: this.$container.clientHeight,
      width: this.$container.clientWidth
    };
  }
};

RandomObjectMover.prototype._generateNewPosition = function() {
  // Get container dimensions minus div size
  var containerSize = this._getContainerDimensions();
  var availableHeight = containerSize.height - this.$object.clientHeight;
  var availableWidth = containerSize.width - this.$object.clientHeight;

  // Pick a random place in the space
  var y = Math.floor(Math.random() * availableHeight);
  var x = Math.floor(Math.random() * availableWidth);

  return { x: x, y: y };
};

RandomObjectMover.prototype._calcDelta = function(a, b) {
  var dx = a.x - b.x;
  var dy = a.y - b.y;
  var dist = Math.sqrt(dx * dx + dy * dy);
  return dist;
};

RandomObjectMover.prototype._moveOnce = function() {
  // Pick a new spot on the page
  var next = this._generateNewPosition();

  // How far do we have to move?
  var delta = this._calcDelta(this.current_position, next);

  // Speed of this transition, rounded to 2DP
  var speed = Math.round((delta / this.pixels_per_second) * 100) / 100;

  //console.log(this.current_position, next, delta, speed);

  this.$object.style.transition = "transform " + speed + "s linear";
  this.$object.style.transform =
    "translate3d(" + next.x + "px, " + next.y + "px, 0)";

  // Save this new position ready for the next call.
  this.current_position = next;
};

RandomObjectMover.prototype.start = function() {
  // Make sure our object has the right css set
  this.$object.willChange = "transform";
  this.$object.pointerEvents = "auto";

  this.boundEvent = this._moveOnce.bind(this);

  // Bind callback to keep things moving
  this.$object.addEventListener("transitionend", this.boundEvent);

  // Start it moving
  this._moveOnce();

  this.is_running = true;
};

RandomObjectMover.prototype.stop = function() {
  this.$object.removeEventListener("transitionend", this.boundEvent);
  //#TOFIX: stop movement right away, not at the end of the transition!
  this.is_running = false;
};

function lock() {
  if (x.lock == 0) {
  //i know that this is redundant, and a loop would be better here, #TOFIX
    x.lock = 1;
    y.lock = 1;
    z.lock = 1;
    v.lock = 1;
    w.lock = 1;
  } else {
    x.lock = 0;
    y.lock = 0;
    z.lock = 0;
    v.lock = 0;
    w.lock = 0;
  }
}
function on(o) {
  //turn overlay on
  document.getElementById(o).style.display = "block";
  //check if frozen, freeze if not
  if (x.is_running) {
    //was not paused before
    x.stop();
    y.stop();
    z.stop();
    v.stop();
    w.stop();
  } else {
    x.lock = 1; //notify that was paused before
  }
}

function off(o) {
  //turn overlay off
  document.getElementById(o).style.display = "none";

  if (x.is_running == 0 && x.lock == 0) {
    //was not paused before
    x.start();
    y.start();
    z.start();
    v.start();
    w.start();
  }
}

// Init it
var x = new RandomObjectMover(document.getElementById("a"), window);
var y = new RandomObjectMover(document.getElementById("b"), window);
var z = new RandomObjectMover(document.getElementById("c"), window);
var v = new RandomObjectMover(document.getElementById("d"), window);
var w = new RandomObjectMover(document.getElementById("e"), window);

// Freeze button
document.getElementById("freeze").addEventListener("click", function() {
  if (x.is_running) {
    x.stop();
    y.stop();
    z.stop();
    v.stop();
    w.stop();
  } else {
    x.start();
    y.start();
    z.start();
    v.start();
    w.start();
  }
});

// Start it off
x.start();
y.start();
z.start();
v.start();
w.start();
