(function ($) {
    $.fn.ogaGrid = function (arguments) {

        const datasource = arguments.datasource || {};
        const options = arguments.options || {};

        this._datasource = $.extend({
            initialRequest: true,
            withCredentials: false,
            contentType: 'application/json',
            headers: {},
            api: {
                readData: {
                    url: datasource.readUri,
                    method: 'POST',
                    initParams: datasource.params || {}
                }
            },
            hideLoadingBar: true,
            serializer(params) {
                
                
                return JSON.stringify(params);
                
            }
        }, datasource);

        // this._datasource = arguments.datasource;

        this._options = $.extend({
            el: this[0],
            rowHeaders: ['checkbox'],
            header: {
                height: 32,
            },
            scrollX: true,
            scrollY: true,
            rowHeight: 32,
            minRowHeight: 32,
            bodyHeight: 336,
            columns: [],
            data: this._datasource,
            selectionUnit: 'column',
            pageOptions: {
                useClient: false,
                perPage: 100
            }
        }, options);
	
       this.init = function () {
            // var Grid = tui.Grid;
            this.grid = new tui.Grid(this._options);
            this.data('instance', this);
                      
            // Grid.applyTheme('clean', {
        	// 	outline: {
            // 		border: '#d5e9ff',
            // 		showVerticalBorder: true
        	// 	},
        	// 	cell: {
            // 		normal: {
            //     		border: '#d1e4eb',
            //     		showHorizontalBorder: true
            // 		},
            //         rowHeader: {
            //             border: '#d1e4eb',
            //             showHorizontalBorder: true
            //         }
            //     }
    	    // });

            this.grid.el.insertAdjacentHTML('beforeend', `
                <div class="grid-page-info">
                    <div class="grid-data-total">총 <b>${this.grid.getPaginationTotalCount()}</b></div>
                    <div class="grid-data-view"></div>
                </div>
            `);
            
            this.grid.el.lastElementChild.style.top = `${this.grid.getPagination()._view._containerElement.children[0].getBoundingClientRect().top}px`;
            this.grid.el.lastElementChild.style.left = `${this.grid.getPagination()._view._containerElement.children[0].getBoundingClientRect().left - 230}px`;
            
            // var SelectBox = tui.SelectBox;
            this.selectbox = new tui.SelectBox('.grid-data-view', {
                data: [
                    { label: '1', value: '1' },
                    { label: '2', value: '2' },
                    { label: '3', value: '3' },
                    { label: '4', value: '4' },
                ]
            });

            this.grid.setPerPage(this.selectbox.getSelectedItem().value, this._datasource);
        };

        this.setupEvent = function () {          
            var pagination = this.grid.getPagination();
            if(pagination!=null){
                pagination.on('beforeMove',function(ev){
                    $.showLoadingBar();
                });
            }

            this.grid.on('response', ev => {
                const {response} = ev.xhr;
                const responseObj = JSON.parse(response);
                console.log('result : ', responseObj.result);
                console.log('data : ', responseObj.data);            
            });            

            this.grid.on('onGridUpdated', ev => {
                console.log(ev)
                // $.hideLoadingBar();
                if($(".grid-data-total")[0]!=null){                    
                    this.grid.el.lastElementChild.querySelector('.grid-data-total b').innerText = `${ev.instance.getPaginationTotalCount()}`;
                    this.grid.setPerPage(this.selectbox.getSelectedItem().value, this._datasource);
                }            
            });
            
            this.grid.on('failResponse', (evt) => {
                const xhr = evt.xhr;
                const message = qtjs.parseMessage(xhr.response);
                console.log('err message : ', message);
                console.log('evt message : ', evt);
                
            });

            this.selectbox.on('change', ev=> {
                console.log(ev)
                this.grid.setPerPage(this.selectbox.getSelectedItem().value, this._datasource);
            });
        };       
         
        this.requestData = function (params) {
            console.log('requestData-param', params)
            this.grid.readData(1, params, true);
        };
        
        this.resetData = function (data) {    
            // console.log('requestData-data', data)
            // this.grid.resetData(data);
        };
        
        this.getCheckedRows = function () {
            return this.grid.getCheckedRows();
        };

        this.getCheckedRowKeys = function () {
            return this.grid.getCheckedRowKeys();
        }

        this.reloadData = function () {
           $.hideLoadingBar();
           return this.grid.reloadData();
        };


        this.getRow = function (key) {
            return this.grid.getRow(key);
        };

        this.setupEventListener = function (type, callback) {
            this.grid.on(type, callback);
        }

        this.init();
        this.setupEvent();        

        return this;
    };
})(window.jQuery);