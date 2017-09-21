angular.module('carQrSeller.versionUpdate', [])
    .controller('versionUpdateCtrl', function ($scope, mainUrl, $http, $state, $timeout, $ionicPopup, $stateParams, getPlatform, $cordovaInAppBrowser) {
        $scope.v = $stateParams.oldVersionNo;
        $scope.type = getPlatform();
        $http({
            method: "post",
            url: (mainUrl + '/outside/mctmobile/merchant/getEdition.htm'),
            params: {vision: $scope.v, tType: getPlatform()}
        }).success(function (data) {
            console.log(data);
            if (data.header.flag == 1) {
                $scope.versionInfor = data.content;
                $scope.newVersionNo = data.content.edition;
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

        $scope.nextUpdate = function () {
            $state.go('home');
        };

        $scope.gotoBrowserDownloadAndroidApp = function () {
            var options = {
                location: 'yes',
                clearcache: 'no',
                toolbar: 'yes'
            };
            $cordovaInAppBrowser.open(mainUrl+'/vandafile/apk/android-seller-' + $scope.newVersionNo + '.apk', '_system', options);
        };

        $scope.gotoAppStoreDownload = function () {
            window.open('itms-apps://itunes.apple.com/cn/app/car-paste-qr/id1218728953?mt=8');
        };


    });