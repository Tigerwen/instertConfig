# insertConfig

> require config insert

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-insert-config --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('insertConfig');
```

## The "insertConfig" task

### Overview
In your project's Gruntfile, add a section named `insertConfig` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  insertConfig: {
    dev: {
      src: ['test/main.js'],
      dest: ['tmp/main.js'],
      insertModules: {
        paths: {
            'flight_core/list/list': 'http://xxxx.com/xxx/flight_core/list/list'
        },
        baseUrl: '://www.qunar.com/'
      }
    },
    dist: {
      src: ['tmp/main.js'],
      srcReg: [new RegExp('^tmp/\\w*/\\w*(\.js)$')],
      insertModules: {
          paths: {},
          baseUrl: '://www.qunar.com/'
      },
      replaceReg: [new RegExp('^tmp/'),new RegExp('\.js$')]
    }
   }
});
```


#### Default Options
```js
options: {
  startKey: 'require.config(',
  endKey: ')'
}
if no insertModule,then use grunt.filerev.summary

if have srcReg,then filter insertModules

if have dest,use it,if not,use src
```

### Usage Examples
```js
grunt.initConfig({
  copy: {
    dist: {
      expand: true,
      cwd: 'test/',
      src: '**',
      dest: 'tmp/'
    }
  },
  filerev: {
    options: {
      algorithm: 'md5',
      length: 8
    },
    dist: {
      files: [{
        src: [
            'tmp/**/*.js',
            '**/*.css'
        ]
      }]
    }
  },
  insertConfig: {
    dev: {
      src: ['test/main.js'],
      dest: ['tmp/main.js'],
      insertModules: {
        paths: {
          'flight_core/list/list': 'http://xxxx.com/xxx/flight_core/list/list'
        },
        baseUrl: '://www.xxx.com/'
      }
    },
    dist: {
      src: ['tmp/main.js'],
      srcReg: [new RegExp('^tmp/\\w*/\\w*(\.js)$')],
      insertModules: {
        paths: {},
        baseUrl: '://www.xxx.com/'
      },
      replaceReg: [new RegExp('^tmp/'),new RegExp('\.js$')]
    }
  }
});

```



## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
