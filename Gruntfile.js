'use strict'

const fs = require('fs')
const serveStatic = require('serve-static')

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      watch: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['hbsfy', 'babelify']
        }
      },
      dist: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['hbsfy', 'babelify', 'uglifyify']
        }
      }
    },

    clean: {
      dist: ['./dist']
    },

    connect: {
      server: {
        options: {
          base: './dist',
          hostname: '0.0.0.0',
          livereload: true,
          open: true,
          port: 3000,
          middleware: (connect, options) => {
            const middlewares = []

            if (!Array.isArray(options.base)) {
              options.base = [options.base]
            }

            options.base.forEach(function(base) {
              middlewares.push(serveStatic(base))
            })

            // default: index.html
            middlewares.push((req, res) => {
              fs
                .createReadStream(`${options.base}/index.html`)
                .pipe(res)
            })
            return middlewares
          }
        }
      }
    },

    copy: {
      dist: {
        expand: true,
        cwd: 'src',
        src: '*.html',
        dest: './dist/'
      }
    },

    watch: {
      html: {
        files: ['./src/*.html'],
        tasks: ['copy:dist'],
        options: {
          livereload: true
        }
      },
      scripts: {
        files: ['./src/**/*.js', './src/templates/*.hbs'],
        tasks: ['browserify:watch'],
        options: {
          livereload: true
        }
      }
    }
  })

  grunt.registerTask('default', ['clean', 'copy', 'browserify:dist'])
  grunt.registerTask('start', ['default', 'connect', 'watch'])

}
