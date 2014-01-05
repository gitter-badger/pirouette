// This file is part of coffeekit.  for licensing information, see the LICENSE file

//console.log("UIPrintPageRenderer");
var UIPrintPageRenderer;
_exports.UIPrintPageRenderer = UIPrintPageRenderer = foundation.NSObject.extendClass ("UIPrintPageRenderer", () => { return {

    // Accessing Information About the Print Job
    numberOfPages: objc.instanceSelector("numberOfPages"),
    paperRect:     objc.instanceProperty(),
    printableRect: objc.instanceProperty(),

    // Specifying Header and Footer Heights
    headerHeight: objc.instanceProperty(),
    footerHeight: objc.instanceProperty(),

    // Managing Print Formatters
    addPrintFormatterStartingAtPageAtIndex: objc.instanceSelector("addPrintFormatter:startingAtPageAtIndex:"),
    printFormattersForPageAtIndex:          objc.instanceSelector("printFormattersForPageAtIndex:"),
    printFormatters: objc.instanceProperty(),

    // Preparing for Drawing
    prepareForDrawingPages:           objc.instanceSelector("prepareForDrawingPages:"),

    // Drawing a Page
    drawPageAtIndex:                  objc.instanceSelector("drawPageAtIndex:inRect:"),
    drawHeaderForPageAtIndex:         objc.instanceSelector("drawHeaderForPageAtIndex:inRect:"),
    drawContentForPageAtIndex:        objc.instanceSelector("drawContentForPageAtIndex:inRect:"),
    drawPrintFormatterForPageAtIndex: objc.instanceSelector("drawPrintFormatter:forPageAtIndex:"),
    drawFooterForPageAtIndex:         objc.instanceSelector("drawFooterForPageAtIndex:inRect:")

}; });