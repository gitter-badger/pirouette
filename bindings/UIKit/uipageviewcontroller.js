// This file is part of coffeekit.  for licensing information, see the LICENSE file

//console.log("UIPageViewController");
var UIPageViewController;
_exports.UIPageViewController = UIPageViewController = UIViewController.extendClass ("UIPageViewController", () => { return {

    // Creating Page View Controllers
    initWithTransitionStyle: objc.instanceSelector("initWithTransitionStyle:navigationOrientation:options:"),
    dataSource: objc.instanceProperty(),
    delegate: objc.autoboxProperty(UIPageViewControllerDelegate),

    // Providing Content
    setViewControllers: objc.instanceSelector("setViewControllers:direction:animated:completion:"),
    viewControllers: objc.instanceProperty({ set: function(v) { return this.setViewControllers(v, false, null); } }),
    gestureRecognizers: objc.instanceProperty(),

    // Display Options
    navigationOrientation: objc.instanceProperty(),
    spineLocation: objc.instanceProperty(),
    transitionStyle: objc.instanceProperty(),
    doubleSided: objc.instanceProperty()

}; });
