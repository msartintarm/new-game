# new-game
The new game.

# Dev Env Setup
1. Install Git Bash. 
  - This is a shell that uses the Bash language and also has a lot of Unix command line programs.
  - It's used in this project so this program also would work on Linux / Mac.
2. Generate a SSH key for your machine + GitHub.
  - Otherwise you'd have to check out using HTTPS and authenticate each push.
  - Follow instructions here: https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/
  - Make sure the SSH key is added in your Github account (link on bottom of page).
3. Clone this repo using SSH: `git clone git@github.com:msartintarm/new-game.git game-dir`
  - Replace game-dir with your chosen directory
4. Change into the dir: `cd game-dir`
5. Make sure you have a couple dependencies installed:
  - npm
    - version should not matter but mine is v2.5.3
    - https://nodejs.org/download/release/v6.2.2/
    - npm comes with node
    - `npm -v` needs to return a version number after install -- if not you need to add the NPM binary directory to your PATH.
  - Python v2 or v3
    - Honestly the only thing Python does here is serve as a webserver. PHP would work equally well

# Installation
- `make install`
  - This makes NPM install some libraries [See Description Of Libraries]

# Build + Run Stuff
- `make serve`
  - The Makefile magically knows what's changed since the last build
- If Python2, you'll get an error -- use `make serve2`
- A webserver will start on http://localhost:3000

# Play Game
- open on your browser http://localhost:3000
- Toggle the bottom Canvas
- Play the game by clicking on the textarea field near 'Play'
  - Keyboard input is only accepted while focusing on tha telement
  - Use the left, right, and up arrow keys
- Draw stuff on the bottom canvas by clicking on it
  - The lines you draw show up on the page as coordinates
  - You can copy + paste the coordinates into the source files

# Description Of Libraries
- The sole purpose of these libraries are to let us write in ES6
- Except for one library `vec2` which is used as a math tool

### ES2015
  - ES2015 is a futuristic improved version of JS
    - https://babeljs.io/docs/learn-es2015/
    - Relating to this project, see sections: Arrows and Lexical This, Classes, Modules, Let + Const, Iterators
  - Browsers only understand vanilla JS, not ES6. They also do not understand the concept of modules.
  - So, we need to build our source files. It can be thought of as poor man's compilation from
a superset of JS into JS that would be crappy written by hand, but is inherently executable by the browser.
    - The JS all goes into one file. its common name is a `bundle`.
    - `browserify`: the build command used to convert our code from modules into the final file. 
    - `babelify`: a transformer that converts ES6 code into regular JS code. This transformation is 'fed' into browserify as a plugin
    - `exorcify`: Map the ES6 to the JS bundle
    
### React.Component
  - React components are classes can be expressed using something that looks like HTML.
  - The component writes HTML into another element on a 'render' call.
  - This is something that vanilla Javascript can do anyway.
  - Only used for components that need to manipulate HTML directly.
```
class TheButton extends React.Component() {
  constructor(props) {
    super(props);
  }
  render() {
    return (<button 
      size={this.props.size} value={this.props.value || "Enter a value.."} />
    );
  }  
}

ReactDOM.renderIntoElement(
  <TheButton size={20} value={30} />,
  document.getElementsByClassName('react_container')[0]
);
```

### gl-matrix / vec2
  - API for doing vector math
  - Points are stored in arrays [0,90,1,89,2,88] refers to a line made out of 3 XY points
  - The vec2 library can be used to subtract one set of points from each other: 
    - `vec2.sub([0,0], [20, 20], [15, 4])`. We see in the vec2 file that sub takes 3 arguments: out, a, b.
    - So the result would be that the array [0,0] is overwritten with the result: [5, 16]
    - Most of the time we'd want to have the same point be an output that is an input.
    - `let aa = [20, 20]; vec2.sub(aa, aa, [15,4]);`
  - To go over entire lines we use a `vec2.forEach` function that's exposed in the API
    - `vec2.forEach(longLine, 0, 0, 0, 0, vec2.sub, [1,2])`
    - All the zeroes are here for is let you do non-standard iterations over the array -- not needed for our purposes
    - This would go over a long array and change each pair of points in it by subtracting 1 from even points and 2 from odd points.
  - I added something called `forEach2` which lets you specify inputA, inputB, and output lines.
    - `vec2.forEach2(resultLine, longLineA, longLineB, 0, 0, 0, 0, vec2.sub)`
  
