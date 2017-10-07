/**
 * INSPINIA - Responsive Admin Theme
 * Copyright 2015 Webapplayers.com
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - pageTitle
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - ckEditor
 *  - highChart

 * - dlEnterKey
 */


function highChart() {
    return {
        restrict: 'A',
        scope: {
            settings: '='
        },
        link: function (scope, element) {
            scope.$watch("settings.yAxis",
                    function()  {
                        setChart(element, scope);
                    }, true
                );
            
        }
    
    }

    function setChart(element, scope) {
        $(element).highcharts({
            chart: {
                type: scope.settings.type
            },
            title: {
                text: scope.settings.title,
                x: -20 //center
            },
            subtitle: {
                text: scope.settings.subTitle,
                x: -20
            },
            xAxis: {
                categories: scope.settings.xAxis,
                title: {
                    text: scope.settings.xTitle
                }
            },
            yAxis: {
                title: {
                    text: scope.settings.yTitle
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: scope.settings.suffix
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: scope.settings.yAxis
        });
    }
}

function ckEditor() {
    return {
        require: '?ngModel',
        link: function ($scope, elm, attr, ngModel) {

            var ck = CKEDITOR.replace(elm[0]);

            ck.on('pasteState', function () {
                $scope.$apply(function () {
                    ngModel.$setViewValue(ck.getData());
                });
            });

            ngModel.$render = function (value) {
                ck.setData(ngModel.$modelValue);
            };
        }
    };
}

function restrictInput() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elem, attrs, ngModelCtrl) {
            //elem.keyup(function () {
            //    ngModelCtrl.$validators.validateDate = angular.isDate(elem.val())
            //});
            elem.keypress(function () {
                return false;
            });
            elem.keydown(function () {
                return false;
            });

            elem.bind('copy paste', function (e) {
                e.preventDefault();
            });
        }
    };
}

/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'PUGAL.IN';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'PUGAL.IN | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

