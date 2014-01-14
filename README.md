# angelscripts-generate

angel script for generation of projects using directory or repository as template

    $ angel generate :name :src

Commands pseudo-sequence

- if `src` is git://
  - git clone to temporary folder (will be deleted on exit)
- copy from `src(or temporary folder)` to `currentWorkingDirectory/`name``
  - any files having `{name}` placeholder will be replaced with given `name` value
- git init .
- npm install
