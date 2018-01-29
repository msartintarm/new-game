include Makefile.inc

SHELL := /bin/bash

# if windows, make sure 'make -v' returns 3.82 or higher
# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: prep $(JS_TARGET) $(CSS_TARGET)

# Builds + runs server
serve: all
	node webserver

clean:
	rm -rf $(WORK_DIR)

.PHONY: clean all serve

install:
	$(NPM_INSTALL)

prep: $(WORK_DIR) # make sure build directories are present
$(WORK_DIR):
	mkdir -p $@

$(JS_LIB_TARGET): $(LIB_JS)
	cat $^ >& $@

$(JS_TARGET): $(ENTRY_JS) $(SRC_JS)
	$(ESLINT) $^ $(ESLINT_FLAGS)
#   $(BROWSERIFY) $< $(BROWSERIFY_FLAGS) | $(UGLIFY) > $@
	$(BROWSERIFY) $< $(BROWSERIFY_FLAGS) > $@

$(CSS_TARGET): $(SRC_SCSS)
	cat $^ >& $@
