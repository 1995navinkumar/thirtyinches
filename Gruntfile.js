var gruntTask = function (grunt) {
  grunt.initConfig({
    svgstore: {
      options: {
        svg: { // will add and overide the the default xmlns="http://www.w3.org/2000/svg" attribute to the resulting SVG
          viewBox: '0 0 100 100',
          xmlns: 'http://www.w3.org/2000/svg',
          style: 'display:none'
        },
        includeTitleElement: false
      },
      default: {
        files: {
          'dest/dest.svg': ['public/images/*.svg']
        }
      },
      your_target: {
        // Target-specific file lists and/or options go here.
      }
    }
  });

  grunt.loadNpmTasks('grunt-svgstore');

  grunt.registerTask('default', ['svgstore']);
}

module.exports = gruntTask;
