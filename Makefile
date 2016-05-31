SHELL=/bin/sh
# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make

SRC:= src/TheCanvas.js \
	src/PolygonCanvas.js \
	src/index.js
LIB:= lib/react.15.1.0.js \
	lib/react-dom-15.1.0.js \
	lib/babel.browser.min.js

BUNDLE:= work/bundle.js
BUNDLE_LIB:= work/bundle-lib.js

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

all: bundleify_lib bundleify

.PHONY: clean all

clean:
	rm -f $(BUNDLE) $(BUNDLE_LIB)

bundleify_lib: $(BUNDLE_LIB)
$(BUNDLE_LIB): $(LIB)
	rm -f $@
	cat $(LIB) >> $@

bundleify: $(BUNDLE)
$(BUNDLE): $(SRC)
	rm -f $@
	cat $(SRC) >> $@

