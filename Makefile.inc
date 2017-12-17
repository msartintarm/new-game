SRC_CSS_DIR:= src/css
SRC_JS_DIR:= src/js
SRC_JS_DIR2:= src/js/LineSegmented
WORK_DIR:= work

SRC_SCSS:= $(SRC_CSS_DIR)/style.scss
ENTRY_JS = $(SRC_JS_DIR)/index.js
SRC_JS:= $(SRC_JS_DIR)/*.js $(SRC_JS_DIR2)/*.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_MAP:= $(WORK_DIR)/map.js
JS_TARGET_TEMP:= $(JS_TARGET).temp
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js

CSS_TARGET:= $(WORK_DIR)/bundle.css


RM := rm -f
RM_DIR := $(RM) -r

# Quite a lot of Babel plugins are needed to get ES6 + React compilation
NPM_BABELIFY := babelify babel-preset-react babel-preset-es2015 babel-plugin-transform-class-properties minifyify
NPM_PACKAGES := browserify $(NPM_BABELIFY) eslint babel-eslint eslint-plugin-react
NPM_INSTALL := npm install --save-dev $(NPM_PACKAGES)

BR := browserify
EXORCIST := node_modules/exorcist/bin/exorcist.js


UGLIFY_FLAGS := --uglify [ --compress [ --warnings --unsafe --side_effects --join_vars --loops --evaluate --properties --sequences --comparisons --booleans --hoist_funs --hoist_vars if_return --dead_code --conditionals --unused --if_return ] --mangle --screw-ie8 ]

MINIFYIFY := minifyify --map map.js --output $(JS_MAP) $(UGLIFY_FLAGS)

BABELIFY := babelify  --sourceMapsAbsolute --presets [ es2015 react ] --plugins [ transform-class-properties ]
BR_FLAGS := --detect-globals=false -d -p [ $(MINIFYIFY) ] -t [ $(BABELIFY) ]
