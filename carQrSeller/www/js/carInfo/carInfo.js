angular.module('carQrPark.carInfo', [])
    .controller('carInfoCtrl', function ($scope, $ionicModal, $ionicPopup, $timeout, $state, $stateParams, $http, mainUrl) {
        //车辆ID
        // var id = $stateParams.id;
        //车辆号牌
        // var num = $stateParams.num;
        //获取车辆信息和产品列表
        getCarProduct();
        function getCarProduct() {
            $http({
                method: "post",
                url: (mainUrl + ''),
                params: { twoCodeId: $stateParams.co}
                // 二维码是否绑定车辆都可以使用，车辆号牌和车辆ID可能为空
                // params: {carNumber: num, carId: id, twoCodeId: $stateParams.co}
            }).success(function (data) {
                console.log(data);
                if (data.header.flag === 1) {
                    //车辆信息
                    $scope.carInfo = data.content.car;
                    //产品信息
                    // data.content.list[2].priceMctApp = 0;
                    // data.content.list[2].pricewx = 0;
                    $scope.products = data.content.list;

                    //车主手机
                    $scope.userInfo = data.content.user;
                    //是否有记录
                    // $scope.hasRecord = data.content.hasRecord;
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
        }


        //议价表单
        $ionicModal.fromTemplateUrl('templates/carInfo/bargaining.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.bargainingModal = modal;
        });


        //选择服务
        $scope.service = '';
        $scope.serviceType = '';
        var item = '';  //议价的那条数据
        $scope.product = {price: ''};
        $scope.selectService = function (s) {
            console.log(s);
            //这里判断的是pricewx,显示的是priceMctApp
            if (s.pricewx == '0.00/次') {   //如果他的单价等于0，就去添加价格
                item = s;
                $scope.bargainingModal.show();
            } else {
                if ($scope.service == s.id) {
                    $scope.service = '';
                    $scope.serviceType = '';
                } else {
                    $scope.service = s.id;
                    $scope.serviceType = s.productType;
                    $scope.product.price=0;
                    // $state.go();
                }
            }
        };

        $scope.bargaining = function (p) {
            if (/^0\.\d{0,1}[1-9]$|^[1-9]\d{0,5}\.\d{0,1}[1-9]$|^[1-9]\d{0,5}$/.test(p.price)) {
                $scope.productErr = '';
                // $scope.product.price=p.price;
                item.priceMctApp = p.price + '元';   //该条数据的价格显示为填写的价格
                $scope.service = item.id;
                $scope.serviceType = item.productType;
                $scope.bargainingModal.hide();
                console.log($scope.product);
            } else {
                $scope.productErr = '请输入0到10万之间的金额！'
            }
        };


        /*$scope.startTiming = function () {
         $state.go('home');
         };*/

        $scope.startTiming = function () {
            // console.log(num);
            // console.log(id);

            if ($scope.service != '' && $scope.service != undefined) {
                //1:记次；2:计时
                if ($scope.serviceType == 1) {
                    $http({
                        method: "post",
                        url: (mainUrl + '/outside/mctmobile/order/createNumOrder.htm'),
                        params: {
                            // carNumber: num,
                            // carId: id,
                            prdctId: $scope.service,
                            price: $scope.product.price,
                            twoCodeId: $stateParams.co
                        }
                    }).success(function (data) {
                        console.log(data);
                        if (data.header.flag === 1) {
                            $state.go('home');
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
                    //    /outside/mctmobile/product/parkOpt.htm
                    $http({
                        method: "post",
                        url: (mainUrl + '/outside/mctmobile/product/parkOpt.htm'),
                        params: {
                            productId: $scope.service, rcdId: 0, twoCodeId: $stateParams.co
                            //
                            // carNumber: num, carId: id, productId: $scope.service, rcdId: 0, twoCodeId: $stateParams.co
                        }
                    }).success(function (data) {
                        console.log(data);
                        if (data.header.flag === 1) {
                            $state.go('home');
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
                }
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: '请选择服务！'
                });
                $timeout(function () {
                    alertPopup.close();
                }, 1500);
            }

        };

        $scope.getCar = function () {
            if ($scope.service == '' || $scope.service == undefined) {
                var alertPopup = $ionicPopup.alert({
                    template: "请选择服务"
                });
                $timeout(function () {
                    alertPopup.close();
                }, 1500);
            } else {
                $state.go('takeCar', {/*carnum: num, carid: id,*/ pi: $scope.service, ri: $scope.hasRecord});
            }
        }

    });