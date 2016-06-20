RM := rm -f
RM_DIR := $(RM) -r

# Quite a lot of Babel plugins are needed to get ES6 + React compilation
NPM_BABELIFY := babelify babel-preset-es2015 babel-preset-react babel-plugin-transform-class-properties
NPM_PACKAGES := browserify $(NPM_BABELIFY) exorcist
NPM_INSTALL := npm install --save-dev $(NPM_PACKAGES)

BR := browserify
EXORCIST := node_modules/exorcist/bin/exorcist.js

BABELIFY := babelify --presets [ es2015 react ] --plugins [ transform-class-properties ]
BR_FLAGS := --detect-globals=false -d -t [ $(BABELIFY) ]

