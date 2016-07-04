include Makefile.inc

PWD := $(shell pwd)

# if windows, make sure 'make -v' returns 3.82 or higher
#  No? Download latest make.exe here (4.1 as of May 2016):
#  http://www.equation.com/servlet/equation.cmd?fa=make

# (c) 2016. All rights reserved.
# Makefile that installs and runs the project.

# Default; builds
all: prep $(JS_TARGET) $(JS_LIB_TARGET) $(CSS_TARGET)

# Builds + runs server
serve: all
	python -m http.server 3000

serve2: all
	python -m SimpleHTTPSer	ver 3000

clean:
	$(RM_DIR) $(WORK_DIR)

.PHONY: clean all serve 

install:
	$(NPM_INSTALL)

prep: $(WORK_DIR) # make sure build directories are present
$(WORK_DIR):
	mkdir -p $@

$(JS_LIB_TARGET): $(LIB_JS)
	cat $^ >& $@

$(JS_TARGET): $(ENTRY_JS) $(SRC_JS)
	eslint src/js/**/*.js
	$(BR) $< -o $@ $(BR_FLAGS) 
#	$(BR) $< $(BR_FLAGS) | $(EXORCIST) $(JS_MAP) > $@ 

$(CSS_TARGET): $(SRC_SCSS)
	cat $^ >& $@
