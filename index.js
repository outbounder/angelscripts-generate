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
          angel.cmdData.source_folder = angel.tempfolder()
          angel.exec("git clone {src} {source_folder}", next)
        } else {
          angel.cmdData.source_folder = angel.cmdData.src
          next()
        }
      },
      angel.cp("source_folder", "dest", ["node_modules", ".git"]),
      angel.chdir("dest"),
      angel.exec("git init ."),
      angel.exec("npm init")
    ], next)
  })
  .example("angel new project testProjectName")
}