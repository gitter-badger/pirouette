var fs = require("fs"),
    path = require("path"),
    terminal = require("./terminal"),
    child_process = require("child_process"),
    spawn = child_process.spawn;

function compileXib(xibPath, destDir, cb) {
  // make sure the destDir is there
  try { fs.mkdirSync(destDir); } catch (e) { }

  console.log ("COMPILE-XIB " + xibPath);

  var nibPath = path.join (destDir, path.basename(xibPath, ".xib") + ".nib");
  var nibCompile = spawn("ibtool",
			 ["--errors", "--warnings", "--notices", "--output-format", "human-readable-text", "--compile", nibPath, xibPath],
			 { stdio: 'inherit' });

  nibCompile.on('close', cb);
}

function findEjsInPATH() {
  var paths = process.env['PATH'].split(':');

  for (var i = 0, e = paths.length; i < e; i ++) {
    var ejs_path = path.resolve(paths[i], "ejs");
    if (fs.existsSync(ejs_path)) {
	//console.log("found ejs at "+ ejs_path);
	return ejs_path;
    }
  }

  // fall back to the one we should included in ../node_modules
  var builtin_ejs_path = path.resolve(path.dirname (fs.realpathSync(process.argv[1])), "..", "node_modules", "pirouette-toolchain-darwin-x64", "bin", "ejs");
  if (fs.existsSync(builtin_ejs_path))
    return builtin_ejs_path;

  throw new Error("could not locate ejs in your PATH");
}

function compileScripts(projectType, scriptList, outFile, cb) {

  var ejs_path = findEjsInPATH();

  var binding_path = path.resolve(path.dirname (fs.realpathSync(process.argv[1])), "..", "node_modules", "pirouette-bindings-darwin", "bindings");

  var module_path = path.resolve(path.dirname (fs.realpathSync(process.argv[1])), "..", "node_modules", "pirouette-toolchain-darwin-x64", "lib");

  // XXX(toshok) we need a buildType, I think?
  if (projectType === 'ios')
    projectType = 'sim';

  var args = ["--target", projectType, "-o", outFile, "--moduledir", module_path, "-I", "pirouette=" + binding_path].concat(scriptList);

  var ejsCompile = spawn(ejs_path, args, { stdio: 'inherit' });

  ejsCompile.on('close', cb);
}

function collectXibs(config) {
  var xibs = [];
  if (config.mainXib)
    xibs.unshift (config.mainXib);

  if (config.additionalXibs)
    xibs = xibs.concat(config.additionalXibs);

  return xibs;
}

// pre = true if pre-order (dir_cb is invoked before children), false if post-order (dir_cb is invoked after children)
function traverseDir(p, pre, dir_cb, file_cb) {
  var stats = fs.statSync(p);
  if (stats.isDirectory()) {
    if (pre) dir_cb(p);

    var paths = fs.readdirSync(p);
    for (var i = 0, e = paths.length; i < e; i ++) {
	var subpath = path.join (p, paths[i]);
	traverseDir(subpath, pre, dir_cb, file_cb);
    }

    if (!pre) dir_cb(p);
  }
  else {
    file_cb(p);
  }
}

function ensureDir(p) {
    try {
	fs.mkdirSync(p);
    }
    catch (e) {
	if (e.code != 'EEXIST') throw e;
    }
    return p;
}

function rmDir(dir) {
  traverseDir (dir, false, /* post-order traversal, so we can remove contents before rmdir */
    function dir_cb (dirPath) {
      fs.rmdirSync(dirPath);
    },
    function file_cb (filePath) {
      fs.unlinkSync(filePath);
    });
}

function getUserHome() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}


exports.collectXibs = collectXibs;
exports.compileXib = compileXib;
exports.compileScripts = compileScripts;
exports.traverseDir = traverseDir;
exports.rmDir = rmDir;
exports.ensureDir = ensureDir;
exports.getUserHome = getUserHome;
