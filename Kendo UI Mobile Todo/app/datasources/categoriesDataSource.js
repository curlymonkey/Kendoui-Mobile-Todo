define([], function () {
    
    return function(sort, filter) {
        var catModel = {      
            id: 'Id',
            fields: {
              name: {
                field: 'Name',
                defaultValue: null
              },
              createdAt: {
                field: 'CreatedAt',
                defaultValue: new Date()
              },
              userId: {
                field: 'UserId',
                defaultValue: null
              },
              idDefault: {
                  field: 'IsDefault',
                  defaultValue: false
              }
            }
        };
        
		var ds = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
              model: catModel
            },
            transport: {
                typeName: 'Categories'
            },
            sort: sort || { field: 'Name', dir: 'desc' },
            filter: filter || {}
    	});   
        
        $.subscribe('/newCategory/add', function(e) {
            ds.fetch();
        });
        return ds;
    }
});