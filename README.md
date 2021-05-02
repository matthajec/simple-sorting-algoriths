# Simple Sorting Algorithms
## Description
A website to visualize a few simple sorting algorithms. You can slow down or speed up the sorting so you can see how each algorithm performs.

## Frameworks(s)/Package(s)
* Bootstrap
* jQuery

## Challenges

* Organzing the code. I had issues when creating this project with having a very cluttered js file. I didn't want to add the complexity of splitting it into multiple files, so instead I split up the core functions into 2 objects. The first one, ```visual``` contains the functions and variables needed to render the visual, such as managing highlights and the height of the lines. The next object, called ```sort``` contains everything related to the logic of sorting, it will perform an action and then call on the visual object to make changes to the screen.

* Adding adjustable speed. Originally I used an interval, but this was very messy. I came up with another solution which was to create a function which generates a promise that resolves after some designated amount of time. Using async/await, this is very simple to implement in one line. Heres the code for the promise generator function:
  ```javascript
    sleep: function () { // note that this is inside of an object...
      return new Promise(resolve => setTimeout(resolve, this.stepTime)); // with a variable called stepTime we can access like this
    },
  ```
  Here's an example of how it could be used:
  ```javascript
    async function printAfterOneSecond(message) {
      await sleep()
      console.log(message)
    }
  ```
