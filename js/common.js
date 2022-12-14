'use strict';

(function() {
    console.log("IIFE");
})();

window.onload = function() {
    init();
}

function init() {
    document.body.classList.add(checkAgent());

    /* toolbar */
    for(let item of Object.values(document.querySelectorAll('.toolbar-toggle'))) {    
        item.addEventListener('click', () => {
            item.closest('.qs-toolbar').classList.toggle('close');
        });
    }

    /* select */
    for(let item of Object.values(document.querySelectorAll('.qs-select'))) {
        qsSelectBox(item.id);
    }

    /* picker */
    for(let item of Object.values(document.querySelectorAll('.qs-date'))) {
        if(!item.innerHTML) {
            qsPicker(item.id);
        }
    };
}

function qsSelectBox(id, user_data = []) {
    document.getElementById(id).querySelector('select').style.color = 'transparent';
    document.getElementById(id).querySelector('select').style.borderColor = 'transparent';
    document.getElementById(id).querySelector('select').style.display = 'none';
    let select_data = [];
    
    if(user_data.length > 0) {
        select_data = user_data;
    }else{        
        for(let item of Object.values(document.getElementById(id).querySelectorAll('option'))){
            select_data.push({
                label: item.innerText,
                value: item.value,
                disabled: item.getAttribute('disabled') === null ? false : true,
                selected: item.getAttribute('selected') === null ? false : true
            })
        }
    }    
    return new tui.SelectBox(`#${id}`, { data: select_data });
}


function qsPicker(id, user_option = {}) {    
    if(!id) {
        return;
    }

    const picker_today = new Date();

    let picker_option = {
        language: 'ko',
        calendar: {
            showToday: false
        },
        showAlways: false,
        calendar: {
            showToday: false
        },
        autoClose: true,
        format: 'yyyyMMdd',
        input: {},
        startpicker: {},
        endpicker: {}
    }

    const ctrl_id = self.crypto.getRandomValues(new Uint16Array(1));
    let picker = document.getElementById(id);
    let picker_type = (picker.hasAttribute('date-type')) ? picker.getAttribute('date-type') : 'single';
    let picker_start_date = (user_option.startDate) ? user_option.startDate : new Date(picker_today.getFullYear(), picker_today.getMonth(), 1);
    let picker_end_date = (user_option.endDate) ? user_option.endDate : new Date(picker_today.getFullYear(), picker_today.getMonth() + 1, 0);
    let picker_start_html = `
    <div class="tui-datepicker-input tui-has-focus">
        <input type="number" id="startpicker-input-${ctrl_id}" class="datepicker-input" readonly />
        <span class="tui-ico-date"></span>
    </div>
    <div id="startpicker-container-${ctrl_id}" class="datepicker-container datepicker-container-start"></div>`;
    let picker_end_html = `
    <div class="tui-datepicker-input tui-has-focus">
        <input type="number" id="endpicker-input-${ctrl_id}" class="datepicker-input" readonly />
        <span class="tui-ico-date"></span>
    </div>
    <div id="endpicker-container-${ctrl_id}" class="datepicker-container datepicker-container-end"></div>`;
    let new_picker = {};

    switch(picker_type) {
        case 'period':
            let select_html = `<div id="picker-select-${ctrl_id}" class="qs-select"></div>`;
            let select_option = (user_option.period_select) ? user_option.period_select : {
                '??????': [picker_today,picker_today],
                '??????': [new Date(picker_today.getFullYear(), picker_today.getMonth(), 1), new Date(picker_today.getFullYear(), picker_today.getMonth()+1, 0)],
                '????????????': [new Date(picker_today.getFullYear(), picker_today.getMonth(), picker_today.getDate() - 7), new Date(picker_today)],
                '?????????': [new Date(picker_today.getFullYear(), picker_today.getMonth()-1, picker_today.getDate()), picker_today],
                '??????': [new Date(picker_today.getFullYear(), picker_today.getMonth()-1, 1), new Date(picker_today.getFullYear(), picker_today.getMonth(), 0)],
                '?????????': [new Date(picker_today.getFullYear(), picker_today.getMonth()-2, 1), new Date(picker_today.getFullYear(), picker_today.getMonth()-1, 0)],
            };
            let select_option_data = [];

            for (const [key, value] of Object.entries(select_option)) {
                select_option_data.push({
                    label: key,
                    value: value
                });
            }

            picker.innerHTML = `${select_html}${picker_start_html}<span class='qs-unit'>~</span>${picker_end_html}`;            
            picker_option.startpicker.date = picker_start_date;
            picker_option.startpicker.input = `#startpicker-input-${ctrl_id}`;
            picker_option.startpicker.container = `#startpicker-container-${ctrl_id}`;
            picker_option.endpicker.date = picker_end_date;
            picker_option.endpicker.input = `#endpicker-input-${ctrl_id}`;
            picker_option.endpicker.container = `#endpicker-container-${ctrl_id}`;
            new_picker = tui.DatePicker.createRangePicker(picker_option);

            let select_range = new tui.SelectBox(`#picker-select-${ctrl_id}`, { data: select_option_data });
            select_range.on('change', function (ev) {
                // console.log(ev);
                let arrDate = ev.curr.value.split(',');
                new_picker.setStartDate(new Date(arrDate[0]));
                new_picker.setEndDate(new Date(arrDate[1]));
            });
        break;
        case 'range':
            picker.innerHTML = `${picker_start_html}<span>~</span>${picker_end_html}`;            
            picker_option.startpicker.date = picker_start_date;
            picker_option.startpicker.input = `#startpicker-input-${ctrl_id}`;
            picker_option.startpicker.container = `#startpicker-container-${ctrl_id}`;
            picker_option.endpicker.date = picker_end_date;
            picker_option.endpicker.input = `#endpicker-input-${ctrl_id}`;
            picker_option.endpicker.container = `#endpicker-container-${ctrl_id}`;
            new_picker = tui.DatePicker.createRangePicker(picker_option);
        break;
        case 'month':
            picker.innerHTML = picker_start_html;
            picker_option.type = "month";
            picker_option.input.element = `#startpicker-input-${ctrl_id}`;
            picker_option.input.format = 'yyyyMM';
            picker_option.date = picker_start_date;            
            new_picker = new tui.DatePicker(`#startpicker-container-${ctrl_id}`, picker_option);
        break;
        case 'year':
            picker.innerHTML = picker_start_html;
            picker_option.type = "year";
            picker_option.input.element = `#startpicker-input-${ctrl_id}`;
            picker_option.input.format = 'yyyy';
            picker_option.date = picker_start_date;            
            new_picker = new tui.DatePicker(`#startpicker-container-${ctrl_id}`, picker_option);
        break;
        default:
            picker.innerHTML = picker_start_html;
            picker_option.type = "date";
            picker_option.input.element = `#startpicker-input-${ctrl_id}`;
            picker_option.input.format = 'yyyyMMdd';
            picker_option.date = picker_start_date;
            new_picker = new tui.DatePicker(`#startpicker-container-${ctrl_id}`, picker_option);
        break;
    }
    return new_picker;
}

