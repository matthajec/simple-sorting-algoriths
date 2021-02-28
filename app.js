// visuals is an object containing functions and variables related to the visual content of the visual (sorry if that wording makes it hard to visualize how the visual changes the visuals)
const visual = {
  order: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  highlights: [],
  generate: function () { // use anon function notation so "this" points to this object
    $('.c_bar').remove();

    this.order.forEach((value, index) => {
      let bgColor;

      // set the bg color depending on whether or not the bar should be highlighted
      if (this.highlights.includes(index)) {
        bgColor = "danger";
      } else {
        bgColor = "primary";
      }

      // create the bar
      const bar = $(
        `<div data-value="${value}" class="col c_bar">
          <div style="height: ${(value) * 30}px;" class="rounded-top bg-${bgColor}"></div>
        </div>`
      );
      $(".c_visual").append(bar);
    });
  },
  swap: function (firstIndex, secondIndex) {
    const order = this.order;

    const firstValue = order[firstIndex];
    order[firstIndex] = order[secondIndex];
    order[secondIndex] = firstValue;

    this.generate();
  },
  setHighlights: function (highlights) {
    if (highlights === null | highlights === undefined) {
      this.highlights = [];
    } else {
      this.highlights = highlights;
    }
    this.generate();
  },
  shuffle: function () {
    let order = this.order;
    var currentIndex = order.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = order[currentIndex];
      order[currentIndex] = order[randomIndex];
      order[randomIndex] = temporaryValue;
    }

    this.order = order;
    this.generate();
  }
};

visual.generate();

function bubbleSort() {
  function pass(cb) {
    let swaps = 0;
    let iteration = 1;

    let passInterval = setInterval(() => {
      currentIndex = iteration;
      prevIndex = iteration - 1;

      currentValue = visual.order[currentIndex];
      prevValue = visual.order[prevIndex];

      visual.setHighlights([prevIndex, currentIndex]);

      if (currentValue < prevValue) {
        visual.swap(currentIndex, prevIndex);
        swaps++;
      }

      if (iteration === visual.order.length - 1) {
        clearInterval(passInterval);
        cb(swaps);
      } else {
        iteration++;
      }

    }, 150);
  }

  function run() {
    pass((swaps) => {
      console.log(swaps);
      if (swaps > 0) {
        run();
      }
    });
  }

  run();
}