function sort() {
    return {
        restrict: 'A',
        transclude: true,
        template:
          '<a ng-click="onClick()">' +
            '<span ng-transclude></span>' +
            '<i class="fa" style="font-size:20px; padding-left:5px" ng-class="{\'fa-sort-desc\' : order === by && !reverse,  \'fa-sort-asc\' : order===by && reverse}"></i>' +
          '</a>',
        scope: {
            order: '=',
            by: '=',
            reverse: '=',
            sortingstr: '='
        },
        controller: function ($scope, $element) {

            $scope.onClick = function () {
                if ($scope.order === $scope.by) {
                    $scope.reverse = !$scope.reverse
                } else {
                    $scope.by = $scope.order;
                    $scope.reverse = false;
                }

                if (angular.isUndefined($scope.reverse) || $scope.reverse) {
                    $scope.sortingstr = '&$orderby=' + $scope.order;
                }
                else
                {
                    $scope.sortingstr = '&$orderby=' + $scope.order +' desc';
                }
            }
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
iboxTools.$inject = ['$timeout', '$filter', '$q', '$rootScope'];
function iboxTools($timeout, $filter, $q, $rootScope) {
    return {
        restrict: 'A',
        scope: {
            settings: '=',
            filterclick: '&',
            addclick: '&', editclick: '&',
            balanceclick: '&', paidclick: '&', pdfclick: '&', pendingclick : '&',
            printclick: '&', viewclick: '&', listclick: '&', deleteclick: '&', collectionclick: '&', excelclick: '&'
        },
        templateUrl: 'Partials/common/ibox_tools.html',
        link: function (scope, element) {

            scope.internalControl = scope.settings || {};
            var dd = {
                content: [

                    { text: 'but you can provide a custom styler as well', margin: [0, 20, 0, 8] },
                    {
                        style: 'tableExample',
                        table: {
                            headerRows: 1,
                            body: [
                                    [{ text: 'Header 1', style: 'tableHeader' }, { text: 'Header 2', style: 'tableHeader' }, { text: 'Header 3', style: 'tableHeader' }],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3'],
                            ]
                        },
                        layout: {
                            hLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 2 : 1;
                            },
                            vLineWidth: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                            },
                            hLineColor: function (i, node) {
                                return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                            },
                            vLineColor: function (i, node) {
                                return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                            },
                        }
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        fillColor: '#2361AE',
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 16,
                        bold: true,
                        margin: [0, 10, 0, 5]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                },
                defaultStyle: {
                    // alignment: 'justify'
                }

            }
            //Open Pdf
            scope.internalControl.openPdf = function (obj) {
                var pdf = pdfTransformer(obj);
                pdfMake.createPdf(pdf).download();
            }

            scope.internalControl.exportExcel = function (obj, fileName) {
                JSONToCSVConvertor(obj, fileName, true);
            }

            var elFilter = element.find('.filter');
            var filterContent = elFilter.parents('.ibox').find('div.filter-content');
            filterContent.hide();
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showFilter) && scope.settings.showFilter) {
                elFilter.removeClass('hide');
            }


            var elDel = element.find('.del');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showDel) && scope.settings.showDel) {
                elDel.removeClass('hide');
            }

            var elList = element.find('.list');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showList) && scope.settings.showList) {
                elList.removeClass('hide');
            }

            var elAdd = element.find('.add');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showAdd) && scope.settings.showAdd) {
                elAdd.removeClass('hide');
            }

            var elEdit =element.find('.edit');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showEdit) && scope.settings.showEdit) {
                elEdit.removeClass('hide');
            }

            var elView = element.find('.view');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showView) && scope.settings.showView) {
                elView.removeClass('hide');
            }

            var elPrint = element.find('.print'); 
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showPrint) && scope.settings.showPrint) {
                elPrint.removeClass('hide');
            }

            var elPdf = element.find('.pdf');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showPdf) && scope.settings.showPdf) {
                elPdf.removeClass('hide');
            }

            var elPaid = element.find('.paid'); 
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showPaid) && scope.settings.showPaid) {
                elPaid.removeClass('hide');
            }

            var elExcel = element.find('.excel');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showExcel) && scope.settings.showExcel) {
                elExcel.removeClass('hide');
            }

            var elBalance = element.find('.balance');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showBalance) && scope.settings.showBalance) {
                elBalance.removeClass('hide');
            }

            var elBalance = element.find('.collection');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showCollection) && scope.settings.showCollection) {
                elBalance.removeClass('hide');
            }
            var elBalance = element.find('.pending');
            if (scope.settings != null && angular.isDefined(scope.settings) && angular.isDefined(scope.settings.showPending) && scope.settings.showPending) {
                elBalance.removeClass('hide');
            }

        },
        controller: function ($scope, $element) {
            // Function for collapse ibox
            
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            },
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            }
        }
    };

    //Generate pdf 

    //Generate PDf data from actual data
    function pdfTransformer(obj) {
        var pdf = {
            pageOrientation: obj.pageOrientation,
            pageSize : obj.pageSize,
            content: [],
            styles: {
                header: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 0, 0, 0]
                },
                subheader: {
                    fontSize: 16,
                    bold: true,
                    margin: [0, 10, 0, 5]
                },
                tableExample: {
                    margin: [0, 5, 0, 15]
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: '#ffffff',
                    fillColor: '#1ab394'
                },
                h2: {
                    margin: [0, 5, 0, 0],
                    fontSize: 10,
                    bold: true
                }
            }
        };

        pdf.content.push(getHeaderLayout());

        if (obj.headerData != null && angular.isDefined(obj.headerData) && obj.headerData.length > 0) {
            pdf.content.push({
                //style: 'tableExample',
                table: {
                    headerRows: 1,
                    body: [
                    ]
                },
                layout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? .7 : .3;
                    },
                    vLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? .7 : .3;
                    },
                    hLineColor: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#1ab394' : '#1ab394';
                    },
                    vLineColor: function (i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#1ab394' : '#1ab394';
                    }
                }
            });

            angular.forEach(obj.headerData, function (row) {
                if (row != null && row.length > 0) {
                    pdf.content[1].table.body.push(row)
                }
            });
        }

        //Adding sub title
        if (angular.isDefined(obj.subTitle)) {
            pdf.content.push({
                text: obj.subTitle, style: 'header'
            });
        }

        pdf.content.push(getTableLayout());

        var count = obj.headerData != null && angular.isDefined(obj.headerData) && obj.headerData.length> 0 ? 2 : 1;
        count = angular.isDefined(obj.subTitle) ? count + 1 : count;
        

        if (obj.type === 'horizontal') {
            if (angular.isDefined(obj.widths)) {
                pdf.content[count].table['widths'] = obj.widths;
            }
            pdf.content[count].table.body.push(getPdfHeader(obj));

            if (obj != null && angular.isDefined(obj.coulmns) && obj.coulmns.length > 0) {
                var cnt = 0;
                angular.forEach(obj.data, function (row) {
                    cnt++;
                    var data = getPdfGridData(obj, row, cnt % 2 > 0 ? '#F3F3F3' : '#FFFFFF');
                    if (data != null && data.length > 0) {

                        pdf.content[count].table.body.push(data)
                    }
                });
            }
        }
        else if (obj.type === 'vertical') {
            if (angular.isDefined(obj.widths)) {
                pdf.content[count].table['widths'] = obj.widths;
            }
            if (obj != null && angular.isDefined(obj.coulmns) && obj.coulmns.length > 0) {
                var cnt = 0;
                angular.forEach(obj.coulmns, function (cols) {
                    cnt++;
                    var val = '';
                    var tot = 0;
                    //calculate column
                    if (cols.dataType.indexOf('cal#') >= 0) {
                        var operator = cols.dataType.substr(cols.dataType.indexOf('#')+ 1);
                        var ct = 0;
                        angular.forEach(cols.field.split(','), function (col) {
                            if (ct == 0) {
                                tot = row[col.trim()] != null ? row[col.trim()] : 0
                            }
                            else {
                                switch (operator.split(',')[ct - 1]) {
                                    case '+':
                                        tot += row[col.trim()] != null ? row[col.trim()] : 0;
                                        break;
                                    case '-':
                                        tot = tot == 0 ? row[col.trim()] : row[col.trim()] != null ? tot - row[col.trim()] : 0;
                                        break;
                                    case '*':
                                        tot *= row[col.trim()] != null ? row[col.trim()] : 0;
                                        break;
                                    case '/':
                                        tot /= row[col.trim()] != null ? row[col.trim()] : 0;
                                        break;
                                }
                            }
                            ct++;
                        });

                        val = tot.toFixed(2);
                    }
                    else {
                        angular.forEach(cols.field.split(','), function (col) {
                            val = obj.data[0][col.trim()] != null ? val == '' ? obj.data[0][col.trim()] : val + ' ' + obj.data[0][col.trim()] : '';

                            switch (cols.dataType) {
                                case "date":
                                    val = $filter('date')(val, "dd/MM/yyyy");
                                    break;
                                case "bool":
                                    val = val == true ? 'Yes' : 'No';
                                    break;
                                case "number":
                                    if (angular.isDefined(val) && val != '') {
                                        val = '' + val + '';
                                    }
                                    break;
                                case "double":
                                    if (angular.isDefined(val) && val != '') {
                                        val = '' + val.toFixed(2) + '';
                                    }
                                    else if (val === 0) {
                                        val = '0.00'
                                    }
                                    break;
                                default:
                                    val = val != null ? val : '';
                                    break;
                            }
                        });
                    }

                    var data = [{ text: cols.displayName, fillColor: cnt % 2 > 0 ? '#F3F3F3' : '#FFFFFF' }, { text: val, fillColor: cnt % 2 > 0 ? '#F3F3F3' : '#FFFFFF', width: '*', }];
                    pdf.content[count].table.body.push(data)
                });
            }
        }

        //sub data
        if (angular.isDefined(obj.subData)) {
            angular.forEach(obj.subData, function (dta) {
                pdf.content.push({
                    text: dta.subTitle, style: 'header'
                });

                pdf.content.push(getTableLayout());
                var newCount = pdf.content.length > 0 ? pdf.content.length - 1 : 0;
                pdf.content[newCount].table.body.push(getPdfHeader(dta));
                if (dta != null && angular.isDefined(dta.coulmns) && dta.coulmns.length > 0) {
                    var cnt = 0;
                    angular.forEach(dta.data, function (row) {
                        cnt++;
                        var data = getPdfGridData(dta, row, cnt % 2 > 0 ? '#F3F3F3' : '#FFFFFF');
                        if (data != null && data.length > 0) {

                            pdf.content[newCount].table.body.push(data)
                        }
                    });
                }
            });
        }
        console.log(pdf);
        return pdf;
    }

    //Form the PDF header
    function getPdfHeader(obj) {
        var headers = []
        if (obj != null && angular.isDefined(obj.coulmns) && obj.coulmns.length > 0) {
            angular.forEach(obj.coulmns, function (cols) {
                headers.push({ text: cols.displayName, style: 'tableHeader' });
            });

        }
        return headers;
    }

    function getHeaderLayout() {
        return {
            table: {
                widths: ['auto', '*'],
                body: [
                    [

                    {
                        width: '*',
                        alignment: 'left',
                        stack: [
                            {
                                style: 'header',
                                text: $rootScope.loginUser.DisplayGroupName,
                                margin: [2, -30, 0, 2]
                            }
                            //,
                            //{
                            //    style: 'h2',
                            //    text: 'ACUSE DE RECIBO'
                            //},
                            //{
                            //    style: 'h2',
                            //    text: 'Envio de Correspondencia Digital'
                            //}
                        ]
                    }
                    ,
                    {
                        //image: 'data:image/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAJ0AAABxCAIAAABAwjZ4AAAgAElEQVR4nOy9Z1hT27YwvFZ6gNBDQid0kN5EmggColiQraKCIGLZKnZRrNvtVtg23Iq9oYBgAZQuSEcEBOm9d0LoIZCe78e85rA999z3Pu/3Ct7z3PFD1xNWmXOMOcocbcICgQD6X/i3A8RCD+B/4YfA/9L13xNQEAT9ryj+twEYhgUCAQzDKPDfQo/nf+H/DQBqCgQCWCAQ/C+//tvA3/j135Wu/yyKwEz/7eWTQCD4D7oiEP+DDSghtYRSaO50+Hz+dz8KfwEE/rfRRHw+H4IgBALB5/MRMAyDSS70qP7PAAYp+Ab8b4BAIBAIBKAcmM709HRTU1NFRcXU1BQCgeDxeAgEYnJy8uXLl1VVVf8x829kBs8KMSC8/p8lycDqFK5X5Pnz56H/IaJJOEjAcEgkEpCEwWDQ6XQEAhEZGVlTU2Nqapqamrp79+6+vr6nT58SiUQtLa2RkZF9+/YRicS0tDQ+n6+npzczM/Px48e+vj5xcXE8Hi/8BADh9T8skZ8bRXPHDEEQxOfzeTwe/2cFMDbhv1wuV8ivvb299fX1AoGgsLDQyMhocHAwICBgw4YN4K/Gxsajo6PV1dU2NjZVVVXe3t63bt0SCASfPn2ytLScnp7etm1bUVFReXn5pUuX+Hw+h8Phcrk8Ho/D4YBvCeG7wfy0AIYHJNnPrlbncgyXy0UikWNjY+np6TQarbe398iRI6mpqXZ2dps3b+7v73d3d+/p6aFSqQKBYHZ2dmhoyMjIyMbGprS0lE6nUygUgUAgKSmJwWBaW1uVlZXT09MNDAxOnTol1L4wDM/OzmZkZMAwDJAFzRHIPznLzoWfna6AqHw+H4FAYDAYKpXa2dl54cKFjo6OJUuWWFtbe3h4xMTErF27Nj8/X0dHZ2pqqrm5GYIgHo/X398P3iAmJobH47lcLp/Pn52d5fF40tLSx44dS0lJ2bp1K4PBAN8Cq4fJZL569Qr8wufzORwODMPgWcEcWCiE/DfhZ6crBEHA6qFSqfv27bt58+aiRYsOHTqUmpoKQZC5ufmpU6fCwsLOnDlTXV2toaEhISFBpVIBY6FQqNra2ry8PAsLC0NDw/T0dCQSGR8fr6am1tDQQKPR3r9/393dnZycDCwpsHoiIyOHh4dhGEahUHv37v38+TMMwxgMBolECm2Tn59xfzq6fmeOwjAMDFpxcXEdHZ1Xr151dnb+8ssvTCazqKhITk7OxsYmKSmJQqHU1NTgcDgSiXTz5s2pqSlVVdWbN2+mpaXdvn1bXV39wIEDq1atunz5spaW1s2bN4uLiw8ePNjZ2SklJaWjowNBEJ/PR6FQ6enpAoHA3Ny8q6vL3Ny8p6dHS0sLgqDIyMicnBwkEinkWugn97/yfyZzQDgSoX0EfuFwOBwORyAQODk5nT9/HthKhw4dGh8fDwoK6uzsFAgEKSkptbW16enpr1+/np2dnZyc7Ovrm5iYAC8BbxscHARvptPpFRUV586d+/z5M9DcXC53cnLy8OHDLS0tq1evXrduHQKBuHHjBlDV1tbW5ubm7969Y7FYbDabw+HMNeh+EphrN6EWel39DYCGEwgESCRyaGiIx+PJyclBEIREIrlcLgRBfn5+Hz58gCBIR0cHh8ONjIwMDAwkJCQcOXJk1apVXC7XwMAAgiCBQIDD4cTFxSEIAg9CEIRAIMhkskAg4HA4oqKiZmZmxsbGSCSSx+OBv54/f15SUlJKSgqNRnt7e9NoNENDQwiC7ty5w2AwioqKamtrS0tL7ezsgBzm/92/8VPBz0JXodELltvk5OSVK1dwONzly5chCOJwOCgUis/ne3t7p6WlxcfHYzAYAoEgLS19+fJlQC1g0/L5fOELAcFQKBTA+8zMDAqFwmAwaDQa3INEIsGuBolEQhC0detWLpcLw7Cfn9/Xr18ZDIadnV1DQ8PNmzfXr18/MTFhZWUFeGJgYEBCQgKHw4GX/4SkhQHn/iTD4vP5XC4Xi8X++eefioqKHh4eDQ0NZDJZXV1dyFVdXV1ZWVlEItHKykpRURGao4mhOT5FDoeDwWAgCJqZmYmOji4qKsLj8UBBAjVMJpOXLFmiq6sLPs1ms8H9fD5/Zmbm/PnzBAJh165d27ZtW7x4sZmZ2fDw8J49e4B57OXl5e3tvWXLlrmfXnD4m8tpwen6n1ofz549i4+Px+FwxcXFZDL5woULq1evBoYx4C0AwsHPdYUKra3a2tqenh4UChUcHLx27drly5czmcyJiYne3t7BwcHZ2dnh4WEul+vg4ODl5aWiogL8EigUCpi+4+PjBQUFV69ezc3NxWAwg4ODQCm0t7dv3bo1NDS0v79//fr1oqKiQFQs+B53LioW3o/4j6EgkaOjo729vUQi0cTEpLW1lUqlnj9/Xl1dPS0tbcOGDRwOB41GA68T/5uP+1+9MCcnZ//+/UZGRtPT02g0+vDhw3fu3CkrK2Oz2UZGRkFBQZqamqampiQSqb29/dmzZ11dXYaGhgQCQbjnwePx8vLyTCYzPT3d2NiYRCIBqqenpycnJwsEgv7+fjk5OVVV1bnfnVfc/Yu5Qz+DHBaqxvr6+osXLzY2NhKJxKNHj65cuXJyclJCQqKtre3WrVt//fUXm80GqvE7kcvn84HHf64TY9u2bQYGBuPj4ygUqqKiwtHRUUVFZXJycnZ2trS0VCAQLFu2jMPh+Pn5FRQUkEikhISEwsLCJUuW7NixQ1NTU7hbZbFYmZmZ0dHRmzZtcnV1zcvLO3PmDJFIDAsL09PTA9SVkpKSlZUV/D2stCCY/Ifo4i+0sQ5csgKBYMOGDdXV1VNTU9nZ2ZKSkrGxsZcuXVJXV/f19W1paeHz+YBN+d+ct/w5HmMmk9nU1DQ9Pf3u3bvu7m4ul+vs7Hzx4sXk5OSPHz/GxcV5e3vr6+vLy8ufP38+Ozs7KipKRUXljz/+sLe3V1dXX716dVpaWldXF9jXOjs75+TkjIyMDA8Ps1gsgUAwPT394cOHkydPFhcXm5ubg92RQCCIi4sTERE5ffo0k8n8zpm8IJjkf9vnLBhdhR9ls9kMBoPNZjs5Ob1//x7g69GjR6GhoePj43l5eeAX7jcQPggWBIfD6erqam1tPXToUH19PRqNfvnypUAgiImJMTc337Rpk7e3d1BQkL+//7lz54KDgyEIOnDgwIsXL9TU1JKTk6urqzdt2nT27NmQkBAMBnPlypWOjo7Y2Fh1dXVjY2NFRcWCggJhAEAgEJw4ccLU1JRGo4FBotHokJAQNpsNBslmsxcKn/y/03Vh9KtwV8Pj8dBoNBqNRiKRbDY7NjZ2w4YNSCTSzMxsaGiITCYbGhoCjuRyuSgU6rudDJ/PR6PRnp6eOBxueHiYx+M1NTUZGxvzeDwKhXLo0CFpaenR0VE6nS4QCGRkZOzt7aWkpO7evevr67ts2bL79++rqKgMDw+LiYn19vbq6+vr6+vv3LlTU1Ozq6ururpaV1fXz89PRkZmdnYWYIlKpU5PT2/cuDE3N3fDhg1Hjx4NCwuDYbiiogKCIElJST6fLwyZzSdKAQj16wLQVUhUCIJQKFRlZeXDhw8bGxudnZ2Liopu3bqFRCIzMzNhGDY3NweWLRKJRKFQw8PDY2NjwNsA7Kzm5ubc3NyBgQESiZSXl3fq1CkOh4NAIF6/fl1XVzcwMCAtLe3o6CgnJ1dWVgaIJysri8ViMzMzfXx8EhISqFTqnj17vn79SiQSIQiSkZFxdXWtq6vT1NR0dnaOiIh48OABBEHa2toARcbGxosWLYqMjDx79uzRo0f/+OOPjx8/7t27Nycnp66uTlFRUUFBgT8naD/PsMB2k/CL6enpbW1tioqKPT09WVlZtra2IJqGRCIXL15MoVCArdTf35+VlVVUVOTm5rZx40agVrFYbHR0dFNT0/Dw8MTEhLy8/Pj4uImJyfT0dGNjo6ysbFlZ2eDgoKqq6q+//qqjo/Pw4UNtbe3y8nJPT89t27a9ePFiaGhoaGgoICCgrKzs/fv3KBRq8+bNxcXFOjo6MzMzRkZGly5dWrZsWX19PQaDCQ8PFxERYbPZWCy2uLi4vb3d19f3/v37SUlJvr6+urq6MzMzMTExBw4c0NbW5v/dlJtPrIKPLoC/SWgAV1VV7dmz59q1a15eXhAE6evrv3r16vTp08I7eTweBoPhcDiRkZHNzc0SEhKPHj2ysLCgUChYLHZwcLCiokJERGRycpLD4QwODg4NDa1ZsyYhIQGG4bGxsZUrVxIIBBkZmaysrJaWFldX1wcPHmhoaBAIBAsLi5ycnOHh4dHRUVNT04yMDDExMRaL9f79+4yMDB8fn69fv+bm5i5evLimpmbbtm1Xrlzx9/ePjY1FoVBsNtvGxsbGxqarqysqKurkyZOrV6+GIKivr+/r16+zs7NCOSxYuFyL+RYX33kP3N3dL126FBkZCUGQm5ublpbW6Oio0EoCm/2IiIi4uDg6nc7hcAgEwvj4uEAgaGpq2rVr18uXL9XU1MAeg0AgnD17VlZWVlxcXFJSUllZuaamRlFRkc1ms1istLS0oaEhFoslJSWVlJSkr6+fkZERGBiIQCDS09ODgoJGRkaAjkcikVgsds+ePTAMAzv8ypUrly5dotPpISEhwGMF7KORkRElJaXVq1eDXzAYzNOnT01NTUGMbwGJCi2IfoUgCFCOTCavWbOGyWSGhYX19/fr6OjQaDQTExPhJhWBQMTGxv7666/i4uLy8vLu7u6Ojo5KSkoiIiJhYWFNTU2WlpbAJBYVFeVwOMHBwYCivb29VCp1dHRUXFy8tLRUQ0NDIBDU1dVpaWkxmUw8Hj87O9vV1eXq6kogELKzszU1NZlMpoSERGNjY0BAgIaGxm+//ebn59fd3a2lpYXBYBITEw8fPlxWViYiIqKjowMyN7BYbE9PT29vLx6Pl5aWJhAIRCKRTqczGAyBQIBC/UMWzht6hfp1vvkVfBiFQmGxWOARPHz4cEpKyuzsrJubG51OFxEREZqUAoGgublZSUnJwcGhpKSkurq6uroavGdgYGB2dlZbW5tCoSgoKCgqKmpoaBw8eHDRokX9/f0lJSXGxsYuLi5jY2MCgaClpYVMJuvp6SEQCBUVFTab7efnh8ViS0pKMjMz5eXlVVVVq6qqaDTaqVOnXr9+PTExcfDgwQ8fPnA4nL6+vqmpKVtb2zt37mhqav7555+pqalYLJbP58vKyu7bt4/L5Q4MDAwNDRUXF0dFRYWHh7u7u+fk5ICw8TyjVwjzTVcQMImOjr569Wp2dvbw8DAEQYaGhnfu3Fm3bt2yZcugOUmBMAw7OTlJSEisW7fOw8PDw8Pj6NGjBALhzJkzb968cXBwYLFYUVFRb9++jYuLq6qqsre3f/To0dDQkLW1NZPJ7OzsrK2ttbS0xGKx2traTCbz3bt3hoaGbW1tWCxWWlpaRUVFUlLSzc1NXl5+yZIlra2tUVFRQ0NDX79+ffz48ZkzZ7q7u4EdV15ebmFh0dHRsXPnzqNHj7a2tqJQKC6XKyUl5e/vX1dXd+/evePHjzc3N2dnZ9NoNBCoWMANz/zZTUDTABdrQkJCYmKikZEREolctGiRjY0Nk8kMDAzU1NQE6BB8A01NTSwWOzU1hUKhgAXb2dnZ3t5+6tQpNpudmZnZ2dkZHBwMw/CFCxdMTU3V1NSMjY0pFEpaWhqTyYQgCIvFcjicgYEBPp+/Y8cONBo9MzMTFxcnJydHJpO1tbWjoqKIRCISifTw8CgtLd2wYYObmxuNRtuwYcOLFy+OHj26cePGlJQUBoOhpKTU09OzatWq4ODguLg4NBoNBLKioqK1tfXSpUuvX7/OZDIzMjK0tbWBfSDc0c0zdedJvwqNCJD06+DgUF9fv2rVKmtr6/T09JycHBqN5uvri8Viwf1g/4dAIPB4fEZGBh6PX7t2LRaLnZycZLFY/v7+aWlpOjo6srKyZ86cmZ6eBpuNoKAgHA73+vXrwcHBZcuWtba2EonE0tLSioqKvXv3SklJ4XA4UVHRlpYWEolUXFysr6+vqamZkJBgbW1dXV1dX19/8OBBOTm59+/fa2pqioqKRkZGuru7x8TE7Ny5MzMzk8ViFRQU+Pj4FBQUYLFYY2NjgDd9fX0ikRgfH//w4cNLly45OzuD5Su0m+Zfv84HXee642dnZxMTE9XU1Hx9fTs7O/v6+nbt2rV//35nZ2d1dXVojhAGD6JQKDExsWfPnomIiGCx2OnpaRQK1dXV1d/fr66uLiEhkZaWhkQi9+zZ4+3tXV5efu7cOQaDoampOTQ01Nra6ufnp6CgQKFQOjo6cnNz9fX1mUwmBoPJysqSl5dHIBDh4eFubm7W1tYdHR39/f3Nzc0KCgo1NTVUKlVMTExERIRIJNrb28fFxTk6OsIwrK2tnZKSsnHjxubmZltbW2AewzB869atBw8evHjxYuPGjQwGg8FgPHv2rLOzU19ffy7SfxyShZ+YP7sJLFvg/yssLKypqUEikTgczs/Pb82aNUlJSTMzM8bGxsBfKHwKXPP5fHd398uXL3M4HFlZWV9f3y9fvly5cgWG4TNnztTW1oqKioqLiy9evBiBQLBYLCwW6+rq6u3tTSQSt2/f3tDQ0NPTk5mZWVxczGAwpKSkpqeni4qKBALB/fv3h4aG/Pz8/vjjDyaTOTg4WFNTs3z58vr6epAGNTQ0hMViQTxgy5YtBQUFMAz39/ebmZm9e/eOw+FER0cD0w+BQGzcuPHy5csuLi6lpaU3b950cnLat2+fiIiIkJbzLIfng66AQkC0fvr0CYlEAn2GQqFMTU1VVVXb2tqAr3iuyALXwKR0dHQ8ffr0+vXryWRyQECAtLR0f3//77//3t7ebmdn19bWNjY2Njs729fXFxQUJCIiEh8fj8fjExMTq6uraTQak8kEEphCoTQ3N8vKyh45cqSmpqahoeHDhw9VVVWRkZErVqyIjY3V1NRUVFQkkUhcLldERIRGo61YsSItLQ2DwZiamjY3N9PpdDU1NSQSyWAwoqOjhbttJSUlOTm5TZs2gYjC9PT07t27PTw8hPr1P00f+HEwT3IYSFQqlfro0aO3b99++vRpYmJCSkqKSCTa2Njo6elBEDTX8TZXHwMZLrSktLS0/Pz8nJ2dJyYmGhsbgePJ09NzYmLi3Llz/f394+PjY2NjgJUBzzEYDAcHh+HhYQQCYWtru379+rS0tBcvXsAwHBgY2N7eLi0tzePxpKSkcnJy+vr6REVFR0dHxcTEJCUle3p6VqxYcf369YCAAAUFBVlZ2ezsbH9/fyqVqqioWFxcvGLFCuCUZrPZvb294eHhiYmJDAbj+fPn2dnZmZmZVlZW86Zl50+/zqVTQkLCyMhIWFgYBEE9PT3x8fFJSUkKCgpKSkogx0VoOs4lLfTNRwFeCByQt27dmp2dZTAYg4ODvr6+mpqakZGRSCRSSUmJQqGA0Om+ffs4HE5bW5u8vHxLSwsGg/Hw8GhtbR0cHKTT6aWlpdu3b0cikS0tLZ8+faJQKIWFhSMjI5OTk+Li4jIyMqOjowoKCsrKys3NzcuWLXv16lVDQwODwdDX1y8sLFRRUXF1dc3IyKBQKIqKijweT1ZW1tXVNTc3d/v27YqKiqKiolwuF4fDgX2zEO8/CM/C98+Tfv2PzyAQMAybmpr6+/s7ODiEhITcvHnz2LFjMjIyIyMj0Lc0ZjB/oIznGpPwnPzTxMREb29vFRUVOzu7rq4uIO6QSKS6urq2tnZTU9ODBw/U1NSmpqYmJiaqq6sNDAyUlJSYTOb58+dpNFppaWl9fT2ZTN64caOMjExBQYG+vr63t7eSkhKHw5mdnZ2amurq6uLxeFZWVllZWWQyOSkpSVdXd9euXbm5uQ0NDYcPH4YgqK6uTlVVlUwm37x5Exj5EASNjY09efJk27ZtJ0+eVFNTW7Vqlbe391zH07zBD4/nCL38LBarsLBQS0tLVVUVpHxisViQ6oDD4fh8PmAdoH3FxMSE/howNi6Xi8Fg3r9/f+HChWvXrunp6dnZ2eno6Lx//x6JRLa2tp4+fXrPnj1VVVVIJNLNze3EiRNDQ0MuLi6rVq0aHx/n8/lNTU3p6ekaGhpIJNLKykpKSqq8vJzBYHR0dAQFBf3xxx/6+vrt7e1IJNLV1fXLly8UCkVFRSUkJEROTi4sLMzOzg7kub1+/Xr16tVPnjwpKCiYmpoaGhq6f//+rl27wFxGR0dRKNSdO3c+fPjAYDDMzc3DwsIUFRWFTrQfB4J5zlsDUrShoWHfvn0ODg6ysrI+Pj737t1TUlLS1NREoVBgt1daWnrixInp6ek3b940NTUNDAwYGBgA6vL5fAwGEx0dvW/fvvDwcC0tLXt7eyQS+eDBA3l5eQiCXr9+XVhYSKVSgdkcFxe3aNGi48ePDwwMZGRk1NbWgsiagYEBiPHJyMh8+vRpZGQkNzd3586dLS0tPB5vamrKwMCASqU2NzdXVlZiMJjLly8vWbJk+/bt/f39Dx48UFRUHBsbi46OJpPJHh4eOjo6oG4Hh8PZ29tjsViQqQoCumDrhUAgkpKSnJ2d58f3NN/6FYbh7OxsPB6/atWqDRs2iImJ+fn5PX361MnJSUREBNxTV1fX3NzMYrEIBMLbt2+lpaURCATYv6LRaJAw9vvvv+vo6CxfvlxdXf3hw4fm5ubArXPv3r1ly5Y1NTXJysp2dHRgsdiUlBQikQji83JycgMDA6qqqhoaGnp6etra2igUikaj9fT07N69e3Z29s2bN1JSUiQS6dWrV/fv3+/q6hITEzty5MjDhw/7+/ufPHmyfPny4uJiKpXKZDKVlZULCgq6u7tZLFZoaKi8vLyvr6+UlBSwnj5+/NjT05OUlGRmZqahoaGrq1tcXEyhUOTk5ISK5sfBvOpXIIoXL17c0NCwfPny5ubmsLAwb29vdXV1Go0GhsLn81esWLF//34zMzMOhyMhIaGkpFReXn7s2DEej0elUg8fPrxv377Vq1f7+Pjs2LEjPz/f0tKSx+MBg3lsbExZWVlMTAyCIA6HIykpaWFhgUQiSSQSBEHj4+N0On358uVEIjE1NZVGo8XFxQ0PDx87dqy+vj41NVVVVZVKpcbFxRkZGY2Ojvr4+IyOjnI4nKGhIRBRKCkpMTMzy8rKmpyclJOTa29vR6FQICp89+7djIwMoU0gJycnKipaUlLS2dmZlZW1adOm0dFRfX39eSDqXPjh/Cp8s4yMzJIlS2RkZM6cOUOj0Q4cODA0NHTkyBGADrBVVVNTMzc3V1NTs7CwiI6OXr16dWtrq7i4OJVKLSwsvHLlip+fn5KSUkREBEhgA9mgCASis7MzOTkZhmGwY8Hj8Z2dnbq6uvX19Tweb3x8nEgkNjU1dXV1rVq16suXL1JSUhAEpaamksnkDRs2PH78+Pbt20QicfXq1cPDwx8+fPDx8fnzzz/9/f3fvXu3du3azs5Oa2trLperp6enoqKSn59vZWUFqIhCoQYGBtzc3MAKFhcXB2GA2NjYuLg4CwuLq1evYjAYoIx+dDh2/vh17kzU1dX37Nmjr6+voKCwefPmsLAw4IQCowHFVVwuV1dXd/ny5Q4ODtXV1SYmJpWVlQwGY/HixaWlpfn5+YCDwf3CLf+mTZuam5uNjY17enqkpKQmJiaam5uxWCybzfb396fRaF5eXl+/fm1sbBQTEwPlrRgMBhhWt2/ftrW1/fDhA4lEio+PV1FRoVKpPB7vyJEjGhoaGAzmt99+c3NzW758OYVCyc/P9/Dw8PT0zMnJ+eOPP6ytrTU1Nfv6+hgMBvA9SUhInD59+tGjR7///nt8fPyDBw+kpaWBUIHm0es0T/qVy+V++fJFUlKSx+Ox2Ww5Obne3t7u7m4jIyPhnWBFwzDMYrFgGH737p2Ojk5rayvIQJiammpoaNDQ0ACWJwDh+wkEwujoaG1traSkJBqNVlFR6enpAfwK9Kirq6uLi4umpmZiYqKIiAgajZaTk6utrdXS0iKRSKdOnZqZmXn06JGEhISEhISOjs7jx49BbtS6deu+fv2akpKio6NjY2MTFRU1MTEBCqtra2t9fX3BGrK1tRUTEwMLrr29PT4+3tnZWUlJ6eLFi8DFpqqqOg+BnXnVr4CuDQ0NYmJi7969c3R07O/vFxcXHx0dhf9eVyP4VlqDQqFQKBSRSKytrV22bBmfz+/t7ZWUlGxtbS0oKAA+SFBIA5JP0Wi0qanpu3fvXF1dxcXFKysrqVQqjUY7fPhwa2vrvn37tLS0Hjx4oKqqSiAQGAwGkUgsKysLCwsjkUjDw8PPnj3z9vaOjo728fHJy8srKyu7efMmGo3ev39/e3u7oqKis7PzlStXxsbGjIyMCgoKkpKSPDw8UlNTo6Ki7O3tJSUlJyYm4G+xDZA1TiaTIyMjy8vLAwMDu7q6KisrwQ0/GuEA5sk/jEAgGhsb8/PzW1paDAwM2Gx2SUmJvLz8XM8DuJnP52Ox2LGxMQcHh4aGBnV1dZAFODY2NjIyYmFhUVBQUF1d3dnZ2dTUVF5eXlpa2tHRAcOwoaFhaGgoGo1evnw5h8ORk5OztrZubW198+bN+Pj4o0ePbG1tExIS+vv75eXli4qK1q5dKysrKyMjU1RU1N/fPzIyQqFQVqxYERkZCSq9yGTy48ePc3Nz0Wi0hISEvLx8aGgon89HoVBjY2N0On3dunX5+floNJrD4QibVEAQhMViJSUlBQJBfX29p6cnHo+vqakR5rPND8yHKwQwZUxMTFRUFJ/P53A4nz59am1tTUpKElrL0N/DeTU1NWQyOScnR1xcHIlEGhsbh4eHi4qK7tu3r6GhISIiQlRUdHZ2dmJigsPhjI6Orlmz5ujRoydPnjx69Gh9ff3Vq1dnZmZev36NxWJ9fHy2bNlSW1urq6ubm5trZgkaXlMAACAASURBVGYGWFBKSmpgYODLly/W1tYwDDc0NNjb24Pqyl9++SUvLy8rK8ve3p7FYjGZzMbGRg0NjadPn+7YsaO5uVlMTKypqUlFReXz589MJhOLxQJTHKStW1lZ3b59+9dff21razt79uzAwICsrOyiRYvmM4fth9NV6G8C/oSxsTEGgzE1NZWZmQlSsaFvDA1qJdBoNAzDsrKy7e3t7u7uERERwL+zYcOGyMjI0tLSzZs3Ozs7MxgMYA9LSEh0dXWdOXMGh8Pt2rVLQ0Ojqqrq0aNHWCwWtI8wNDTMzs5esmRJdnY2MLBFRETExcWPHTsWGho6PDwsJSXV09MDSiHAdsXAwOD48eOenp7v379ft27dxYsX2Wz24sWLxcXFsVgsAoGYmZmBIAj4y2praycmJggEgnBdqqmpHTp0KDEx8eDBg4qKioqKiiAKO5/54vPhRwQX302JTqfz+XxxcXFwA5fL3b9/v7a29tGjR0E95MmTJyUkJDZt2vTkyZOxsbF79+4lJyc/ffq0vb2dSCQC9xAEQTAMBwcHW1hYnD59Oi4uLjg4eHBwkM/nq6ioTE9PYzCYhoYGFRWV3t7e1atXp6SkBAcHv3z50tjY2MDAIDY2FlTpaGhouLm5bd26VUhdFAr19OnT06dPf/jw4d69eykpKcePH+/s7ATpFgoKCgQCQUxMrKqqytnZ+ePHj48ePRIXFxfGnYBPuKKigk6nL126dK7Z/4PwDM2zH1GoPrlcLpvNhmG4oKAgPj7+zz//NDAwUFRUBHQFTsHe3t4tW7aADYOurm5UVFRRUdGpU6eGhobi4+ODgoIcHBwIBAIajVZXV3d0dARW0suXL319fWtra0EG2suXL318fHJycgAbkUgkIpGorKw8PT2tpaWVlJQEmL67uxuFQjU0NPD5fGAhNzY2SkhIACnC5XItLS0HBwe1tLSsrKwiIyPNzc2NjY2Tk5MpFEpXVxcejwchQrArXb9+PXBx5+XlvX371tbWNj8//9atW3l5eU5OTiMjIwQCQVh7+YNQDc3z/lUoivF4PAKBiIiICA4OzsnJEQ4CLLG3b9+uWrVqeHg4Nja2oqJCWVn5yZMnJBJp69atlpaWNBotJSVFQUFh79694eHhO3furK+vr66uZjKZmzdv7uzszMjI+Pz587t37yAI6unpWbZsWWlp6Zs3b0RFRcfGxkRFRXNycry9vScnJ3fs2FFWVvb161dTU9P+/n5VVdXx8fHFixejUKigoKDCwkIkEonBYLhc7qVLl8zNzQ0NDaWkpIC8yc7OVldXn5iYaG1txeFwoPsXiUQCekQgEExOTn7+/BmCoIKCAgaD0dvbm5qaumfPnvz8fPhbmsA8wDzZwzAMczicmpqahIQE4JkDqaBjY2NCLwyTyeRwOP7+/gkJCfX19RAE4fH4q1evLl269Pnz5zY2NpWVlRAE8Xi84uLia9euFRcXf/78GYVCHTp06Pr166qqqvHx8UCoKikpqaqqXrhwAYfDTU1NodHou3fvqqioNDQ0rFixQkxMrLKykkwmv3jxgkQiIZFIFovFYrFKS0utrKwuXryYlJQ0PDwMmoyAf7ds2SIlJSUvLw/D8MzMzKJFi758+QJBEAaDmZycFLq4YRhWVFSk0+kZGRl9fX3j4+NsNntycrK5ubm9vV2YDDQPME/7VxiGaTTa0qVLN2zYgMfjKRRKQUGBh4cHjUaDvnVUu3v3blZWloODg7W1NYfDAcWNXC43MDDQyMjIzMystLS0rq6uo6PjwoUL7e3tTCbT2NhYRERk9+7dZmZmGRkZNBpNQ0Nj3759ZWVlN27cmJmZCQ4OXrNmTUdHx9OnTwMCAkJDQ6emptLT01VUVECWk6ysLIPB6Ozs/Pr1q4qKSkFBgZqaWlpa2uXLlz99+gTsWx6Pd+HChV27dllaWrq4uBQWFu7fv19WVlZCQkJUVLSqqgrYemC+GAxmfHycSqXS6XRpaWngilFWVpaSkvrR+nUuzJM9LBAI5OXl161bl5OT4+bmVllZCbYuOjo6IEgnEAi8vb3V1NSysrLk5OSKi4tlZGQ8PT0hCMLhcLKysqqqqra2tsC3RyaT29vb+Xw+lUotKSmBYfj69et//fVXZmbmwYMHHz58yGKxPD09k5KSxsbGPD09eTxeeHg4DMPKyspdXV2qqqr19fWLFi1yd3evq6trbW21trZGIpGDg4MiIiLT09OAGPfv3y8pKQkKCkKhUCAVGY/HW1tbFxYWKisrGxkZSUlJkcnknp4e+Fv2pEAgGB8fHxwcFBcXR6FQCgoKGAxmdHRURERETExsPlOc5sk/zOPxWlpaZGRkTE1NORxOS0uLnp5ea2sr0Elge6ChoSEuLv7+/fsrV66cOnUKj8czmcy0tDQZGRksFlteXh4SEhISEqKrqwvk27p16+Tk5CYnJw0NDc+fP3/v3r3q6mpDQ8OBgQEQE/X19fX09BR861krKSk5MDAANj8cDkdGRubOnTu5ublkMvn06dPd3d3Dw8NkMhmICj6fLy0t3dTUdPfuXR6Ph8PhIAji8/lKSkqioqI8Ho9IJEpJSamrqwNXM/RNMlEoFGlp6RcvXvT19XV1ddna2nZ0dIiJienr68Nzsnl+NMyTHEYikampqTdu3AA5uiCLurm5GTgChaS1sLBwdHT09/dPTEzkcDglJSW+vr75+fnq6uqhoaFPnz4FrbBYLJaVlRXIKwsMDJydnW1padm6dSso9QFasKenZ3h4GPAZBEE2Njb19fWGhoY6Ojrt7e2rV69ua2uTlZVtaGjQ19cH2xsMBjM7O6unpycqKjo1NTU6OionJ9fQ0HDu3Lm3b9+CQK+cnBzwYONwOCkpKV1dXZCdA2YKQlIhISE8Ho9Op09PT1Op1IqKinXr1qmpqYEalh+N8P9A+4/evwrDcCMjI3fv3n38+HFsbCzY5ISGhiYmJkpJSS1duhSoWAQCMTo6GhUVhcPhKioqsrOzJSQkQPhaSkoqNDQUZInu3btXWVkZiUTq6uqSSKTp6Wlgdr179y4zM1NdXV1BQQGPxz9+/NjS0tLd3f3MmTNAnN67d09FRcXX1/fSpUstLS2xsbGg921cXJympiaLxert7SWTyaAkvri42M7OrrW11dLScmxsrKqq6saNGzIyMtHR0X5+fteuXfPz8+NyuVZWVg8ePADXEATV1taKi4uTyWRXV1dQLHvt2rXFixfPNf5/EKrn7l9/uH4V6h4ikXj+/HkcDhcREdHX17d169aqqqoHDx5s2bJF6D7k8XgyMjKHDh36/fffAd4tLS0zMzNfvHjx+PFjUKAhKSlJJBKF3gw2m00gECAIEhMTCwwM3LZtGwzDbm5uHA4Hj8eDUA/Ipdq6dWtra2taWpqJicnOnTtpNNqdO3coFMrs7CyojwNRdBqNhsViR0dHjYyMQPeX7OxsExOTtWvXnj59Oigo6NixYwKBQEpKSk1NraKiAolEysnJAa4dGRnx9PQ0NTU9duwYDofz9vZ2cnJSVFQEuT7z6R+ep/xhBAIxNTVVWlqqq6vb1tZWUVGxZ8+ejRs3glo5VVVVIV25XG5mZuaRI0dANn1kZGRAQMD09PS1a9cKCwvl5eWNjIx4PN7ExMTDhw/j4uJqamrGx8dJJBKgDRKJRCKRysrKlpaWJ0+e9PT0VFRUdHNzMzExwWKxFhYWPB6vo6MjLi5OS0sLbDza2tpIJNLExAQonUaj0VNTU4aGhr29vXJycm1tbSYmJl+/fmUymXZ2dn/99ReTydTV1dXS0pKRkcnLy6utrT148KCUlBRwM4GuFx8/fiSRSJs3b75y5cqjR4/c3d3xePy/VZxOOJmpqak//vjj1KlT6urqenp6U1NTsrKyw8PDQBFAEIRAIDgczs2bN3fs2OHm5mZlZTU8PNzd3d3c3Jyfn19XV5ecnKyoqAhKdEASRXNz8/T09G+//VZfXy8s1YJh2NnZec2aNeLi4qCdIYVCAVtMDAbD5/NzcnK0tbXr6uqYTCYo5qmoqODz+VpaWjweT0JCYnp6OiMjQ1dXl8lkSkpKghKx9vb2np6ekJCQ/fv3g/A72IYtXrwYpBsCw/7w4cOpqalr1qyxsrJ69OhRfn4+cHnC81u7Pn954QQCwdjY+OvXr8XFxWg0Goi7+/fvm5qaznWIMxiMkZGR8vJyR0fHtLQ0eXl5a2treXl5kN+7Y8eOo0ePfv78GYvFDg0N0Wg0CoWyb98+ExMT8Ibp6emenh5gskIQBErfhe9HoVBKSkqlpaUMBgP0xRscHHR1dTU3Nw8MDFRVVS0vLweeCgUFBTQaPTs7Ky8vb2VlVVFRQSKR2traqFSqj4+Pvb29jIwMAoEAVVnS0tKAWUE6LRqNxmAwfX19Xl5egYGBa9euVVNTE8xLyv8/tPg8+P2FS5XH442NjU1NTdHp9MTERD8/Pw0NDWFirdB04nA4Hh4eVlZWS5YsaWpq2rZt2+zsLIvFAhm5ycnJwC1cXFy8Zs2aR48excTEAI4BxNuxY4e8vPwff/whEAg6OjqUlZVBV0UwHhQKNTIycuLECT8/v+fPnz99+jQxMXHx4sWfPn365ZdfSktLo6Kipqenx8fHFRUVxcXFa2pquFzutm3brK2tBwYG5OXlQQdxDoezf/9+ERGR8PBwYCoPDg4mJCTIysoaGhqePXtWRUXl2rVrYGGBMtkfza/zbTcJSQv2CXJycn19fWBrcfbsWScnpyVLlvB4PNCBALTkMDIyunLlysOHD48cOTI2Nnbo0KGtW7fu2bPHxMRk//79u3fv/vjxY3t7u5mZGWh/KC8vX1hYGBcXJyYmFh0dDbrxAJM7JCTE09MTrBgmk3nt2jUcDkcmk4ODg9XV1cPDw7u6ut69eycQCNrb29evX793715RUdGJiYmsrCxNTc3du3cjEAhZWVlRUVFNTU0Igh4/fqytrT0zM/Pw4cP9+/eDLTgCgQCh+EuXLh0+fHh0dNTQ0BCsJ6Cz59MpAc2nHAbXIEwdEBDw8uXLgoKC+vp6OTm548eP02g0BwcHIM1YLNbAwAAKhXr16tXz588ZDIa9vf3ixYvz8/NzcnIOHTrEYDCAeZWQkODl5cVms1+/fq2srAz+dPz48c2bNwMyd3d3i4uL29jYvHnzJiAgoKur6+LFixwOx97eHo1Gi4uL5+fng4LJjRs3lpSUHD16tKSkJDAwUE1NzcrKSl9fX0JCorS0VFFREYfDsVisiYmJe/fu1dTUQBAUFBQUFBQkEAjQaPSnT59SUlIkJCTIZDKXy6VSqfb29r29vYWFhVZWVkIMz5scnqc8U3hOBdXRo0dfvnypr69/7949UVHRZ8+e1dTUSEhIuLm5Ca0b0NpQT08P1MY0NTV1d3fHx8c7OTlt3rwZBHZ27NhhaGhob28vIiKioqLy/PlzCIKys7MXLVokLy+vrKw8NDR069atiYmJd+/e3b17t6OjQ1NTU1NT09HR8dq1a3g8fnBwcM2aNWNjY1paWomJiWw2GzgFVVRUtLS0qqury8vLz58/f+bMmbq6OgMDg7a2tu3btzs4OMjJybHZ7J07dwpt+K1bty5durS5uXn58uWzs7M9PT09PT2glEhTU1Pw7Yy1H4TkudgGX5nXkiDAjr/88kt9fX1NTU1OTg4Wix0fHycQCEZGRtLS0tA3PwbQtSoqKsnJyUCfQRCUm5tbVFTU0tLi6+s7NDT0/PnzTZs2cbncu3fvbt++fcuWLSwWS1ZW9sqVKwkJCTExMY6OjrOzsyDSPj09bW9vv2bNmuLi4pCQkMHBwcHBwZCQkFWrVu3cuXNwcPDq1atv3rxxc3M7evTorl27RkZGzM3NPT09nZ2dnzx5AqpdJSUlb9++vXnz5kePHiUnJ4+MjIDDAHJyclRVVWdnZ42MjBITE0E9FgqFsrOzs7Ozmyux/n3s4bkAonVaWlpUKjU3NxfULYGMeBMTk4mJCXCAkdA2lpOTk5GRmZ6e5vP5hYWFUVFR/f39ycnJExMTIO1UWVmZx+PNzMzQaLTOzk4dHR1jY2NQvWNgYCApKQlcV2g0mslk+vj4TE5OHjhwwMjIqKmpKSgoqKqqSllZOTw8PDk5+fLlyytXrsTj8WQy+dWrV1wu19jYmEqlhoeHu7q6WllZlZeXx8bGgqXp5+fn5eWFwWCAtwHkRfT19QkEgoGBAQ6Hg0Qi8Xg8kUgUVubMD5IXgF/hb+XJPB4vMzMTpAhJS0vr6+s/efLk3r17oOOzEFkQBIGKK5ASJi0tfeLECWtr69LS0tu3b9NoNND2e2ZmhkAgeHh4dHR0/PrrrxgMRl5eXlJSMjw8XEVFRVpamsPhZGZmZmZm+vn5TU1NlZWVrV+/Hpx+1traqqGhMTw8rKurKycnp6iouH37dg8PD0dHR0tLy7i4OAMDg/7+/u7ubuCdqKyslJaWDg8PJ5PJwoJdJBIpJiYWExOzZ8+empqa9evXJyQkuLi4vH//fsWKFcB1LJj3k1jnj1+F+S4CgQCIRFtb25KSkvr6+r1791ZWVhoYGOBwuOfPn7u7uwtNdgQC8fTp07dv35qYmKxYsUJOTs7MzExTUxOBQGzYsMHd3d3S0lJERMTf37+7u/vcuXMlJSW9vb0QBImJibm4uLi4uGhoaCgrK4+NjeXl5YH8FWdnZ3d399DQUAUFhdTU1NevX0tKSpqZmf36669lZWW7d+9ub2//+PHjihUrtm/fLiMjU1lZaWRk5Ozs3NnZOTIysmrVKjAjBALR19eXnp6ur69fV1cH8t/A+S6xsbGLFy/eu3fv3DZj88mv89pXGnxIeOZRQkIC2N69ePFi3bp1J0+e3LNnj66uLp1O53K54ASU9vb20NDQ3bt3q6mpXbt2jU6ng30FeMnExMT69estLCx++eWXnp4eGxsbCIIkJSVJJBLw+G/evNnLy0tPT09ZWfn33383MDCYmZnhcrnt7e1r1qwBZ8RGRERUV1dv27ZNREQkISEhNzc3KCjow4cPL1++dHJyun//vpeXV01NzevXr7W0tNBo9IsXL/h8PuhxfvHiRQiCXr9+TaVS7ezsdHV1g4ODxcTEzMzMWlpawDjnrY/4gp2LJNzLgtCHvb39iRMnYmNjr1y5Ul9fv2TJkszMTDqd3t3draenB9JImUzms2fPpKWlVVVVv3z5gsPh1NTULC0twdEYbW1toPbm5cuXWCzW29tbRkbmwoULk5OToO3PkiVL6HR6Y2Pj27dvWSwWBoPB4/HT09OKiorv37/v6elpaWnhcrl79+5tb2+/detWeno6g8FYv379okWLOjo69u/fD/ZCnp6eg4ODhw4dCgkJAQoFhBetrKwkJSULCgrWrVs3MzNz8ODBmZmZ0NDQgIAAERERYSeUed68QvPcf3iu7wmwLMgtevjw4bNnzwwNDSUkJGRkZMBJZcIhVVdX//bbb+3t7f7+/hoaGvfv3zc2Nra1tQVl7Xfv3k1PT1+7du2lS5dAgSWIj4aGhpqamq5du3ZwcLCgoGDTpk0HDhyYmZkJDAz8+PHjzp07U1JSYmNjh4eHCQQCj8czNzcPCgrKysrKzs5OSUlRUlKysrIikUigJGRsbCwgIODq1avAPkChUOPj46ClVGNjY2RkpKioaFdX16VLlzAYjIyMDGAaYVuF+UQvvIDn5wgzFEdGRpKTk5uamggEwszMDDg08suXL7a2tqOjoyQSSUdHR+j4RSAQ+fn5WVlZQ0NDK1euZDAYQ0NDdXV1urq6ZmZmxcXFAO/R0dEg/EehUIqKikBmob6+fkxMzJIlS0gkEofDoVKp0dHRFhYWbDZ7165dK1asAO1FREVF+Xz+9evXtbW1cThcdna2hoaGg4PD0NCQiIiIhYUFh8PB4XD5+fltbW2+vr4YDKaxsbG7u7u3t7e1tfXjx49Lliy5ffs26FoPJjtvHv95zR/+V58HdGUwGGFhYeD8bElJSQiCaDRaenp6fHz8mzdvyGSylZUVUFE4HA6GYR0dHUtLy+vXrxMIhJMnT4Ii8KVLl1pbW6emplZVVamqqh48eFBFRSUrK2t2djY7O7u/vz8vL09JSamvr8/KyiowMFBLS+vXX3/dv39/ZWVlWVnZly9fPDw81NTUhOksxsbGWCw2Kiqqu7u7o6PDzs7O2toaNK0BXVAfPnyop6dnYmKSnZ3922+/qaurb9++HYbhlpYWFAq1bt06IIGFvoj5S5NYEL+E8NvQt22PrKzs48ePMzMzQfo8BEGJiYkjIyP9/f2g4mN8fJzL5RKJROBlff78OY1G8/PzGx0dhSAInLQAXnvx4sVff/1VVlZWSUlJWVn5/PnzKioq586dEwgEJBLJ2Ni4r6/v2bNnY2NjdXV1VCpVSUnpxo0bb9++BWXnX7586enpaW9v7+7uBi3z4uPjzc3Ny8vLEQgEl8tlMpliYmJZWVmgke3MzExERERMTIyuru7w8PDU1BSo2Z2amhL8vfnwgsCCnXclZFkQv9PT09PQ0KDRaNeuXRscHDx//jzYVqampt6/f3/t2rV4PD4tLS0sLKy5udnAwIBOpxcWFo6OjvL5fBEREdCGwt3dXV9fv7S09OvXrydOnACh7LS0NGtr65SUFEtLy9LS0urq6oaGBisrq927d+vq6p4+fVpbWxsUAomJiS1atAiNRjc0NCxevJjH45WWlp49e3bFihV8Ph+LxRYWFt66dYtOp2MwGCaTmZSUtGnTpvLycltbWysrKwaDAbq6zU9I7l9hdcH4FYBQGvP5fMC7wBsFziS6f/++nZ1dXl5eZWXl5ORkcnLyli1b8Hi8rKwsGo1WVlamUChtbW0tLS15eXmgJ7WLiwvoLtDQ0GBnZwdBEI/HW7lyZWlpqYqKysDAQE9Pz71791pbW318fECBF5/Pt7GxycnJUVdXj46OjouLS0xMtLOzMzQ0tLKy8vT0BAduQRCERCKB22RychJEdRgMhoqKCgjRNzY27t+//9SpUyIiIsL29dACdR4GsGB0netdAzRGIpE0Gu3Zs2dsNhuCIJBplpWVBdqtIxAIJycndXX14eFhECERAoPBCA8Pf/XqVWxsLARBoMcoBEF8Ph+JRNrZ2X348GHjxo0hISFeXl5Pnz4F9g5AvYKCAtgrS0hIAEqDbk3V1dV37tyRlJSEYXh2dhaPx/f29j558sTGxqa/v19FRYVGo9XU1AQHB3/58iUjI2PlypXAPpgf//7/ERbyHG7B3xtCCgQCT0/P58+f79q1a8OGDRUVFdbW1rt27TI2Ns7Ozs7JyeFwOGVlZRISEmAPDkFQR0dHTEwMl8tFo9FLly7FYDAYDGbJkiVpaWngRwiCNDU1S0pKIAhSVVVNT09nsVhJSUkQBAHGysjIAKfL9fT0SEhI2NnZvXr1Sl5evrS0tLCwEIZhkGteWlra2NgInCFEIpFAIHR2dh44cKClpWVqasrKymrXrl3AtQRM/QXD6TdYyPMkhQYUPCdf3sjIiEKh6OrqPnnypLi4OD09HYFA/PXXX2NjY+vXr9+2bVtTU5OXlxePx0tMTLxz505VVVVTU5O0tDQ4dgXU3gwPDy9atEhUVBRUHL969YrJZLq7uz98+NDLy+vVq1f+/v58Pn90dLStra2yslJWVvbChQvJyclqamqbNm0qKipydXXdsmULDoe7fv36w4cPCQSCk5NTWVlZZ2cnyNTZunXrwMDAwMDA9PS0r68vyIiDv8H8I1OI0nmKv/73BwT+ZbFYjx8/3r1799jY2Pj4eE5ODgRBnp6e6enpSCSysbFxfHx8+/btCATi7du3EREROjo6SkpKXl5eMAxPTU2RSKS0tLTGxsasrKzVq1fLyckhkUgbG5t79+5RKBQZGRllZWUajdbU1LRs2bKAgICSkpLR0VEvLy9HR0cgJ0CjPTqdrqGhISMjo62t/f79+1WrVr19+7a5uVlGRmZ8fBzo2pqamjVr1vj4+Dg6OvK/nVu6sJgU0nXhzwkF8K2KR4BCoYaGhmJiYqhUqpGR0fnz5zs6OkCYTEFBwdvbm8/nX7p0CYvF0un0vLw8Fovl6uoKrBsIgvh8fmlpaXBwMJlMXrdunaGhIQzDGAwG5M3Y2dlVV1crKyuXlZVpaWl1dnYCD/Mvv/wCQRCPx/v48SNIo4FhWF1d/eTJk+Li4k+fPr19+7aoqOjZs2ezs7MbGxsFAoGcnNzy5ctXrVoFMteFp31DC8ckC+9v+k/HJLwGDibgh0tJSQFV4nV1dZ2dnR0dHevWrTt37hxgqaamJhMTExQKdfnyZRKJFBgYCJ5isVh//fXXX3/9Bc624/F4BAKBzWaDk0bBfGdmZm7durVp0yYQSvvw4cPFixdnZmaIRCI4ytnKysrFxcXc3DwxMTErKysiIsLAwAAUc2KxWJB9CH3T09A8+pX+FfyMdJ0LwvGADe7nz5+vX79eUFDg6upKIpFACrGdnV1VVdXRo0f9/f137ty5YsUKCQmJqqoq0DwGsG9PT09DQ4Ow4lhCQmJyclJMTAyHw8nIyIBaDwiCeDxeSUnJ1q1bxcXFQS6xjY2NqKhoR0cHg8GQlpY+duwYqLHftGnT3r17gfsX/ta0R4i6BUfjAvsR/9WYwMVcNAFHT0pKSm1tLQqFCggIWLlyZUZGxvXr12VkZOh0ektLCzjRt6+vb2hoKDc3t7y8PCIiArDsx48fk5KSpqamOjs7y8rKNmzYACq3kpOTm5ubORyOmppaZWXl8ePH//zzz/7+fjExsampKV1dXZBQMTMzIyIi4uTk5OLi4uDggMFg0tPTLS0t5eXlhRVUc2M1C86v0E+oX/8ZBHMajoyNjbW3t8MwvHnz5ra2NgiC9u3bp6CgQKVST548+enTp5iYGFlZ2e7u7oKCAiMjo56eHiqVqqamZmtrKyMj8/Xr14GBgbS0ND8/P0dHx5GRETqd3t7e5uWd8AAAD/xJREFUrqKiAkHQ0NAQ6CXg5uYGTjqsqqr69OkTSLd48eKFsM8UoDSwA35OjP3UcngugNA06MD2+vXr9PR0JpOppqbW29sbExPj5+dHIBAwGMzKlSshCKqrqzMxMSkqKjp37tyePXtsbGyETR7q6+vz8vICAgKWLl3a0dGxaNEiFxeX2NjYjIwMIpGopqamr69Pp9OpVGpvby+fzxcVFSUQCGQyub+/39TU9Pjx4z+DZfRfw/8Mus4N1oJ8AJBdPT09zePx/P39379/r6amNjMzQ6fTg4ODnz9/jsfj3d3dKysrt2zZUlVV9e7dO3CEXFtbW19f361bt16+fOni4vL58+eIiAgGg/H27Vs2mx0REfHx40eBQAA6SID6LXl5+b6+vra2Nk9PT19f30WLFkHfIe5nxdjPTlchzDWjwLjHx8dBGbmuru7Vq1eBZ8ra2jo8PNze3v7mzZsIBOL48eMuLi7KysrPnz+Xlpa+ePHi06dPGxoaDA0N8Xi8hYVFQ0NDVlbWkydPiETis2fPzpw5o6SkNDk5iUajVVVVKRQKhUIxNjZ2cnISOiZ/ZixBf6frvOY3/V8AGJvwX5CEDexbgUAwPDwcHBy8adMmIGZDQkJYLJZAIGCxWBwOJywsDIFA+Pr6lpaWuri4iIiI3L9///Lly2pqapKSkt7e3rW1taBsRCAQgGT/7du3//77783NzeBD4Cvgi/yfG1H8v+c3/ex0/WcQjlZI3e8A0CM5ORmCINCQ1NDQUFNT8+HDh66urq9fv/7y5Ut4eDhoGAB2tEISCkH4ibmfW5D5/vdhwfLW/n+CMPglvADzgSBIGBoT3vblyxc/P7+wsLDQ0FA2m52XlyciIpKVlbVx40YtLa3s7Oz169cXFRWx2WxhTxD+t+ZK3+X6LnjQ7f8C/gfo138FQsPqux8hCAJViyBY++nTJ5B9DkEQn89PTk7u7e11dnYGh2wt7Cmt/29hXu2m77A/P8Yk8GkAiQTchMCTAM/ptANk74InrPw3YS4a/xUO59J1nvqGQHPM2h9E1O9mDgK0wGMFQRCgLp/PB0F70IZC6GH4ySWWcJD/ffb4G12/e17olPrul+/e/s+DgP6u8AAIMfvduvtPL/7V+4XDmzsS4cV3z8LfUqjmzk543K5wskK1+s9fh/7u4Jy7CP6LO/+LGf0XU/vnG6A5mIe+nX/w3Y/QHIaZC4i5fwYX/G9dVYTGFUi9B4ERwbdjWYUP8r8lnUAQJLwTcAkYAXiqqamJSqUKTU3h4OYumrkvB9bd3G/B31ztwkMm54587tvmThvcJvyrkGXBG4QD5n9rXwIugJ0sfGQurudKIMG3XdB36P5u5X2HLuH0/3k5Cr71LwLv/G54NTU1ZWVlQBoJB/yfcu0/6ArGwefzUSgU8JWDpY1EItFo9MDAwMTEBMgsAV49YR9ScA1unnsneBaCIDQazWazb9y4ITzGCPTDAQsQXAj5QPhyNBotvBl0EQAUBaflCL4d6Q1C2eBb4G3fvRA8LvwW6OUEMAim1tPTQ6PRQF0G+DroUwsENXhkLtnAhfBboOcpuHPukIQiQTgj8Ds4cQIMWDhmxDcA1+CdfD4f9C5pbW1FoVAcDuf58+cNDQ0CgQCNRn83qu/gH3IYLD0MBpOamgoKwqlU6o0bN1gsVnh4OIvFmp2ddXV1XbFiRUdHR0JCwubNmxUUFKanpyMiIrZt2/b69euAgIDY2NjOzs7Z2VlTU1MnJ6fW1tbly5cXFRXFxMSgUKgHDx4EBgYqKSlduXLFxcXF2NgYtPEBbbTAxGg0WkREBJjerl276HT6rVu3QCa+l5eXpKTkjRs3OBzO+Pj4nj17pqen8Xi8oaEhk8msqKigUCjp6ena2tqgUz8KhaLT6fn5+SCJtaWl5f79+xgMRklJaefOnWg0GmSlQxDE4XCWLVvm5ubW09Nz584dGIYlJSX37t1LIBBaWlqePn0KOooJlQgCgaiuro6MjJSVlaXT6YGBgZqamnfu3BkYGADF9h4eHvxvfcf7+/vv3r0Lsp98fHxSU1NJJJKXl1deXl5fX5+trW1sbCxoSKavr19dXT02NjYzM7Nz505wqiI42IdCoYCqy9WrV8MwHBUVBbqZgI6r/8y1f5PDSCRyYGCgoqLC3d1969at1tbWAoHg+vXrNTU13t7ey5cvP3DgADi/JCoqCrSY/fTp0507d0A5Rm5u7suXL1euXLllyxZVVdXW1taGhobR0dETJ05YWFgAF8Hx48dhGI6LiwNF/MPDwyUlJUDWgaU3MjISHx9vZGQEjghrbGxMS0tzcnIyNTWVkJA4f/780NCQj4/PsmXLxMXFv3792tXVJRAIQHNjMIyamhqwRmEY7u3tDQoKamlpgWG4vb09ISHBxsbmw4cPZ8+eRSAQwcHBvb29W7dutbe3v3fvXlNTE4PBiImJcXBwAC2OIQh68uTJn3/+CboNC2UADMMNDQ2pqanW1taTk5N//fXXzMxMSkoKDMPLly8HjQeELNvf35+Wlqavr79s2TIpKanHjx9fuHABgUBUVFRkZGR0d3ez2exly5ZZW1vT6fTq6mozMzMcDnfq1KmmpqZLly65u7v/f+1dW0wTWxee6QCFFijlai8ZaSvpRSgIqZa7gvIAWjQkPhCjRvGa8EJMTDAGEFETw4s+kOAlpkaNYuIDjdBgpIAYY2MCEQg1XIcKA+XSgu20hbb/w/qZM6fUc87rSc5+IGnp3nutfZm99pq1vu/MmTMSiQTeEw8NDW1ubj558qSurg7iOmgzKPS8wrE6MDAQHR2t0+mkUumpU6cIgujt7b19+3ZGRkZ5eXlubi4gGgJJKoqi7e3tSUlJkPSZlJQkkUhMJpNUKi0pKdnc3MRxvKOjQ6VSnT9/XqVS3bhxgyRJq9Wq0WiioqLevHkTExMDJOTMIhaLKysr09PT19fX2Ww2n89fW1sTCAQ+n6+vr+/y5ctpaWknTpwQi8WQFg61oqKiwsPD4+Li4Bs4Asxms1gsdrlcbrebw+GkpqbqdLrm5maIQCMI4tatWwqFoqKigsPhGAyG2NhYHMfLy8shZRZFUZvNVl9f/+LFC6YJGggEIiIi5HJ5aWlpW1sbj8cD+hZIyxGJRMwjNjw8HEYsOTk5NjZWKpWqVKovX74AoR6bzcYwbG1tLS4uTiqVpqamHj9+PC8vjyTJzs7Offv2HTt2LDU1learxHH83bt3JSUlWq3WZDLttCdC7NdAIADRYgDHSf+FXCW/369UKufm5kCOz58/j4+PAyMGgiBut1sgELS1tfn9/vT0dADmQBCEIAgcxwHuJiYmBuK+fD5fc3Pz+/fv+/r64LSjS0REBOSiT05ONjY2Yhi2vr4+NTVls9mWlpa4XC6fzx8eHj5w4MCzZ8/i4+PdbjdtRDAdyBiGkSRpMBgKCgoeP348MTHB5XJdLpfH4xEIBLGxsYDpBVxngUAgISEBnkAEQezZswdiku12u0QikcvlkBMNDz16L3o8HjDB+Hw+RVF+v58kyenpaYfDwdQIRVGXy0UQxNzcnNvt5nK5SqXy+fPnk5OTELFss9kmJiZgYAcHBzMyMpqaml6+fLmwsABrRa/XHz16dGNjA0XRyMjIsbGxpaWl4uLi9vZ29DfYt8F2k0AgSEhIwDAMeAYAH3l0dDQ8PBzS2bKysiiKUigUVqu1sbER4qHhhAcMpqampv7+fr1ePzs7GwgE0tPTgWsXLBSSJHEcpygKyOubm5vBFqNXnMfjEQqFer1eKBQuLy+z2Wwcx69cuaLVakUiESDrZWZm1tTU9PX1cblcDocDcrJYLCBB4fP5YJJMT0+PjIzk5uYSBPH9+3cAJWaz2aOjo6urqziOf/v2bW1tDUgBrVYr5O5JpdKbN2/CoJtMJgRBKIqSSCTAawj+KZha2EA+n29xcZHD4bBYrKqqKqB+RhjOyK2tLaFQWFtbW1payuFwgGtv//79ra2tfD5/a2vr8OHDdXV1Bw8edLlc+fn5er0e4P9wHB8eHg4LCzt9+rTVagXAebvdnpaWFhYWlpiYCDmcIa9Mf8wrxAHl5+dDvoPZbG5oaGCxWGVlZQ0NDf39/Y8ePfr165dOp7PZbGKxODIy8vXr1xqNhqIoiqIcDgdJknfu3Pnw4QMAZXG5XKvVWlFRYbVa79+///Hjx3v37hUVFcFTy+12q9XqQ4cOAesXXXw+3/z8vEwms9vtLS0tECkxMDDQ09Pj8XhOnjz58OHDoaEhs9kMtobBYPj69WtnZ6fRaATi0e7u7u7ubqPR+PTp0+rq6srKypqamo6OjtnZWYBEu3v3bklJya5duzQazfXr1wcHB2HrHzlyxGazLS4uVlVVpaSktLS0vHr1SqFQXLp06ezZs+3t7TDcMKler9disRiNxgsXLjidTpFIND8/PzAw0NvbOzw8zLzJ+P3+qamprq4uk8k0Pz+/urrq8Xh0Oh0EcgChcU9PDzAPA2nIxYsXz507BwhQDx48GBkZsdvtMDhdXV1er7e1tbWmpiY7O/vt27chn8N/im/y+XxAaPPp0yeSJP1+f1lZWV5e3sLCwujoqNPprK+vB0TtiIiIgoKCnJwcrVaLIEhWVhaGYTk5ORaLZXx8fHp6+urVq0qlEsMwpVKZmZlpMpmmpqbUavW1a9fCwsIoisrMzOTxeGq1msfjARcU2MOAx7F3716NRgNcnxiG2e32xcVFYAGcmZkBum5AIDCbzT9+/CAIQq1WwyIjSXJ5eZkkyd27d1dWVsbHxyclJXm9XnAREwRRWFgIHOmFhYUzMzNjY2MOh6O6ulqlUrlcLrB9FArFyMiISCTKy8tLTExMTk7e2NjQarWRkZGB7Vf9TqdzZWUlOjq6trY2MTHR4XC43e6FhQUUReVyOX1NQhDE4XBA2IZIJOLxeAqFQiaTyWQyoVCYnZ1tsVh+/vy5srLC5/PlcrlIJMrNzbVYLMXFxcDbtrS0VFRUlJ+fD4B1YrEYzKiUlJSEhASZTBZg+PLQkPFNtEPV6XRyuVz6/AcWdOQfkDZBNgtdkf691+sFOFG6b6YZgjAMDeQ3PhT64kinQ0EB/iNofKdsIZui81NBUwAXglN5p4709Z+JIRzUUcgqTI2Cyl8MI60mnRy9uroK4FbM6rQM9EU5wHCGoDTCPlRAURRAGlksltfrhRs3RHOBo4RuC9leBAGGX43+pW+bdBfdBtnCMAwaZGpF64D82d/ETEnbOWTg+YLewZGCIIjX6wUzJGiYUIZLj3ZggWcA5IQcLFpgullmC0HKIgyHAFQMeY8M0oiWn24Q2Xa4omiwFx26g9gueugCDAcTygh0DXKD+P3+EO9zQu6eoI8hFxpTMuZoMqswPwb9htn77wpTgSDZmA2GnNegeaK721kd3eH+DZI/SM6dw/K3GoUUded/g/T93TDSHf2,xX3cu8P/Kv7r8f17/en/8V/6l5X+fPNK/gA23LQAAAABJRU5ErkJggg==)'
                        image: $rootScope.loginUser.logoUrl
                        //text :' '
                        , alignment: 'right'
                        , margin: [2, -30, -17,2]
                    }
                    ]
                ]
            },
            layout: {
                hLineWidth: function (line) { return line === 1; },
                vLineWidth: function () { return 0; },
                paddingBottom: function () { return 0; }
            }
        }
    }

    //Read logo image
    function getBase64FromImageUrl(url) {
        var deferred = $q.defer();
        //Read logo image
        var img = new Image();
        img.src = url;
        var imgStr = ''

        img.onload = function () {
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            var dataURL = canvas.toDataURL("image/png");
            imgStr = canvas.toDataURL();
            deferred.resolve(imgStr);
            console.log(imgStr);
        };
        return deferred.promise;
    }

    // get table layout
    function getTableLayout()
    {
        return {
            style: 'tableExample',
            table: {
                headerRows: 1,
                body: [
                ]
            },
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? .7 : .3;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? .7 : .3;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? '#1ab394' : '#1ab394';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? '#1ab394' : '#1ab394';
                }
            }
        }
    }

    //Form PDF data from original object
    function getPdfGridData(obj, row, fillColor) {
        var pdfData = []
        var rows = [];
        var cnt = 0;
        angular.forEach(obj.coulmns, function (cols) {
            cnt++;
            var val = '';
            var tot = 0;
            //calculate column
            if (cols.dataType.indexOf('cal#') >= 0) {
                var operator = cols.dataType.substr(cols.dataType.indexOf('#') + 1);
                var ct = 0;
                angular.forEach(cols.field.split(','), function (col) {
                    if (ct == 0)
                    {
                        tot = row[col.trim()] != null ? row[col.trim()] : 0
                    }
                    else
                    {
                        switch (operator.split(',')[ct - 1]) {
                            case '+':
                                tot += row[col.trim()] != null ? row[col.trim()] : 0;
                                break;
                            case '-':
                                tot = tot == 0 ? row[col.trim()] : row[col.trim()] != null ? tot - row[col.trim()] : 0;
                                break;
                            case '*':
                                tot *= row[col.trim()] != null ? row[col.trim()] : 0;
                                break;
                            case '/':
                                tot /= row[col.trim()] != null ? row[col.trim()] : 0;
                                break;
                        }
                    }
                    ct++;
                });

                val = tot.toFixed(2);
            }
            else {
                angular.forEach(cols.field.split(','), function (col) {
                    val = row[col.trim()] != null ? val == '' ? row[col.trim()] : val + ' ' + row[col.trim()] : '';

                    switch (cols.dataType) {
                        case "date":
                            val = $filter('date')(val, "dd/MM/yyyy");
                            break;
                        case "bool":
                            val = val == true ? 'Yes' : 'No';
                            break;
                        case "number":
                            if (angular.isDefined(val) && val != '') {
                                val = '' + val + '';
                                break;
                            }
                        case "double":
                            if (angular.isDefined(val) && val != '') {
                                val = '' + val.toFixed(2) + '';
                                break;
                            } else if (val === 0) {
                                val = '0.00'
                            }
                        default:
                            val = val != null ? val : '';
                            break;
                    }
                });
            }
            rows.push(val != null ? { text: val, fillColor: fillColor } : { text: '', fillColor: fillColor });
        });

        return rows;
    }
};

