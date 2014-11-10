View.prototype.viewDidLoad = function() { }
View.prototype.viewDidAppear = function() { }
View.prototype.viewDidDisappear = function () { }

var navigationController = {
    navigationCurve : "spring(700,80,1000)",
    viewControllers : [],
    initWithRootViewController : function (vc) {
        this.viewControllers.push(vc);
        vc.viewDidLoad();
        vc.x = 0;
        vc.y = 0;
        vc.viewDidAppear();
    },
    pushViewController : function (vc, animated, complete) {        
        this.viewControllers.push(vc);
        
        vc.viewDidLoad();
        
        if (animated) {
            vc.y = 0;
            vc.x = vc.width;
            
            var pushAnimation = new Animation ({
                view: vc,
                properties: { x : 0 },
                curve: this.navigationCurve
            });
            
            pushAnimation.on("end", function(event) {
                vc.viewDidAppear();
                if (complete)
                    complete();
            });
            
            pushAnimation.start();
        } else {
            vc.y = 0;
            vc.x = 0;
        }
    },
    popViewController : function (vc, animated, complete) {
        this.viewControllers.pop();
        
        var upstreamVC = this.viewControllers[this.viewControllers.length - 1];
        if (upstreamVC != undefined)
            upstreamVC.viewDidLoad();
        
        if (animated) {
            var popAnimation = new Animation({
                view : vc,
                properties: { x : vc.width },
                curve: this.navigationCurve
            });
            
            popAnimation.on("end", function(event) {
                if (complete)
                    complete(); 

                if (upstreamVC != undefined)
                    upstreamVC.viewDidAppear();
            });
            
            popAnimation.start();
        } else {
            vc.y = 0;
            vc.x = vc.width;
        }
    },
    popToRootViewController: function (animated, complete) {
        this.viewControllers.forEach(function(vc, index, array) {
            if (index + 1 != array.length) {
                vc.x = vc.superView.width;
            } else {
                vc.animate({
                    property: { x : vc.width },
                    curve: this.navigationController
                });
            }
        });
    },
    presentViewController: function (vc, animated, complete) {
        vc.x = 0;
        vc.y = vc.height;
        
        vc.viewDidLoad();
        
        if (animated) {
            var presentAnimation = new Animation({
                view : vc,
                properties: { y : 0 },
                curve: this.navigationCurve
            });
            
            presentAnimation.on("end", function(event) {
                vc.viewDidAppear();
                
                if (complete)
                    complete(); 
            });
            
            presentAnimation.start();
        } else {
            vc.y = 0;
            vc.x = 0;
        }
    }
};