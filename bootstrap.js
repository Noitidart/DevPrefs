const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const ps = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);
const eps = Cc['@mozilla.org/embedcomp/prompt-service;1'].getService(Ci.nsIPromptService); //embeded prompt service
const title = 'DevPrefs';

var config = { //this is from https://developer.mozilla.org/en-US/docs/Setting_up_extension_development_environment#Development_preferences  and is not addon specific prefs
	'javascript.options.showInConsole': {
		e: true, //enabled value, enabled values are considered production environment value
		d: false, //recommended disabled value
		type: 'Bool'
	},
	'nglayout.debug.disable_xul_cache': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'browser.dom.window.dump.enabled': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'javascript.options.strict': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'devtools.chrome.enabled': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'devtools.debugger.remote-enabled': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'extensions.logging.enabled': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'nglayout.debug.disable_xul_fastload': {
		e: false,
		d: false,
		type: 'Bool'
	},
	'dom.report_all_js_exceptions': {
		e: true,
		d: false,
		type: 'Bool'
	},
	'devtools.errorconsole.deprecation_warnings': {
		e: true,
		d: false,
		type: 'Bool'
	}
};

function startup(aData, aReason) {
	if ([ADDON_ENABLE, ADDON_INSTALL, ADDON_UPGRADE, ADDON_DOWNGRADE].indexOf(aReason) > -1) {
		var log = ['Log of actions performed during enabling of production environment:'];
		for (var p in config) { //go through check if prefExists, if it doesn't then create/set it at enabled value
			var cVal;
			try {
				cVal = ps['get' + config[p].type + 'Pref'](p);
			} catch (ex) {
				cVal = false; //undefined so force set it to false
				if (cVal == config[p].e) {
					log.push('-"' + p +'" was not defined, but production environment is "false" so did not create');
					break;
				}
			}
			if (cVal != config[p].e) {
				ps['set' + config[p].type + 'Pref'](p, config[p].e);
				log.push('-"' + p +'" was NOT set to production environment value, so changed to "' + config[p].e + '"');
			} else {
				log.push('-"' + p +'" was ALREADY set to production environment value of "' + config[p].e + '"');
			}
		}
		eps.alert(null, title + ' - Startup', log.join('\n'));
	}
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	if ([ADDON_DISABLE, ADDON_UNINSTALL, ADDON_UPGRADE, ADDON_DOWNGRADE].indexOf(aReason) > -1) {
		var log = ['Log of actions performed during disabling of production environment:'];
		for (var p in config) { //go through check if prefExists, if it doesn't then create it at default value
			var cVal;
			try {
				cVal = ps['get' + config[p].type + 'Pref'](p);
			} catch (ex) {
				log.push('-"' + p +'" is not defined and this matches the non-production environment setting of false so did not take any action to reset it');
				break;
			}

			try {
				ps.clearUserPref(p);
				try {
					cVal = ps['get' + config[p].type + 'Pref'](p);
					log.push('-"' + p +'" reset to default value of "' + cVal + '"');
				} catch (ex) {
					log.push('-"' + p +'" reset to default value of undefined');
					cVal = false; //because its undefined we set force set it to this
				}
				if (cVal != config[p].d) {
					log.push('--NOTE: This does not match the recommended non-production environment is setting of "' + config[p].d + '"');
				}
			} catch (ex) {
				//Cu.reportError('exception in shutdown: ' + ex);
				if (cVal) {
					log.push('-"' + p +'" exists and is currently set to "' + cVal +'" but caused exception when tried to reset it');
				} else {
					log.push('-"' + p +'" does not exist and an exception occured when trying to set it to reset it[im hoping that reset, resets it back to true as that is what the config.d value is]'); //if config.d is false then undefined is fine so it wont get here it would have breaked at line 93
				}
				log.push('--Exception: ' + ex);
				//ps['set' + config[p].type + 'Pref'](p, !config[p].value);
			}
			
		}
		eps.alert(null, title + ' - Shutdown', log.join('\n'));
	}
}

function install() {}

function uninstall() {}