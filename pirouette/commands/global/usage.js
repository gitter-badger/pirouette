/* -*- Mode: js2; tab-width: 4; indent-tabs-mode: nil; -*-
 * vim: set ts=4 sw=4 et tw=99 ft=js:
 */

var commands = Object.create(null);

var justify_col = 40;

function justify(str) {
    var justify_str = new Array(50).join(" ");
    return str + justify_str.substring(0, justify_col - str.length);
}

function formatCommand(cmdname, cmd) {
    return ("    " + justify(cmd.usage(cmdname)) + cmd.usageString(function(str) { return "\n" + justify("") + str; }));
}

function printUsage() {
    console.log (" $ pirouette [options] <command>");
    console.log ("where <command> is one of the following:");
    for (var cmdname in commands) {
        console.log(formatCommand(cmdname, commands[cmdname]));
    }
}

function installCommands(cmds) {
    commands = cmds;
}

function UsageError() {
    // XXX should subclass from Error
}

exports.UsageError = UsageError;
exports.printUsage = printUsage;
exports.justify = justify;
exports.formatCommand = formatCommand;
exports.installCommands = installCommands;
