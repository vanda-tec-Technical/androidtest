angular.module('carQrPark.home', [])
    .controller('homeCtrl', function ($scope, $http, mainUrl, $ionicPopup, $timeout, $ionicModal, $state, $interval, $cordovaLocalNotification, $cordovaBarcodeScanner, $cordovaGeolocation) {

        var infoMe = angular.fromJson(localStorage.getItem('meInfo'));
        console.log(infoMe);
        //订单状态:0:全部，1:待支付；2:已支付
        $scope.orderStatus = 0;
        var currentPage = 0, pageSize = 10, ListsData = [];

        //订单类型
        $scope.orderTypeList = [
            {id: 0, name: '停车停单'},
            {id: 1, name: '其它订单'}
        ];
        $scope.orderType = 0;


        //订单类型变化
        $scope.selectedOrderType = function () {
            currentPage = 0;
            ListsData = [];
            $scope.orderStatus = 0;
            $scope.doRefresh();
        };

        //订单状态切换
        $scope.choiceTab = function (t) {
            if ($scope.orderStatus != t) {
                ListsData = [];
                currentPage = 0;
                $scope.orderStatus = t;
                $scope.doRefresh();
            }
        };

        //刷新
        $scope.doRefresh = function () {
            console.log('刷新')
            if ($scope.orderType == 0) {
                $http({
                    method: "GET",
                    url: (mainUrl + '/v1/parkOrders/findParkOrders'),
                    params: {
                        logUser: infoMe.id,     //登录商户
                        page: currentPage,
                        size: pageSize,
                        innerOrderId: '',        //订单流水号
                        carNumber: '',           //车牌号
                        orderStatusvalue: $scope.orderStatus,    //订单状态
                        startDate: '',           //起始时间
                        endDate: '',           //结束时间
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data!=null) {
                        currentPage++;
                        /*for (var i = 0, a = data.content.list.length; i < a; i++) {
                         ListsData.push(data.content.list[i]);
                         }*/
                        ListsData = data.content.list;
                        $scope.hasLoadMore = (data.content.list < pageSize || ListsData.length == data.content.totalCount);
                        $scope.listsData = ListsData;
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 1500);
                });
            } else {
                $http({
                    method: "GET",
                    url: (mainUrl + '/v1/orders/searh'),
                    params: {
                        orderStatusvalue: $scope.orderStatus,
                        page: currentPage,
                        size: pageSize
                    }
                }).success(function (data) {
                    console.log(data);
                    if (data!=null) {
                        currentPage++;
                        /*for (var i = 0, a = data.content.list.length; i < a; i++) {
                         ListsData.push(data.content.list[i]);
                         }*/
                        ListsData = data.content.list;
                        $scope.hasLoadMore = (data.content.list < pageSize || ListsData.length == data.content.totalCount);
                        $scope.listsData = ListsData;
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 1500);
                });
            }
        };

        //加载更多
        $scope.loadMore = function () {
            console.log('加载更多');
            if($scope.orderType==0) {
                $http({
                    // withCredentials: true,
                    method: "GET",
                    url: (mainUrl + '/v1/parkOrders/findParkOrders'),
                    params: {
                        logUser: infoMe.id,     //登录商户
                        page: currentPage,
                        size: pageSize,
                        innerOrderId: '',        //订单流水号
                        carNumber: '',           //车牌号
                        orderStatusvalue: $scope.orderStatus,    //订单状态
                        startDate: '',           //起始时间
                        endDate: '',           //结束时间
                        // orderStatus: $scope.orderStatus,
                        // "pagination.currentPage": currentPage,
                        // "pagination.pageSize": pageSize
                    },
                    // headers: {'Session':infoMe.session},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded','Session':infoMe.session},
                    /*transformRequest: function (obj) {
                     console.log(obj);
                     var str = [];
                     for (var s in obj) {
                     str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                     }
                     console.log(str.join("&"));
                     return str.join("&");
                     }*/
                }).success(function (data) {
                    console.log(data);
                    if (data != null) {
                        currentPage++;
                        for (var i = 0, a = data.content.list.length; i < a; i++) {
                            ListsData.push(data.content.list[i]);
                        }
                        $scope.hasLoadMore = (data.content.list < pageSize || ListsData.length == data.content.totalCount);
                        $scope.listsData = ListsData;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 1500);
                });
            }else{
                $http({
                    // withCredentials: true,
                    method: "GET",
                    url: (mainUrl + '/v1/orders/searh'),
                    params: {
                        logUser: infoMe.id,     //登录商户
                        page: currentPage,
                        size: pageSize,
                        innerOrderId: '',        //订单流水号
                        carNumber: '',           //车牌号
                        orderStatusvalue: $scope.orderStatus,    //订单状态
                        startDate: '',           //起始时间
                        endDate: '',           //结束时间
                        // orderStatus: $scope.orderStatus,
                        // "pagination.currentPage": currentPage,
                        // "pagination.pageSize": pageSize
                    },
                    // headers: {'Session':infoMe.session},
                    // headers: {'Content-Type': 'application/x-www-form-urlencoded','Session':infoMe.session},
                    /*transformRequest: function (obj) {
                     console.log(obj);
                     var str = [];
                     for (var s in obj) {
                     str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                     }
                     console.log(str.join("&"));
                     return str.join("&");
                     }*/
                }).success(function (data) {
                    console.log(data);
                    if (data != null) {
                        currentPage++;
                        for (var i = 0, a = data.content.list.length; i < a; i++) {
                            ListsData.push(data.content.list[i]);
                        }
                        $scope.hasLoadMore = (data.content.list < pageSize || ListsData.length == data.content.totalCount);
                        $scope.listsData = ListsData;
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 1500);
                });
            }
        };


        /*$http({
         method: "post",
         url: (mainUrl + '/outside/mctmobile/order/listOrder.htm'),
         params: {orderStatus:$scope.orderStatus}
         }).success(function (data) {
         console.log(data);
         if (data.header.flag === 1) {

         } else {
         var alertPopup = $ionicPopup.alert({
         template: data.header.errorDesc
         });
         $timeout(function () {
         alertPopup.close();
         }, 1500);
         }
         }).error(function (error) {
         var alertPopup = $ionicPopup.alert({
         template: angular.toJson(error)
         });
         $timeout(function () {
         alertPopup.close();
         }, 1500);
         });*/


        //扫描二维码，获取车辆信息/停车扫码
        $scope.scanningQR000 = function () {
            // $scope.choiceServiceModal.show();
            // $state.go('carInfo');
            $cordovaBarcodeScanner
                .scan()
                .then(function (barcodeData) {
                    // $scope.a = arguments;
                    // Success! Barcode data is here
                    $scope.barcodeData = barcodeData;
                    // 是否取消
                    if (!barcodeData.cancelled && barcodeData.format == 'QR_CODE') {
                        sendQrInfo(barcodeData);
                    }
                    /*else{

                     }*/
                }, function (error) {
                    // An error occurred
                    $scope.barcodeDataErr = error;
                });
        };
        // http://192.168.0.111:8080/wxsso/scan_code?twoCode=JbInq2
        // http://192.168.0.103:8081/wxsso/scan_code?twoCode=Nrm6fm
        // function sendQrInfo(QRInfo) {
        $scope.scanningQR = function () {
            if ($scope.distance != '' || $scope.distance != undefined) {
                $http({
                    method: "GET",
                    url: (mainUrl + '/v1/parkOrders/scanTwoCode'),
                    // params: {link: QRInfo.text, distance: $scope.distance}
                    params: {link: 'http://192.168.0.103:8081/wxsso/scan_code?twoCode=Nrm6fm'}
                    /*params: {
                     link: 'http://192.168.0.111:8080/wxsso/scan_code?twoCode=JbInq2',
                     distance: 600//$scope.distance
                     }*/
                }).success(function (data) {
                    console.log(data);
                    if (data != null) {
                        //判断是停车还是取车
                        if (!data.parkOrder) {
                            console.log('0000');
                            $state.go('carInfo', {co: data.twoCodeId});
                        } else {
                            console.log('1111');
                            $state.go('takeCar', {
                                ri: data.parkOrder,
                                // carnum: data.content.car.number,
                                // carid: data.content.car.id,
                                co: data.twoCode
                            });
                        }
                        /*if (data.content.distanceResult == 0) {
                         if (data.content.hasRecord == 0) {
                         $state.go('carInfo', {co: data.content.twoCode});
                         // 二维码不论是否绑定车辆都可以使用
                         // $state.go('carInfo', {id: data.content.car.id, num: data.content.car.number,co:data.content.twoCode});
                         } else {
                         $state.go('takeCar', {
                         ri: data.content.hasRecord,
                         // carnum: data.content.car.number,
                         // carid: data.content.car.id,
                         co: data.content.twoCode
                         });
                         }
                         } else {
                         var alertPopup = $ionicPopup.alert({
                         template: '请在您的有效服务范围内再扫码!'
                         });
                         $timeout(function () {
                         alertPopup.close();
                         }, 1500);
                         }*/
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            template: data.header.errorDesc
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 1500);
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 1500);
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: '获取位置失败',
                    template: '请确保手机开启定位功能或确保应用开启定位权限'
                });
                $timeout(function () {
                    alertPopup.close();
                }, 1500);
            }
        };


        //扫描二维码，获取车辆信息/取车扫码
        $scope.takeCarQr = function () {
            // $scope.choiceServiceModal.show();
            $state.go('takeCar');
        };

        // 通知
        $scope.cation = function () {
            $cordovaLocalNotification.schedule({
                id: 0,
                title: 'title',
                text: '雨林沐风',
                data: {
                    customProperty: 'dd'
                }
            }).then(function (result) {
                $scope.info = result;
            });
        };
        /*

         //距离判断
         var userInfo = angular.fromJson(localStorage.getItem('headerMe'));
         $scope.userInfos = userInfo;
         //商家坐标
         $scope.sellerPosint = userInfo.point.split(',');
         //['经度：longitude','纬度：latitude']

         //
         //

         // var num = 0;
         function getPosition() {
         var posOptions = {timeout: 10000, enableHighAccuracy: false};
         $cordovaGeolocation
         .getCurrentPosition(posOptions)
         .then(function (position) {
         // $timeout(function () {
         $scope.lat = position.coords.latitude;//30.541284;纬度
         $scope.long = position.coords.longitude;//104.054068;经度
         //用户当前坐标
         $scope.userPoint = new BMap.Point($scope.long, $scope.lat);

         var pointArr = [];
         pointArr.push($scope.userPoint);

         //坐标转换
         var convertor = new BMap.Convertor();
         convertor.translate(pointArr, 1, 5, function (data) {
         console.log(data);
         if (data.status === 0) {
         $timeout(function () {
         var p = data.points[0];
         //转换后的坐标
         // $scope.locationInfoL = [p.lng, p.lat];
         $scope.currentPoint = new BMap.Point(p.lng, p.lat);
         //商家坐标
         $scope.sellerPoint = new BMap.Point($scope.sellerPosint[0], $scope.sellerPosint[1]);
         //计算两个坐标之间的距离
         $scope.distance = (new BMap.Map()).getDistance($scope.currentPoint, $scope.sellerPoint);
         });
         }
         });


         // });
         }, function (err) {
         // if(num==0) {
         var alertPopup = $ionicPopup.alert({
         template: '获取定位信息失败！请确保你的手机开启了定位功能！'
         });
         $timeout(function () {
         alertPopup.close();
         }, 1500);
         // }
         });

         /!*!// $scope.long = 104.05372;
         // $scope.lat = 30.541255;
         //用户当前坐标
         $scope.userPoint = new BMap.Point(104.063235, 30.545581);
         //商家坐标
         $scope.sellerPoint = new BMap.Point(104.063208,30.543921);
         //计算两个坐标之间的距离
         $scope.distance = (new BMap.Map()).getDistance($scope.userPoint,$scope.sellerPoint);*!/


         }

         // var getLoca = null;
         // if ($scope.lat == '' || $scope.lat == undefined) {
         getPosition();
         // } else {
         var getLoca = $interval(getPosition, 30000);
         // }
         $scope.$on("$destroy", function (event, data) {
         if (getLoca != null) {
         $interval.cancel(getLoca);
         }
         });*/

    });