angular.module('carQrPark.userCenter', [])
    .controller('userCenterCtrl', function ($scope, $state, $http, mainUrl, $ionicPopup, $timeout, $ionicModal, setHeadersInfo) {
        //修改密码的modal
        $ionicModal.fromTemplateUrl('templates/login/revisePsw.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.revisePswModal = modal;
        });

        //获取商家信息
        $http({
            method: "GET",
            url: (mainUrl + '/v1/merchants/merctCenterInfo'),
        }).success(function (data) {
            console.log(data);
            if(data!=null){
                $scope.userInfo = data;
            }
            /*if (data.header.flag === 1) {
                $scope.userInfo = data.content.mct;
                $scope.hasRead = data.content.msgs;
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


        // 登录，退出
        $scope.signOut = function () {
            setHeadersInfo(0);
            localStorage.removeItem('headerMe');
            $state.go('login');
        };


        // 修改密码
        $scope.reviseErrInfo = {
            psw: '',
            npsw: '',
            okpsw: ''
        };
        $scope.revisePsw = function (s) {
            if (s == undefined) {
                $scope.reviseErrInfo.psw = '请输入原密码';
                $scope.reviseErrInfo.npsw = '请输入新密码';
                $scope.reviseErrInfo.okpsw = '请输入确认密码';
            } else {
                if (s.psw == '' || s.psw == undefined) {
                    $scope.reviseErrInfo.psw = '请输入原密码';
                } else {
                    $scope.reviseErrInfo.psw = '';
                }
                if (s.npsw == '' || s.npsw == undefined) {
                    $scope.reviseErrInfo.npsw = '请输入新密码';
                } else {
                    if (/^[a-zA-Z0-9_]{6,12}$/.test(s.npsw)) {
                        $scope.reviseErrInfo.npsw = '';
                    } else {
                        $scope.reviseErrInfo.npsw = '密码由大小写字母或数字组成的6-12位字符';
                    }
                }
                if (s.okpsw == '' || s.okpsw == undefined) {
                    $scope.reviseErrInfo.okpsw = '请输入确认密码';
                } else {
                    if (s.npsw == s.okpsw) {
                        $scope.reviseErrInfo.okpsw = '';
                    } else {
                        $scope.reviseErrInfo.okpsw = '新密码与确认密码不一致'
                    }
                }
            }
            var errInfo = '';
            for (var l in $scope.reviseErrInfo) {
                errInfo += $scope.reviseErrInfo[l];
            }
            if (!errInfo) {
                $http({
                    method: "POST",
                    url: (mainUrl + '/v1/merchants/alterPsd'),
                    data: {oldPsd: s.psw, newPsd: s.npsw, surePsd: s.okpsw},
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function (obj) {
                        console.log(obj);
                        var str = [];
                        for (var s in obj) {
                            str.push(encodeURIComponent(s) + "=" + encodeURIComponent(obj[s]));
                        }
                        console.log(str.join("&"));
                        return str.join("&");
                    }
                }).success(function (data) {
                    console.log(data);
                    if(data!=null){
                        var headerMe = angular.fromJson(localStorage.getItem('headerMe'));
                        headerMe.mim = s.okpsw;
                        localStorage.setItem('headerMe', angular.toJson(headerMe));
                        var alertPopup = $ionicPopup.alert({
                            template: '密码修改成功'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 1500);
                        alertPopup.then(function () {
                            $scope.revisePswModal.hide();
                        })
                    }
                    /*if (data.header.flag === 1) {
                        var headerMe = angular.fromJson(localStorage.getItem('headerMe'));
                        headerMe.mim = s.okpsw;
                        localStorage.setItem('headerMe', angular.toJson(headerMe));
                        var alertPopup = $ionicPopup.alert({
                            template: '密码修改成功'
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 1500);
                        alertPopup.then(function () {
                            $scope.revisePswModal.hide();
                        })
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
            }
        }


    });