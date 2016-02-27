var util = require("../../util/util"),
    fs = require("fs"),
    fse = require("fs-extra"),
    mktemp = require("mktemp"),
    path = require("path"),
    child_process = require("child_process"),
    spawn = child_process.spawn,
    project = require("../../util/project");

function generateInfoPlist(proj, config, contents_path, cb) {
    var info_plist_path = path.join(contents_path, "Info.plist");

    var bundleName = config.bundleName;
    if (!bundleName && config.bundleIdentifier) {
	var split_ident = config.bundleIdentifier.split('.');
	if (split_ident.length > 1)
	    bundleName = split_ident[split_ident.length - 1];
    }
    if (!bundleName)
	bundleName = config.projectName;


    var plist_json_contents = {
	CFBundleDevelopmentRegion: 'en',
	CFBundlePackageType: 'AAPL',
	CFBundleGetInfoString: 'Created by Pirouette/EchoJS',
	CFBundleSignature: '????',
	CFBundleExecutable: config.projectName,
	CFBundleIdentifier: config.bundleIdentifier,
	CFBundleInfoDictionaryVersion: '6.0',
	CFBundleShortVersionString: '0.1',
	CFBundleVersion: '1',
	CFBundleName: bundleName,
	CFBundleDisplayName: bundleName,
	DTPlatformName: 'iphonesimulator',
	DTPlatformVersion: '9.1'
    };

    var tmpdir = process.env['TMPDIR'];
    if (!tmpdir)
	tmpdir = '/tmp';

    mktemp.createFile(path.join(tmpdir, 'XXX.tmp'),  function(err, path) {
	fs.writeFile(path, JSON.stringify(plist_json_contents), function (err) {
	    var plutil = spawn('plutil', ['-convert', 'binary1', '-o', info_plist_path, path],
			       { stdio: ['pipe', process.stdout, process.stderr] });
	    plutil.on('exit', function (code, signal) {
		if (code == null) {
		    console.error ('error running plutil ' + signal);
		    process.exit(-1);
		}
		
		console.log('done converting plist file at ' + info_plist_path);
		cb();
	    });
	});
    });
}

function buildDestDir(proj, build_config) {

    var bundle_contents;

    var dir = util.ensureDir ('build');
    dir = util.ensureDir (proj.buildDir(build_config));
    dir = util.ensureDir (path.join (dir, proj.config.projectName + '.app'));

    bundle_contents = dir;

    util.ensureDir (path.join (bundle_contents, 'Base.lproj'));

    return bundle_contents;
}

function copyResources(proj, bundle_contents, build_config, cb) {
    var resource_list = proj.config.resources;
    if (!resource_list) {
	// no resources, easy.
	return cb();
    }

    var resources_dir = bundle_contents;

    var resource_srcs = Object.getOwnPropertyNames(resource_list);

    for (var i = 0, e = resource_srcs.length; i < e; i ++) {
	var src = resource_srcs[i];
	var dest = resource_list[src];

	fse.copySync(src, path.join(resources_dir, dest), {});
    }

    return cb();
}

function buildIOS(proj, build_config, args, cb) {
    var bundle_contents = buildDestDir(proj, build_config);

    generateInfoPlist(proj, proj.config, bundle_contents, function (err) {
	var dest_exe = path.join(bundle_contents, proj.config.projectName);

	util.compileScripts(proj.config.projectType,
			    proj.config.files || [proj.config.projectName + '.js'],
			    path.relative(proj.root, dest_exe),
			    function (err) {
				copyResources(proj, bundle_contents, build_config, cb);
			    });
    });
}

function run(args, cb) {
    var build_config = project.Configuration.Debug;
    if (args.length > 0) {
	if (args[0] === 'release') {
	    build_config = project.Configuration.Release;
	}
	else if (args[0] !== 'debug') {
	    throw new Error("configuration must be 'release' or 'debug'");
	}
    }

    var proj = project.Project.findContaining ();
    if (!proj)
	throw new Error ("Couldn't find containing project.");

    var config = proj.config;
    return buildIOS(proj, build_config, args, cb);
}

exports.command = {
    usage: function(s) { return s; },
    usageString: function(s) { return ': Builds the current project.'; },
    run: function(args, cb) {
        run(args, cb);
    }
};
