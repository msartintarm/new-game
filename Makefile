SHELL=/bin/sh
# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make


SRC_JS_DIR:= src/js
SRC_JS_DIR:= src/css
WORK_DIR:= work

SRC_SCSS:= $(SRC_CSS_DIR)/style.scss
SRC_JS:= $(SRC_JS_DIR)/TheCanvas.js \
	$(SRC_JS_DIR)/PolygonCanvas.js \
	$(SRC_JS_DIR)/index.js
LIB_JS:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

JS_TARGET:= $(WORK_DIR)/bundle.js
JS_LIB_TARGET:= $(WORK_DIR)/bundle-lib.js

CSS_TARGET:= $(WORK_DIR)/bundle.css

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: bundleify_lib bundleify bundle_css

# Builds + runs server
serve: all
	python -m http.server 3000

.PHONY: clean all server

clean:
	rm -rf $(WORK_DIR)

bundleify_lib: $(JS_LIB_TARGET)
$(JS_LIB_TARGET): $(LIB_JS)
	mkdir -p $(@D)
	rm -f $@
	cat $(LIB_JS) >& $@

bundleify: $(JS_TARGET)
$(JS_TARGET): $(SRC_JS)
	mkdir -p $(@D)
	rm -f $@
	cat $(SRC_JS) >& $@

bundle_css: $(CSS_TARGET)
$(CSS_TARGET): $(SRC_SCSS)
	mkdir -p $(@D)
	rm -f $@
	cat $(SRC_SCSS) >& $@
