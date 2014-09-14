Image Minimization
==================

Clean up images for production by minimizing them, stripping unnecessary metadata, etc.


Setup
=====

Setup is a bit involved right now.  I'd like to refactor this to work as githooks, so most of this gets pushed to the build server.


Install Dependencies
--------------------

Start by installing macports and various related dependencies (assumed Homebrew, but MacPorts will also work).

* `brew install git`
* `brew install https://raw.github.com/Homebrew/homebrew-dupes/master/rsync.rb` (requires rsync 3.0+)
* `brew install node`
* `brew install curl` (not necessary, because 10.10 uses a much newer version of curl)
* `\curl -sSL https://get.rvm.io | bash -s stable --ruby`


Install npm Dependencies
------------------------

* `[sudo] npm install -g grunt-cli`
* `[sudo] npm install -g grunt-init`


Install Project Dependencies
----------------------------

* Gems should be installed automatically by RVM. Run `bundle install` to force it
* `npm install` to install local node modules


Create a Symbolic Links
-----------------------

The `images/source` directory should be a symoblic link to your source directory.  This is typically a folder shared by the visual design team (e.g., Dropbox folder), and is the destination of visual file exports ready for engineering.

The `images/optimized` directory should be a symbolic link to your image repository used by engineering.  Optimally, this repository is automatically pulled during the build process to ensure the latest assets are always used.  May require githooks to ensure engineers also have the latest assets merged from master (or an appropriate branch used in your process).



Grunt Tasks Available
=====================

`grunt build` will process all of the files in `images/source`.  This also removes old files from the `images/optimized` directory.

Non-image files will be copied using rsync.
