define([], function () {
    return function() {
        
        var category;
        
        var todoModel = {
            id: 'Id',
            fields: {
                title: {
                    field: 'Title',
                    defaultValue: ''
                },
                createdAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
                },
                category: {
                    field: 'Category',
                    defaultValue: null
                },
                userId: {
                    field: 'UserId',
                    defaultValue: null
                }
            }
        };
    
        var todos = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: todoModel
            },
            transport: {
                typeName: 'Todos'
            },
            sort: {
                field: 'CreatedAt',
                dir: 'desc'
            }
        });
        
        $.subscribe('/newTodo/add', function (e, text) {
            todos.add({
                title: text,
                category: category.id
            });
            todos.sync();
        });
        
        $.subscribe("/category/selected", function (e, cat) {
            category = cat;
        });
        
        return todos;
    };
});