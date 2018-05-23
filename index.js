var shell = require('shelljs');

let allLocalBranches;
let rootDir;

exports.init = (cwd = process.cwd()) => {
  allLocalBranches = (shell.exec(`git branch`, {silent: true, cwd}) || '').toString().split('\n').filter(f=>f!='');
  rootDir = shell.exec(`git rev-parse --show-toplevel`);
}

exports.root = () => rootDir;

exports.isClean = () => {
  return shell.exec(`git status`, {silent: true}).toString().includes('nothing to commit');
}

// gets which remote is being tracked by this branch. empty string means there's no remote branch being tracked
// might not support windows. need to figure out how to avoid shelljs printing error messages from git. silent does not help
exports.getUpstream = (branch) => {
  return shell.exec(`git rev-parse --abbrev-ref ${branch}@{upstream} 2>/dev/null`, {silent: true}).toString();
}

// list all branches that were merged to branch X
exports.getMergedBranches = (targetBranch) => {
  return exports.all(shell.exec(`git branch --merged ${targetBranch}`, {silent: true}).toString().split('\n').filter(f=>f!=''));
}


exports.current = () => {
  return allLocalBranches.find(b => b[0] === '*').split('*')[1].trim();
}

exports.other = () => allLocalBranches.filter(l => l[0] !== '*').map((n) => n.trim());

exports.all = (branches=allLocalBranches) => branches.map(b => {
  if (b[0] === '*') {
    return b.slice(1).trim();
  } else {
    return b.trim();
  }
});

exports.list = (cwd = process.cwd()) => {
  exports.init(cwd);
  return {
    current: exports.current(),
    other: exports.other(),
    all: exports.all(),
    root: rootDir
  }
}
