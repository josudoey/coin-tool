const prog = require('commander')
const path = require('path')
const fs = require('fs')
const pkg = require('./package')
const requireTree = require('require-tree')

let version = pkg.version
try {
  let gitHead = pkg.gitHead
  if (!gitHead) {
    gitHead = fs.readFileSync(path.join(__dirname, '.git', 'refs', 'heads', 'master')).toString()
  }
  version += ' (' + gitHead.substring(0, 8) + ')'
} catch (e) {}
prog
  .version(version)

const tree = requireTree('./cmd', {
  index: 'preserve'
})
for (const name in tree) {
  const mod = tree[name]
  mod(prog)
}
prog.parse(process.argv)

if (prog.args.length === 0 || !prog.args[prog.args.length - 1]._name) {
  prog.outputHelp()
}
