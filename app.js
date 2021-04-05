// visuals is an object containing functions and variables related to the visual content of the visual (sorry if that wording makes it hard to visualize how the visual changes the visuals)
const visual = {
  order: [], // list of numbers that are sorted
  elements: [], // DOM elements
  highlights: [], // index(es) of highlighted element(s)
  renderChanges: function () { // improve performance by not rerendering each element, just changing those that should be modified
    // "this" will point to a different place inside of the jQuery "each" function, so i need to extract what i need from "this" before that
    order = this.order;
    highlights = this.highlights;

    this.elements.each(function (index) {
      let bgColor;

      // set the bg color depending on whether or not the bar should be highlighted
      if (highlights.includes(index)) {
        bgColor = "danger";
      } else {
        bgColor = "primary";
      }

      // get the bar height given that the maximum height should be 400px
      function getBarHeight() {
        return (400 / this.order.length) * order[index];
      }

      if (order.length > 50) {
        $('.c_visual').removeClass('gx-1').addClass('gx-0');
      } else {
        $('.c_visual').removeClass('gx-0').addClass(['gx-1', 'rounded-top']);
      }

      // set the height and the class of the bars
      $(this)
        .find('div')
        .height(getBarHeight())
        .removeClass(['bg-danger', 'bg-primary'])
        .addClass('bg-' + bgColor);
    });
  },
  generate: function () { // use anon function notation so "this" points to this object
    // if there are any old bars, remove them
    $('.c_bar').remove();

    // generate the array that's used to render the visual using the user selected size
    const size = $('#sizeSelect').val();
    this.order = [];
    for (let i = 0; i < size; i++) {
      this.order.push(i + 1);
    }

    // create the bars
    this.order.forEach((value, index) => {
      const bar = $(
        `<div class="col c_bar">
          <div class="rounded-top"></div>
        </div>`
      );
      $(bar).find('div').height((value) * 30);
      $(".c_visual").append(bar);
    });
    this.elements = $('.c_bar');

    // render the visual
    this.renderChanges();
  },
  swap: function (firstIndex, secondIndex) { // swap the the values of bars
    const firstValue = this.order[firstIndex];
    this.order[firstIndex] = this.order[secondIndex];
    this.order[secondIndex] = firstValue;

    this.renderChanges();
  },
  setHighlights: function (highlights) { // set which bars are highlighted from an array of bar indexes
    if (highlights === null | highlights === undefined) {
      this.highlights = [];
    } else {
      this.highlights = highlights;
    }
    this.renderChanges();
  },
  shuffle: function () { // javascript implementation of a fisher-yates shuffle
    let order = this.order;
    var currentIndex = order.length, temporaryValue, randomIndex;

    // while there remain elements to shuffle...
    while (0 !== currentIndex) {

      // pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // and swap it with the current element
      temporaryValue = order[currentIndex];
      order[currentIndex] = order[randomIndex];
      order[randomIndex] = temporaryValue;
    }
    // then set the order and regenerate the visual
    this.order = order;
    this.renderChanges();
  },
  run: function () {
    const alg = $('#algorithmSelect').val();
    if (alg === 'bubble') return sort.bubbleSort();
    if (alg === 'insertion') return sort.insertionSort();
    if (alg === 'selection') return sort.selectionSort();
    unsupportedModal.toggle();
  }
};

// get the modal that shows the unsupported message
var unsupportedModal = new bootstrap.Modal(document.getElementById('unsupportedModal'));

// intially generate the visual
visual.generate();

const sort = {
  stepTime: $('#timeSelect').val(),
  isSorting: false,
  bubbleSort: async function () {
    this.setSortingStatus(true);

    for (let i = 0; i < visual.order.length - 1; i++) { // loop through each index
      for (let j = 0; j < visual.order.length - 1 - i; j++) { // for each index, loop until right before the already sorted part of the list
        await this.sleep(); // wait for the step time
        visual.setHighlights([j, j + 1]); // set the highlights for the visual
        if (visual.order[j] > visual.order[j + 1]) { // if the value of index j is greater than the value of index j + 1...
          visual.swap(j, j + 1); // swap the indexes j and j +1
        }
      }
    }

    this.setSortingStatus(false);
  },
  insertionSort: async function () {
    this.setSortingStatus(true);

    for (let i = 0; i < visual.order.length - 1; i++) { // loop through each index
      for (let j = i; j >= 0; j--) { // get the current element value and start looping backwards through the array
        await this.sleep(); // wait for the step time
        visual.setHighlights([j, j + 1]); // set the highlights for the visual
        if (visual.order[j] > visual.order[j + 1]) { // if the value of index j is greater than the value of index j + 1...
          visual.swap(j, j + 1); // swap the indexes j and j +1
        } else { //if not...
          j = 0; // end the loop by setting j to 0
        }
      }
    }

    this.setSortingStatus(false);
  },
  selectionSort: async function () {
    this.setSortingStatus(true);

    for (let i = 0; i < visual.order.length - 1; i++) { // loop through each index, i is the starting index of each search
      let smallestValueIndex = i; // the smallest value at first must be i since that's the only value scanned so far
      for (let j = i + 1; j < visual.order.length; j++) {
        await this.sleep(); // wait for step time
        visual.setHighlights([i, smallestValueIndex, j]);
        if (visual.order[smallestValueIndex] > visual.order[j]) {
          smallestValueIndex = j;
        }
      }
      visual.swap(smallestValueIndex, i);
    }

    this.setSortingStatus(false);
  },
  sleep: function () {
    return new Promise(resolve => setTimeout(resolve, this.stepTime)); // return a promise that resolves after the step time
  },
  setSortingStatus: function (isSorting, canShuffle) {
    sort.isSorting = isSorting;
    // disable shuffle and sort buttons if a sort is in progress
    $('#sortBtn').attr('disabled', isSorting).text(!isSorting ? 'Sort!' : 'Sorting...');
    $('#shuffleBtn').attr('disabled', isSorting).text(!isSorting ? 'Shuffle' : 'Sorting...');
  }
};
