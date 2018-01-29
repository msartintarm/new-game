ENV := NODE_ENV=dev
SRC_DIR:= src
WORK_DIR:= work

SRC_SCSS:= $(SRC_DIR)/css/style.scss
ENTRY_JS = $(SRC_DIR)/js/index.js
SRC_JS:= $(SRC_DIR)/js/*.js $(SRC_DIR)/js/LineSegmented/*.js webserver.js .eslintrc.json

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_MAP:= $(WORK_DIR)/map.js
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js
CSS_TARGET:= $(WORK_DIR)/bundle.css

# Get ES6 + React compilation + type checking
BABELIFY_PACKAGES := babel-core babelify babel-preset-react babel-preset-env babel-plugin-transform-class-properties
BROWSERIFY_PACKAGES := browserify envify uglify-js uglifyify
ESLINT_PACKAGES := eslint babel-eslint eslint-plugin-react eslint-plugin-node
REACT_PACKAGES := react react-dom
NPM_INSTALL := npm install --save-dev $(BABELIFY_PACKAGES) $(BROWSERIFY_PACKAGES) $(ESLINT_PACKAGES) $(REACT_PACKAGES)

ESLINT := node_modules/eslint/bin/eslint.js
ESLINT_FLAGS := --fix

BROWSERIFY := $(ENV) node_modules/browserify/bin/cmd.js
BABELIFY := babelify --presets [ env react ] --plugins [ transform-class-properties ]
BROWSERIFY_FLAGS := -d -t [ $(BABELIFY) ]
#BROWSERIFY_FLAGS := -d -t [ $(BABELIFY) ] -g [ envify --$(ENV) ] -g uglifyify

SRC_CSS_DIR:= src/css
SRC_JS_DIR:= src/js
WORK_DIR:= work

LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

JS_TARGET_TEMP:= $(JS_TARGET).temp

UGLIFY := node_modules/uglify-js/bin/uglifyjs --compress --mangle
