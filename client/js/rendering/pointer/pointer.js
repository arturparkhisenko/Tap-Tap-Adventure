define(['jquery'], function($) {
    var Pointer = Class.extend({

        init: function(id, element, type) {
            var self = this;

            self.id = id;
            self.element = element;
            self.type = type;

            self.blinkInterval = null;
            self.showing = true;

            self.start();
        },

        start: function() {
            var self = this;

            self.blinkInterval = setInterval(function() {
                if (self.showing)
                    self.hide();
                else
                    self.show();

                self.showing = !self.showing;
            }, 600);
        },

        destroy: function() {
            var self = this;

            self.stop();
            $(self.element).remove();
        },

        stop: function() {
            clearInterval(this.blinkInterval);
        },

        show: function() {
            this.element.css('display', 'block');
        },

        hide: function() {
            this.element.css('display', 'none');
        },

        getType: function() {
            return this.type;
        }
    });

    return Pointer;
});