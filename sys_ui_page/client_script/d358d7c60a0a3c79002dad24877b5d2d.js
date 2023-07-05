function invokePromptCallBack(type) {
    var gdw = GlideDialogWindow.get();
    if (type == 'ok')
       var f = gdw.getPreference('onPromptComplete');
    else
       var f = gdw.getPreference('onPromptCancel');
    if (typeof(f) == 'function') {
        try {
            f.call(gdw, gdw.getPreference('oldValue'));
        } catch(e) {
        }
    }
    gdw.destroy();
    return false;
}