angular.module('carQrSeller.login', [])
    .controller('loginCtrl', function ($scope, $http, $ionicPopup, $timeout, mainUrl, $state, setHeadersInfo) {

        //登录信息
        var headerMe = angular.fromJson(localStorage.getItem('headerMe'));

        $scope.uie = {
            name: '',   //4-20
            psw: ''     //6-12
        };

        //登录
        $scope.login = function (u) {
            console.log(u);
            if (u != undefined) {
                if (u.name != '' && u.name != undefined) {
                    if (u.name.length >= 4 && u.name.length <= 20) {
                        $scope.uie.name = '';
                    } else {
                        $scope.uie.name = '用户名为4-20位字符';
                    }
                } else {
                    $scope.uie.name = '请输入用户名';
                }
                if (u.psw != '' && u.psw != undefined) {
                    if (/^[a-zA-Z0-9_]{6,12}$/.test(u.psw)) {
                        $scope.uie.psw = '';
                    } else {
                        $scope.uie.psw = '密码由大小写字母组成的6-12位字符';
                    }
                } else {
                    $scope.uie.psw = '请输入密码';
                }
            } else {
                $scope.uie.name = '请输入用户名';
                $scope.uie.psw = '请输入密码';
            }

            var hasUie = '';
            for (var k in $scope.uie) {
                hasUie += $scope.uie[k];
            }
            if (!hasUie) {
                //判断是否登录
                $http({
                    withCredentials: true,
                    method: "post",
                    url: (mainUrl + '/login'),
                    data: {username: u.name, password: u.psw},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        var str = [];
                        for (var s in obj) {
                            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                        }
                        return str.join("&");
                    }
                }).success(function (data, status, headers, config) {
                    // console.log(headers("content-type"));
                    var contentType = headers("content-type").split(';');
                    console.log(contentType);
                    var session = contentType[2].split('=')[1];
                    var persistence = contentType[1].split('=')[1];
                    console.log(session);
                    console.log(persistence);
                    setHeadersInfo(session, persistence);
                    if (data != null) {
                        var meInfo = {
                            name: data.account,
                            mim: u.psw,
                            userName: data.merchantName,
                            hasActivate: data.isActive,
                            mctUserId: data.id,
                            point: data.point,
                            session: session,
                            persistence: persistence
                        };
                        localStorage.setItem('meInfo', angular.toJson(meInfo));
                        if (data.isActive) {
                            $state.go('home');
                        } else {
                            $state.go('activate');
                        }
                    }
                }).error(function (error) {
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error.message)
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 3000);
                });
            }
        };

    });