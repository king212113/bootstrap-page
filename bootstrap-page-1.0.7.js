var ser = true;
;
(function(window, factory) {
    //amd
    if(typeof define === 'function' && define.amd) {
        define(factory);
    } else if(typeof exports === 'object') { //umd
        module.exports = factory();
    } else {
        window.CHTPage = factory();
    }
})(this, function() {
    var jet = {};
    var CHTPage = function(options) {
        var opts = typeof(options) === "function" ? options() : options;
        return new CHTPagePick(opts);
    };

    CHTPage.extend = jet.extend = function() {
        var options, name, src, copy, deep = false,
            target = arguments[0],
            i = 1,
            length = arguments.length;
        if(typeof(target) === "boolean") deep = target, target = arguments[1] || {}, i = 2;
        if(typeof(target) !== "object" && typeof(target) !== "function") target = {};
        if(length === i) target = this, --i;
        for(; i < length; i++) {
            if((options = arguments[i]) != null) {
                for(name in options) {
                    src = target[name], copy = options[name];
                    if(target === copy) continue;
                    if(copy !== undefined) target[name] = copy;
                }
            }
        }
        return target;
    };

    jet.extend(CHTPagePick.prototype, {
        showTable:function () {
            var that = this.opts,
                toThat = this;
            var elem = that.tableId;
            var table = $(elem);
            if(that.tableDate == null){
                if(that.type === "get") {
                    var new_url = that.URL;
                    if(that.data != null || that.data !== "") {
                        var text = "?";
                        for(var i in that.data) {
                            if(that.data[i] != null){
                                text += i + "=" + that.data[i] + "&"
                            }
                        }
                        new_url += text;
                    }
                    appCommon.request(new_url, function(res) {
                        console.log(res);
                        table.bootstrapTable("destroy");
                        if(that.tableHeight !== null && that.tableHeight>0) {
                            console.log(that.tableHeight);
                            table.bootstrapTable({
                                sidePagination: "client",
                                undefinedText: "- -",
                                data: res.data,
                                cache:false,
                                height: that.tableHeight
                            });
                        } else {
                            table.bootstrapTable({
                                sidePagination: "client",
                                undefinedText: "- -",
                                cache:false,
                                data: res.data
                            });
                        }
                    }, function(error) {
                        console.log(error)
                    });
                } else {
                    var new_url = that.URL;
                    appCommon.postRequest(new_url, JSON.stringify(that.data),function(res) {
                        for(var list in res.data.list){
                            $page={
                                pageNum:that.pageNum
                            };
                            jet.extend(res.data.list[list], $page || {});
                        }
                        toThat.ShowPage(res.data);
                    }, function(error) {
                        console.log(error)
                    });
                }
            }else{
                for(var list in that.tableDate.data.list){
                    $page={
                        pageNum:that.pageNum
                    };
                    jet.extend(res.data.list[list], $page || {});
                }
                toThat.ShowPage(res.data);
            }
            $(".fixed-table-container-ck").css("padding-bottom", that.bottom);
        },
        toPage: function(page) {
            console.log(this);
            var that = this.opts,
                toThat = this;
            if(page != null) {
                that.pageNum = page;
                console.log("当前跳转页：" + that.pageNum);
            }
            if(that.tableDate == null){
                if(that.type === "get") {
                    var new_url = that.URL + that.pageNum + "/" + that.pageSize;
                    if(that.data != null || that.data !== "") {
                        var text = "?";
                        for(var i in that.data) {
                            if(that.data[i] != null){
                                text += i + "=" + that.data[i] + "&"
                            }
                        }
                        new_url += text;
                    }
                    appCommon.request(new_url, function(res) {
                        console.log(res);
                        for(var list in res.data.list){
                            $page={
                                pageNum:that.pageNum
                            };
                            jet.extend(res.data.list[list], $page || {});
                        }
                        toThat.ShowPage(res.data);
                    }, function(error) {
                        console.log(error)
                    });
                } else {
                    var new_url = that.URL + that.pageNum + "/" + that.pageSize;
                    appCommon.postRequest(new_url, JSON.stringify(that.data),function(res) {
                        console.log(res);
                        for(var list in res.data.list){
                            $page={
                                pageNum:that.pageNum
                            };
                            jet.extend(res.data.list[list], $page || {});
                        }
                        toThat.ShowPage(res.data);
                    }, function(error) {
                        console.log(error)
                    });
                }
            }else{
                for(var list in that.tableDate.data.list){
                    $page={
                        pageNum:that.pageNum
                    };
                    jet.extend(res.data.list[list], $page || {});
                }
                toThat.ShowPage(res.data);
            }

        },
        ShowPage: function(data) {
            var selt = this;
            var that = this.opts;
            var elem = that.tableId;
            that.pages.sumPage = data.pages;
            that.pages.allNum = data.total;
            that.pages.allNumTo = data.endRow;
            that.pages.starNum = data.startRow;
            that.pages.max = data.pages;
            pageNum = data.pageNum;
            var table = $(elem);
            if(that.showTable) {
                table.bootstrapTable("destroy");
                if(that.tableHeight !== null && that.tableHeight>0) {
                    console.log(that.tableHeight);
                    table.bootstrapTable({
                        sidePagination: "client",
                        undefinedText: "- -",
                        data: data.list,
                        cache:false,
                        height: that.tableHeight
                    });
                } else {
                    table.bootstrapTable({
                        sidePagination: "client",
                        undefinedText: "- -",
                        cache:false,
                        data: data.list
                    });
                }
            }
            $(".fixed-table-container-ck").css("padding-bottom", that.bottom);
            var str = "";
            str += '<li style="color:'+that.style.btnFontColor+'">';
            str += '<a style="background: '+that.style.btnColor+'" id="home_'+that.id+'" href="#" onclick="showChtData(1,'+JSON.stringify(that).replace(/"/g, '&quot;')+')">首页</a>';
            str += '</li>';
            if(!data.hasPreviousPage) {
                str += '<li class="disabled" style="color:'+that.style.btnFontColor+'">';
                str += '<a style="'+that.style.btnColor+'" href="#">上一页</a>';
            } else {
                str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + (data.pageNum - 1) + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">上一页</a></li>';
            }
            str += '</li>';
            if(data.pages > 6) {
                str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + 1 + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + 1 + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + 1 + '</a></li>';
                if(data.pageNum !== 1 && data.pageNum <= 4) {
                    for(var i = 2; i <= 4; i++) {
                        str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + i + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + i + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + i + '</a></li>';
                    }
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>';
                } else if(data.pageNum === 1) {
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>'
                    for(var i = parseInt(data.pages / 2); i <= parseInt(data.pages / 2 + 2); i++) {
                        str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + i + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + i + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + i + '</a></li>';
                    }
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>';
                } else if(data.pageNum + 1 === data.pages || data.pageNum === data.pages) {
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>';
                    for(var i = data.pages - 3; i <= data.pages - 1; i++) {
                        str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + i + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + i + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + i + '</a></li>';
                    }
                } else {
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>'
                    for(var i = parseInt(data.pageNum - 1); i <= parseInt(data.pageNum + 1); i++) {
                        str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + i + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + i + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + i + '</a></li>';
                    }
                    str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'">···</a></li>';
                }
            } else {
                for(var i = 1; i < data.pages; i++) {
                    str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + i + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + i + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + i + '</a></li>';
                }
            }
            str += '<li style="color:'+that.style.btnFontColor+'" id="page_' + that.pages.toPageId + data.pages + '"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + data.pages + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">' + data.pages + '</a></li>';
            if(data.isLastPage) {
                str += '<li style="color:'+that.style.btnFontColor+'" class="disabled">';
                str += '<a style="'+that.style.btnColor+'" class="disabled">下一页</a>';
            } else {
                str += '<li style="color:'+that.style.btnFontColor+'"><a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + data.nextPage + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">下一页</a>'
            }
            str += '</li>' +
                '<li style="color:'+that.style.btnFontColor+'">' +
                '<a style="'+that.style.btnColor+'" href="#" onclick="showChtData(' + data.pages + ','+JSON.stringify(that).replace(/"/g, '&quot;')+')">尾页</a>' +
                '</li>';

            $(elem).parent().parent().parent().after(this.addpaging());
            $("#pages" + that.pages.toPageId).html(str);
            if(that.body_overflow !== null){
                console.log(that.body_overflow);
                $(elem).parent().css("overflow",that.body_overflow);
            }
            this.initPageActive(data);
            var _that = this;

        },
        initPageActive: function(data) {
            var that = this.opts;
            $("#" + that.pages.toPageId).val(data.pageNum);
            $("#page_" + that.pages.toPageId + data.pageNum).attr("class", "active");
        },
        addpaging: function() {
            var that = this.opts;
            return "<div class=\"container\" style=\"padding: 0;width: 100%;position: "+that.postion+";margin-left:"+that.left+"px;bottom: 0;color:"+that.style.fontColor+";background: "+that.style.bgColor+";\">" +
                "            <div class=\"row clearfix\">\n" +
                "                <div class=\"col-md-3 column\" style=\"float: left;padding: 0px;padding-top:17px;padding-left: 3%;\">\n" +
                "                    显示第<span>" + that.pages.starNum + "</span>条 到 第<span>" + that.pages.allNumTo + "</span>条    共<span>" + that.pages.allNum + "</span>条记录\n" +
                "                </div>\n" +
                "                <div class=\"col-md-3 column\" style=\"width: 26%;float: left;padding: 14px;margin-top: -6px;text-align: right;\">\n" +
                '                    <a style="float: right;margin-top: 7px;margin-right: -19px;color:'+that.style.linkColor+'" href="#" onclick="appoint('+JSON.stringify(that).replace(/"/g, '&quot;')+');">&nbsp;跳转</a>\n' +
                '                    <input type="number" value="' + that.pageNum + '" id="pageNum' + that.pages.toPageId + '" min="1" max="' + that.pages.max + '" class="form-control" style="width: 48px;height:26px;float: right;padding: 0;margin-top: 2px;padding-left:13px;text-align: center;" />\n' +
                "                    <div style=\"float: right;margin-top: 7px;\">&nbsp;&nbsp;&nbsp;指定页&nbsp;</div>\n" +
                "                    <div style=\"margin-top: 7px;float: right\">共<span>" + that.pages.max + "</span>页</div>\n" +
                "                </div>\n" +
                "                <div class=\"col-md-6 column\" style=\"width: 48%;padding: 0;margin-top: -10px;padding-right: 3%;height: 52px;\">\n" +
                '                    <ul class="pagination" style="float: right" id="pages' + that.pages.toPageId + '">\n' +
                "                    </ul>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>"
        }
    });

    showChtData = function(page, self) {
        self.pageNum = page;
        return new CHTPagePick(self);
    };

    getIndex = function(value, row, index) {
        return (row.pageNum-1)*10+index+1;
    };

    getIndex2 = function(value, row, index) {
        return index+1;
    };

    initOperation = function(value, row, index) {
        var html = "";
        console.log(row);
        html += ' <a class="btn btn-xs btn-success" style="margin-left: 3px;" href="javascript:gotoEditSite(' + value + ')"><i class="fa fa-pencil-square-o"></i> 编辑 </a> ';
        html += ' <a class="btn btn-xs btn-info" style="margin-left: 3px;" href="javascript:gotoDetail(' + value + ')"> <i class="fa fa-info-circle"></i> 详情 </a> ';
        html += ' <a class="btn btn-xs btn-danger" style="margin-left: 3px;" href="javascript:gotoDelete(' + value + ',-2)"><i class="fa fa-trash-o"></i> 删除 </a> ';
        return html;
    };

    initOperationTwo = function(value, row, index) {
        var html = "";
        console.log(row);
        html += ' <a class="btn btn-xs btn-success" style="margin-left: 3px;" href="javascript:gotoEditSite(' + value + ')"><i class="fa fa-pencil-square-o"></i> 编辑 </a> ';
        html += ' <a class="btn btn-xs btn-danger" style="margin-left: 3px;" href="javascript:gotoDelete(' + value + ',-2)"><i class="fa fa-trash-o"></i> 删除 </a> ';
        return html;
    };

    deleteByIdCallBack = function(URL,callback){
        if(confirm("是否确定删除？")){
            appCommon.deleteRequest(URL,function (suc) {
                if(suc.code === 0){
                    bootoast({
                        message: '删除成功',
                        position:'top-right',
                        type: 'success',
                        timeout:2
                    });
                    if (callback) {
                        callback();
                    }
                }else{
                    bootoast({
                        message: '不可删除',
                        position:'top-right',
                        type: 'danger',
                        timeout:2
                    });
                }
            },function (error) {
                bootoast({
                    message: '删除失败',
                    position:'top-right',
                    type: 'danger',
                    timeout:2
                });
            });
        }else{
            bootoast({
                message: '删除取消',
                position:'top-right',
                type: 'danger',
                timeout:2
            });
        }
    };

    deleteById = function(URL){
        if(confirm("是否确定删除？")){
            appCommon.deleteRequest(URL,function (suc) {
                if(suc.code === 0){
                    bootoast({
                        message: '删除成功',
                        position:'top-right',
                        type: 'success',
                        timeout:2
                    });
                    showData();
                }else{
                    bootoast({
                        message: '不可删除',
                        position:'top-right',
                        type: 'danger',
                        timeout:2
                    });
                }
            },function (error) {
                bootoast({
                    message: '删除失败',
                    position:'top-right',
                    type: 'danger',
                    timeout:2
                });
            });
        }else{
            bootoast({
                message: '删除取消',
                position:'top-right',
                type: 'danger',
                timeout:2
            });
        }

    };

    initOperationOnlyDetail = function(value, row, index) {
        var html = "";
        html += ' <a class="btn btn-xs btn-info" style="margin-left: 3px;" href="javascript:gotoDetail(' + value + ')"> <i class="fa fa-info-circle"></i> 详情 </a> ';
        return html;
    };

    initOperationOnlyDelete = function(value, row, index) {
        var html = "";
        html += ' <a class="btn btn-xs btn-danger" style="margin-left: 3px;" href="javascript:gotoDelete(' + value + ')"><i class="fa fa-trash-o"></i> 删除 </a> ';
        return html;
    };

    initOperationOnlyDe = function(value, row, index) {
        var html = "";
        html += ' <a class="btn btn-xs btn-info" style="margin-left: 3px;" href="javascript:gotoDetail(' + value + ')"> <i class="fa fa-info-circle"></i> 详情 </a> ';
        html += ' <a class="btn btn-xs btn-danger" style="margin-left: 3px;" href="javascript:gotoDelete(' + value + ')"><i class="fa fa-trash-o"></i> 删除 </a> ';
        return html;
    };

    forSearch = function() {
        ser = false;
        showData();
    };

    hideRight = function(a){
        $("#leftUser").removeClass("col-sm-8");
        $("#leftUser").addClass("col-sm-12");
        $("#closeRight").hide();
        $("#rightDetail").hide();
        $("#rightEdit").hide();
        if(a){
            showData();
        }
    };

    showRight = function(){
        showRight(true);
    };

    showRight = function(a){
        if($("#rightDetail").is(":hidden")){
            if(a){
                showData();
            }
            $("#closeRight").show();
            $("#leftUser").removeClass("col-sm-12");
            $("#leftUser").addClass("col-sm-8");
            $("#rightDetail").show();
        }
    };

    getUser = function(value, row, index){
        if (stringLength(value.nickname) > 16) {
            return '<a class="tooltip-test" data-toggle="tooltip" data-placement="bottom" title="'+value.nickname+'">'+ value.nickname.slice(0, 8) + '...</a>';
        }
        return value.nickname;
    };

    stringLength = function(text) {
        var len = 0,code=0;
        for(var i = 0;i < text.length;i++){
            code = text.charCodeAt(i);
            if(code >= 0 && code <= 127){
                len += 1;
            }else{
                len += 2;
            }
        }
        return len;
    }

    getImage = function(value, row, index) {
        if(value === null || value === "" || value === undefined){
            return '<img src="../img/launcher.png" style="width: 60px;height: 60px;border-radius:50% "/>';
        }
        return '<img src="'+value+'" style="width: 60px;height: 60px;border-radius:50% "/>';
    }

    getData = function(value, row, index){
        if(value != null){
            return value.replace("T"," ")
        }else{
            return "--";
        }

    };

    appoint = function(self) {
        var page = $("#pageNum" + self.pages.toPageId).val();
        var sumPage = self.pages.max;
        if(page > sumPage) {
            $("#pageNum" + self.pages.toPageId).val(sumPage);
            self.pageNum = sumPage;
        } else {
            self.pageNum = page;
        }
        return new CHTPagePick(self);
    };

    function CHTPagePick($opts) {
        var config = {
            id:null,
            URL: null,
            showPage:true,
            pageNum: 1,
            pageSize: 10,
            changeFun: null, //点击跳转之后的回调事件
            postion: "absolute", //分页div悬浮状态
            tableId: null,
            data: null,
            type: "get",
            tableHeight: 500,
            showTable:true,
            body_overflow:"auto",
            bottom:"45px",
            theme:1,
            left:0,
            tableDate:null,
            pages: {
                pageNum: null,
                allNum: null,
                allNumTo: null,
                starNum: null,
                page: null,
                sumPage: null,
                max: null,
                toPageId: null
            }
        };

        this.opts = jet.extend(config, $opts || {});
        this.opts.pages.toPageId = $opts.tableId.replace("#", "");
        this.tableId = $opts.tableId;
        this.valCell = $Q($opts.tableId);
        this.opts.style = getTheme(this.opts.theme);
        this.opts.id = $opts.tableId.replace("#","");
        if(this.opts.showPage){
            this.valCell != null ? this.toPage() : alert($opts.tableId + "  ID\u6216\u7C7B\u540D\u4E0D\u5B58\u5728!");
        }else{
            this.valCell != null ? this.showTable() : alert($opts.tableId + "  ID\u6216\u7C7B\u540D\u4E0D\u5B58\u5728!");
        }

    }

    function getTheme(type) {
        var style1 = {
            bgColor:"#e8e7e7",
            fontColor:"#141313",
            linkColor:"#428bca",
            btnFontColor:"#000",
            btnColor:"#fff",
            size:""    //pagination-lg  pagination-sm
        };
        var style2 = {
            bgColor:"#222d32",
            fontColor:"#ffffff",
            linkColor:"#428bca",
            btnFontColor:"#000",
            btnColor:"#d2d2d2",
            size:""    //pagination-lg  pagination-sm
        };
        var style = style1;
        if(type === 2){
            style = style2;
        }
        return style;
    }


    var $Q = function(selector, content) {
        content = content || document;
        return selector.nodeType ? selector : content.querySelector(selector);
    };

    return CHTPage;
})