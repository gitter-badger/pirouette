// This file is part of coffeekit.  for licensing information, see the LICENSE file

//console.log("UIKeyInput");
var UIKeyInput;
_exports.UIKeyInput = UIKeyInput = foundation.Protocol.extendClass("UIKeyInput", () => { return {

    // XXX ES6-port
    // @mixinProtocol UITextInputTraits

    // Inserting and Deleting Text
    insertText:     objc.requiredMethod("insertText:"),
    deleteBackward: objc.requiredMethod("deleteBackward"),
    hasText:        objc.requiredMethod("hasText")

}; });