function customfilter($timeout) {
    return {
        restrict: 'A',
        scope: {
            settings: '=',
            filtermodel : '=',
            getfilterobject: '&',
            clearfilter: '&', taxeligiblelist: '&',
            birthdayweek: '&', birthdaymonth: '&'
        },
        templateUrl: 'Partials/common/filter.html',
        link: function (scope, element) {

            
        },
        controller: function ($scope, $element) {

            $scope.openFromCal = function (index, item) {
                item.isFromOpen = true;
            },
            $scope.openToCal = function (index, item) {
                item.isToOpen = true;
            },
            $scope.openBirthCal = function(item) {
                $scope.settings.isOpen = true;
            }
        }
    };
};
/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return function(scope, element, attrs) {
        element.dropzone({
            url: "/upload",
            maxFilesize: 100,
            paramName: "uploadfile",
            maxThumbnailFilesize: 5,
            init: function() {
                scope.files.push({file: 'added'});
                this.on('success', function(file, json) {
                });
                this.on('addedfile', function(file) {
                    scope.$apply(function(){
                        alert(file);
                        scope.files.push({file: 'added'});
                    });
                });
                this.on('drop', function(file) {
                    alert('file');
                });
            }
        });
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}


/**
 * Enter key
 */

function dlEnterKey() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 13) {
                scope.$apply(function () {
                    // Evaluate the expression
                    scope.$eval(attrs.dlEnterKey);
                });

                event.preventDefault();
            }
        });
    };
};

