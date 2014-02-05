const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
const ios = Cc['@mozilla.org/network/io-service;1'].getService(Ci.nsIIOService);
const ps = Cc['@mozilla.org/preferences-service;1'].getService(Ci.nsIPrefBranch);

var config = { //this is from https://developer.mozilla.org/en-US/docs/Setting_up_extension_development_environment#Development_preferences  and is not addon specific prefs
	'javascript.options.showInConsole': {
		e: true, //enabled value
		d: false,
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
		e: true,
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
		for (var p in config) { //go through check if prefExists, if it doesn't then create it at default value
			var cVal;
			try {
				cVal = ps['get' + config[p].type + 'Pref'](p);
			} catch (ex) {
				ps['set' + config[p].type + 'Pref'](p, config[p].e);
			}
			if (cVal != config[p].e) {
				ps['set' + config[p].type + 'Pref'](p, config[p].e);
			}
		}
	}
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	if ([ADDON_DISABLE, ADDON_UNINSTALL, ADDON_UPGRADE, ADDON_DOWNGRADE].indexOf(aReason) > -1) {
		for (var p in config) { //go through check if prefExists, if it doesn't then create it at default value
			var cVal;
			try {
				cVal = ps.clearUserPref(p);
			} catch (ex) {
				Cu.reportError('exception in shutdown: ' + ex);
				//ps['set' + config[p].type + 'Pref'](p, !config[p].value);
			}
			//if (cVal != config[p].d) {
			//	ps['set' + config[p].type + 'Pref'](p, config[p].d);
			//}
		}
	}
}

function install() {}

function uninstall() {}