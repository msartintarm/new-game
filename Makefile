SHELL = C:\Windows\System32\cmd.exe

SRC = $(wildcard src/*.js)
LIB = $(wildcard lib/*.js)

BUNDLE = work/bundle.js
BUNDLE_LIB = work/bundle-lib.js

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

all: bundleify_lib bundleify

bundleify_lib: $(BUNDLE_LIB)
work/bundle-lib.js: $(LIB)
	rm -f $@
	cat $(LIB) >> $@

bundleify: $(BUNDLE)
work/bundle.js: $(SRC)
	rm -f $@
	cat $(SRC) >> $@