/**
 * Escape key
 */

function dlEscapeKey() {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            var keyCode = event.which || event.keyCode;

            // If enter key is pressed
            if (keyCode === 27) {
                scope.$apply(function () {
                    // Evaluate the expression
                    scope.$eval(attrs.dlEscapeKey);
                });

                event.preventDefault();
            }
        });
    };
};

function customtable() {
    return {
        restrict: 'A',
        scope: {
            tabledata: '=',
            settings : '=',
            editTable: '&'
        },
        templateUrl: '../js/contacts/templates/table.html',
        link: function (scope, element) {
            var hotElement = element.find('#hot1');
            var hotSetting = scope.settings;
            hotSetting.data = scope.tabledata.table;
            var hot = new Handsontable(hotElement[0], hotSetting);
            hot.updateSettings({
                cells: function (row, col, prop) {
                    var cellProperties = {};
                    if (scope.settings.readonlyrow && scope.settings.readonlyrow.length) {
                        angular.forEach(scope.settings.readonlyrow, function (value, key) {
                            if (value === row) {
                                cellProperties.readOnly = true;
                            }
                        });
                    }
                    return cellProperties;
                }
            })
        },
        controller: function ($scope, $element) {
            $scope.editTable = function (item) {
                $scope.tabledata.isEditable = true;
            }

        }
    };
};

function customtable1() {
    return {
        restrict: 'A',
        scope: {
            tabledata: '=',
            dropdowndata: '=',
            adddata : '=',
            remove: '&',
            add: '&'
        },
        templateUrl: '../js/contacts/templates/dir.html',
        link: function (scope, element) {
            
        },
        controller: function ($scope, $element) {
            $scope.remove = function (index) {
                $scope.tabledata.splice(index, 1);
            }
            $scope.add = function (index) {
                $scope.tabledata.push($scope.adddata);
            }
        }
    };
};

/**
 *
 * Pass all functions into module
 */
angular
    .module('inspinia')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('customtable', customtable)
    .directive('customtable1', customtable1)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('customfilter', customfilter)
    .directive('sort', sort)
    .directive('ckEditor', ckEditor)
    .directive('highChart', highChart)
    .directive('restrictInput', restrictInput)
    .directive('dlEnterKey', dlEnterKey)
    .directive('dlEscapeKey', dlEscapeKey)

