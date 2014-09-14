module.exports = function (grunt) {
  /*
    Grunt installation:
    -------------------
    npm install -g grunt-cli
    npm install -g grunt-init

    Project Dependencies:
    ---------------------
    grunt-contrib-imagemin
    grunt-shell
  
    Requires rsync 3.0+
    
    HACK for grunt-contrib-imagemin may be needed. See https://github.com/gruntjs/grunt-contrib-imagemin/issues/83
  
    Simple Dependency Install:
    --------------------------
    npm install (from the same root directory as the `package.json` file)

    Gem Dependencies:
    -----------------
    bundle install (from the same root directory as the `Gemfile` file)
  */
  
  // our Grunt task settings
  grunt.initConfig({
    // Store your Package file so you can reference its specific data whenever necessary
    pkg: grunt.file.readJSON('package.json'),
    
    // Image source and target directories
    imageSource: 'images/source/',
    imageTarget: 'images/optimized/',
    
    // Image extensions to include / exclude
    imageExt: 'png,jpg,jpeg,gif,PNG,JPG,JPEG,GIF',
    imageExcludes: '--exclude *.png --exclude *.jpg --exclude *.jpeg --exclude *.gif --exclude *.PNG --exclude *.JPG --exclude *.JPEG --exclude *.GIF',
    
    
    // Shell functions
    shell: {
      syncOtherFiles: {
        command: 'rsync --verbose --archive --xattrs <%= imageExcludes %> --exclude .DS_Store <%= imageSource %> <%= imageTarget %>',
        options: {
          stdout: true
        }
      },
      cleanXaml: {
        command: 'ruby ./app/clean-xaml.rb',
        options: {
          stdout: true
        }
      },
      check: {
        command: [
          'echo "\033[0;35mChecking for files not in ./optimized, but in ./source...\033[39m"',
          'rsync -va -n --ignore-existing --exclude .DS_Store <%= imageSource %> <%= imageTarget %>',
          'echo "\n\n\033[0;35mChecking for files not in ./source, but in ./optimized...\033[39m"',
          'rsync -va -n --ignore-existing --exclude .DS_Store <%= imageTarget %> <%= imageSource %>'
        ].join('&&'),
        options: {
          stdout: true
        }
      },
      reset: {
        command: [
          'rm -rf <%= imageTarget %>*',
          'touch <%= imageTarget %>.gitkeep'
        ].join('&&'),
        options: {
          stdout: true
        }
      }
    },
    
    // `optimizationLevel` is only applied to PNG files (not JPG)
    imagemin: {
      all: {
        options: {
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            cwd: './<%= imageSource %>',
            src: ['**/*.{<%= imageExt %>}'],
            dest: './<%= imageTarget %>'
          }
        ]
      }
    }
  });
  
  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  
  // Compile the iamges for production
  grunt.registerTask('build', ['shell:reset', 'imagemin:all', 'shell:syncOtherFiles', 'shell:cleanXaml']);
  
  // Check for new files
  grunt.registerTask('check', ['shell:check']);
  
};
