angular.module('carQRSeller.accountInfo', [])
    .controller('accountInfoCtrl', function ($scope, mainUrl, $http,$ionicPopup,$timeout) {
    ///outside/mctmobile/merchant/accountInfo.htm
        $http({
            method: "GET",
            url: (mainUrl + '/v1/receiptAccount/accountInfo')
        }).success(function (data) {
            console.log(data);
            if(data!=null){
                $scope.accountData = data.accountInfo;
            }
            /*if (data.header.flag === 1) {
                $scope.accountData = data.content.accountInfo;
            } else {
                var alertPopup = $ionicPopup.alert({
                    template: data.header.errorDesc
                });
                $timeout(function () {
                    alertPopup.close();
                }, 1500);
            }*/
        }).error(function (error) {
            var alertPopup = $ionicPopup.alert({
                template: angular.toJson(error)
            });
            $timeout(function () {
                alertPopup.close();
            }, 1500);
        });
    });