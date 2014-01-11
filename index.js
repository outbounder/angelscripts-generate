var path = require('path')

module.exports = function(angel) {
  require("angelabilities/src/reactions")(angel)
  require("angelabilities/src/shell")(angel)
  require("angelabilities/src/io")(angel)
  require("angelabilities/src/fs")(angel)
  
  angel.on("alpha :name :src", function(angel, next){
    angel.cmdData.dest = path.join(process.cwd(), angel.cmdData.name)
    angel.series([
      function(angel, next){
        if(angel.cmdData.src.indexOf(".git") != -1) {
          angel.cmdData.sourceFolder = angel.fs.tempfolder()
          angel.log("extracting via git clone at {sourceFolder}")
          angel.exec("cd {sourceFolder}; git clone {src} .", next)
        } else {
          angel.cmdData.sourceFolder = angel.cmdData.src
          next()
        }
      },
      angel.fs.cp("sourceFolder", "dest", ["node_modules", ".git"]),
      function(angel, next){
        if(angel.cmdData.src.indexOf(".git") != -1) {
          angel.log("removing {sourceFolder}")
          angel.exec("rm -rf {sourceFolder}", next)
        } else
          next()
      },
      angel.fs.chdir("dest"),
      angel.exec("git init ."),
      angel.stdin(angel.exec("npm init"))
    ], next)
  })
  .example("angel alpha testProjectName git://...")
}