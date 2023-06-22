/**
* @param {params} params
* @param {api} params.api
* @param {any} params.event
* @param {any} params.imports
* @param {ApiHelpers} params.helpers
*/
async function handler({api, event, helpers, imports}) {    
    var value = event.context.item.value;
    var currentVizSelection = {};
    var previousVizSelection = {};
    previousVizSelection.elementId = value.id;
    
    currentVizSelection.table = value.datasource[0].tableOrViewName;
    currentVizSelection.query = value.datasource[0].filterQuery + value.updated_on;
    currentVizSelection.evamId = value.evamId;
    currentVizSelection.elementId = event.elementId;
    currentVizSelection.title = value.header;
    
    api.setState('pageCursor', () => 'init');
    api.setState('pageNumber', () => 0);
    api.setState('currentVizSelection', () => currentVizSelection);
    api.setState('previousVizSelection', () => previousVizSelection);
    api.setState('listRefreshRequested', {
        timestamp: new Date().getTime()
    });
    if (api.state.groupMode)
        api.setState('listView', 'sow_landing_page');
    else 
        api.setState('listView', 'sow_landing_page_assigned');
    api.data.get_datetime_now.refresh();
}