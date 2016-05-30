SHELL = C:\Windows\System32\cmd.exe

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

bundleify_lib: $(BUNDLE_LIB)
$(BUNDLE_LIB): $(LIB)
	rm -f $@
	cat $(LIB) >> $@

bundleify: $(BUNDLE)
$(BUNDLE): $(SRC)
	rm -f $@
	cat $(SRC) >> $@

