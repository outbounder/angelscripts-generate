var path = require('path')
var gulp = require('gulp');
var template = require('gulp-template');
var replace = require("gulp-replace");
var shelljs = require("shelljs")
shelljs.config.fatal = true

module.exports = function(angel) {
  require("angelabilities/src/io")(angel)
  require("angelabilities/src/fs")(angel)
  require("angelabilities/src/format")(angel)
  
  angel.on("generate :name :src", function(angel, next){
    angel.cmdData.dest = path.join(process.cwd(), angel.cmdData.name)
    if(angel.cmdData.src.indexOf(".git") != -1) {
      angel.cmdData.sourceFolder = angel.fs.tempfolder()
      angel.log("extracting via git clone at {sourceFolder}")
      shelljs.exec(angel.format("cd {sourceFolder}; git clone {src} ."))
    } else 
      angel.cmdData.sourceFolder = angel.cmdData.src
    var stream = gulp.src([angel.cmdData.sourceFolder+"/**/*","!node_modules", "!.git"])
    for(var key in angel.cmdData)  
      stream = stream.pipe(replace(new RegExp("{"+key+"}", "g"), angel.cmdData[key]))
    stream.pipe(gulp.dest(angel.cmdData.dest))
      .on("end", function(){
        if(angel.cmdData.src.indexOf(".git") != -1) {
          angel.cmdData.sourceFolder = angel.fs.tempfolder()
          angel.log("removing {sourceFolder}")
          shelljs.exec("rm -rf {sourceFolder}")
        }
        shelljs.cd(angel.cmdData.dest)
        shelljs.exec("git init .")
        shelljs.exec("npm install")
      })
  })
  .example("generate testProjectName git://...")
}