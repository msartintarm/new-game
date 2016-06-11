include Makefile.inc

SRC_CSS_DIR:= src/css
SRC_JS_DIR:= src/js
SRC_JS_DIR2:= src/js/LineSegmented
WORK_DIR:= work

SRC_SCSS:= $(SRC_CSS_DIR)/style.scss
SRC_JS:= $(SRC_JS_DIR)/*.js $(SRC_JS_DIR2)/*.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_MAP:= $(JS_TARGET).map
JS_TARGET_TEMP:= $(JS_TARGET).temp
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js

CSS_TARGET:= $(WORK_DIR)/bundle.css

PWD := $(shell pwd)

# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: prep bundleify bundleify_lib bundle_css

# Builds + runs server
serve: all
	python -m http.server 3000

serve2: all
	python -m SimpleHTTPServer 3000

clean:
	$(RM_DIR) $(WORK_DIR)

.PHONY: clean all serve 

install:
	$(NPM_INSTALL)

prep: $(WORK_DIR) # make sure build directories are present
$(WORK_DIR):
	mkdir -p $@

bundleify_lib: $(JS_LIB_TARGET)
$(JS_LIB_TARGET): $(LIB_JS)
	cat $^ >& $@

bundleify: $(JS_TARGET)
$(JS_TARGET): $(SRC_JS)
	$(BR) $^ $(BR_FLAGS) | $(EXORCIST) $(JS_MAP) > $@ 

bundle_css: $(CSS_TARGET)
$(CSS_TARGET): $(SRC_SCSS)
	cat $^ >& $@