function qsGrid(id) {
    if(!id) {
        return;
    }

    let grid_option = {
        el: document.getElementById(id),
        scrollX: true,
        scrollY: true,
        rowHeight: 32,
        minRowHeight: 32,
        bodyHeight: 500,
        // rowHeaders: ['rowNum', 'checkbox'],
        header: {
            height: 32,
        },
        columns: [],
        data: [],        
        pageOptions: {
            useClient: false,
            perPage: 10
        }
    }

    let new_grid = new tui.Grid(grid_option);
    return new_grid;
}

function formatter_price(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatter_htel(value) {
    const telNum = value.replace(/[^0-9]/g, '').replace(/^(\d{3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
    return telNum;
}

function formatter_email(value) {
    const regexr = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regexr.test(value);
}

function checkAgent(){ 
    var userAgent = navigator.userAgent.toLowerCase(); //userAgent ??? ??????    
    
    if ( userAgent.indexOf('android') > -1) {
        //???????????????
        // console.log("android");
        // return "android";
        document.body.classList.add('agent-mobile');
        document.body.classList.add('agent-android');
    } else if ( userAgent.indexOf("iphone") > -1||userAgent.indexOf("ipad") > -1||userAgent.indexOf("ipod") > -1 ) {
        //IOS
        // console.log("ios");
        // return "ios";
        document.body.classList.add('agent-mobile');
        document.body.classList.add('agent-ios');
    } else {
        //?????????, ??????????????? ???
        // console.log("other");
        // return "other";
        document.body.classList.add('agent-pc');
    }    
}