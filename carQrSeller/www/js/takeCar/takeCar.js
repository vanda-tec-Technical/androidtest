angular.module('carQrPark.takeCar', [])
    .controller('takeCarCtrl', function ($scope, $state, $http, mainUrl, $ionicPopup, $timeout, $stateParams) {
        $http({
            method: "post",
            url: (mainUrl + '/outside/mctmobile/product/parkOpt.htm'),
            params: {
                // carNumber: $stateParams.carnum,
                // carId: $stateParams.carid,
                // productId: $stateParams.pi,
                rcdId: $stateParams.ri,
                twoCodeId:$stateParams.co
            }
        }).success(function (data) {
            console.log(data);
            if (data.header.flag === 1) {
                // $state.go('home');
                $scope.carInfo = data.content.car;
                $scope.usi=data.content.user;
                $scope.parkCarInfo = data.content.parkRecord;
                $scope.data = data.content;
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


        //收费
        $scope.harvest = function () {
            // $state.go('home');
            // /outside/mctmobile/parkRecord/chargePark.htm
            $http({
                method: "post",
                url: (mainUrl + '/outside/mctmobile/parkRecord/chargePark.htm'),
                params: {
                    pkfRcdId:$scope.parkCarInfo.id,
                    stopTime:$scope.parkCarInfo.stopTime
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
        };

        //作废
        $scope.cancel = function(){
            // /outside/mctmobile/parkRecord/cancelRecord.htm
            $http({
                method: "post",
                url: (mainUrl + '/outside/mctmobile/parkRecord/cancelRecord.htm'),
                params: {
                    pkfRcdId:$scope.parkCarInfo.id
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



    });