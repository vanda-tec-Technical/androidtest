angular.module('carQrSeller.activate', [])
    .controller('activateCtrl', function ($scope, $http, $ionicPopup, $timeout, mainUrl, $state) {
        $scope.vateErr = {
            psw: '',
            okPsw: ''
        };
        $scope.activateAccount = function (w) {

            if (w == undefined) {
                $scope.vateErr.psw = '请输入激活密码';
                $scope.vateErr.okPsw = '请输入确认密码';
            } else {
                if (w.psw == '' || w.psw == undefined) {
                    $scope.vateErr.psw = '请输入激活密码';
                } else {
                    if (/^[a-zA-Z0-9_]{6,12}$/.test(w.psw)) {
                        $scope.vateErr.psw = '';
                    } else {
                        $scope.vateErr.psw = '密码由大小写字母，数字组成的6-12位字符'
                    }
                }
                if (w.okPsw == '' || w.okPsw == undefined) {
                    $scope.vateErr.okPsw = '请输入确认密码';
                } else {
                    if (w.okPsw == w.psw) {
                        $scope.vateErr.okPsw = '';
                    } else {
                        $scope.vateErr.okPsw = '两次输入密码不一致';
                    }
                }
            }
            var errInfo = '';
            for (var k in $scope.vateErr) {
                errInfo += $scope.vateErr[k];
            }
            if (!errInfo) {
                var meInfo = angular.fromJson(localStorage.getItem('meInfo'));
                $http({
                    withCredentials: true,
                    method: "post",
                    url: (mainUrl + '/v1/merchants/activeMerct'),
                    data: {password: w.psw, confirpsd: w.okPsw},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var s in obj) {
                            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                        }
                        return str.join("&");
                    }
                }).success(function (data) {
                    console.log(data);
                    var infoMe = angular.fromJson(localStorage.getItem("meInfo"));
                    infoMe.hasActivate = 1;
                    infoMe.mim = w.okPsw;
                    localStorage.setItem('headerMe', angular.toJson(meInfo));
                    $state.go('home');
                }).error(function (error) {
                    console.log(error);
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 3000);
                });
            }

            // localStorage.setItem('loginInfo', '{"name":"viwm","psw":"aaa","hasactivate":"true"}');
            // $state.go('home');
        }
    });