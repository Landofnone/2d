var Game;



(function() {


/*
 * Game
 * ====
 *
 * The main Game constructor
 */

Game = function(options, plugins) {
    if(!options) {
        var options = {};
        console.warn(warnings.noOptions);
    }
    if(!plugins) {
        var plugins = [];
        console.warn(warnings.noPluginsConstructor);
    }


    this.options    = options;

    this.Camera     = null;
    this.Assets     = null;
    this.Colliders  = null;
    this.Sound      = null;
    this.Categories = null;
    this.Plugins    = new Plugins(this, plugins);


    return this;
}


Game.prototype.start = function() {
    if(!this.playing) {
        this.startTime = this.Utils.time();
        if(!this.initTime) {
            this.Init();
        }
        this.requestAnimationFrame(this.Loop);
        this.Loop();
    }

    return this;
}


Game.prototype.Loop = function() {
    this.frames++;

    this.World.Update(this);
    this.Camera.Update(this);
    this.World.Draw(this);

    return this;
}


Game.prototype.Utils = {
    capitalize: function(str) {
        return str.substr(0,1).toUpperCase() + str.substr(1).toLowerCase();
    },
    toRadians: function(deg) {
        return (deg * Math.PI) / 180;
    },
    toDegrees: function(rad) {
        return (rad * 180) / Math.PI;
    }
}






/*
 * Plugins
 * =======
 *
 * The Plugins constructor
 * Provides the plugin system for Game
 */

var Plugins = function(game, plugins) {
    //Save Game for later
    this.game = game;
    //Set up some basic plugin types
    this.plugins = {"Camera": [], "Assets": [], "Colliders": [], "Sound": []}

    //Add already provided plugins
    for(var i = 0, len = plugins.length; i < len; i++) {
        this.add(plugins[i]);
    }

    return this;
}

Plugins.prototype.add = function(plugin, override) {
    var type = plugin.type = this.game.Utils.capitalize(plugin.type);
    var name = plugin.name;

    //This type is not yet registered
    if(!this.plugins[type]) {
        this.plugins[type] = [];
    }

    //A plugin with this name already exists, but may be overridden
    if(this.get(name) && override) {
        this.remove(name);
        this.add(plugin);
    }
    else if(!this.get(name)) {
        //Push to plugin pool
        this.plugins[type].push(plugin);
        //Use the new plugin. If one already exists, it will not be overridden.
        this.use(name);
    }

    return this;
}

Plugins.prototype.remove = function(name) {
    var Plugin = this.get(name);

    if(Plugin) {
        var type = Plugin.type;

        //Remove from plugin pool
        this.loop(function(plugin, index, array) {
            if(plugin.name === name) {
                array.splice(index, 1);
            }
        });
        //Remove from Game
        if(Plugin === this.game[type]) {
            this.game[type] = null;

            //Replace by last added plugin of the same type (if any)
            var plugins = this.plugins[type];
            if(plugins && plugins.length) {
                this.game[type] = plugins[ plugins.length-1 ];
            }
        }
    }

    return this;
}

Plugins.prototype.get = function(name, warn) {
    var Plugin = null;

    //Loop through all the plugins and get the right one out
    this.loop(function(plugin, index, array) {
        if(plugin.name === name) {
            Plugin = plugin;
            return true;
        }
    });


    //No plugin with this name exists
    if(!Plugin && warn) {
        console.warn(warnings.pluginDoesNotExist, name);
        console.trace();
    }

    return Plugin;
}

Plugins.prototype.use = function(name, override) {
    var plugin = this.get(name);

    //Plugin exists
    if(plugin) {
        var type = plugin.type;

        //Only proceed when no plugin of this type is in use, or the plugin in use may be overridden
        if(!this.game[type] || override) {
            this.game[type] = plugin;
            if(this.game.initTime && plugin.Init) {
                plugin.Init(this.game);
            }
        }
        else if(this.game[type]) {
            console.warn(warnings.useAlreadySet, name);
        }
    }
    else {
        console.warn(warnings.useNonExistentPlugin, name);
    }

    return this;
}

Plugins.prototype.loop = function(cb) {
    //Loop through types
    outer:
    for(type in this.plugins) {
        var plugins = this.plugins[type];

        //Loop through plugins (per type)
        for(var i = 0; i < plugins.length; i++) {
            var br = cb(plugins[i], i, plugins);
            if(br) { break outer; }
        }
    }

    return this;
}

Plugins.prototype.Init = function() {
    this.loop(function(plugin) {
        if(plugin.Init) {
            plugin.Init(this.game);
        }
    });

    return this;
}


//Attach to Game
Game.prototype.plugin = Plugins.prototype.add;






/*
 * VARS
 * ====
 *
 * Some variables used  by Game.
 */


    var warnings = {
        "noOptions": "WARN: No options passed to the constructor. Default options will be used.",
        "noPluginsConstructor": "WARN: No plugins passed to the constructor. Make sure to add plugins with 'Game.plugin(plugin);'.",
        "pluginDoesNotExist": "WARN: A plugin with the name '%s' does not exist.",
        "useNonExistentPlugin": "WARN: You are trying to use() a non-existent plugin, named '%s'.",
        "useAlreadySet": "WARN: You are trying to use() a plugin, named '%s', but a plugin of this type is already in use. Please use Plugins.use(name, true) to override any plugins already in use."
    }


})();