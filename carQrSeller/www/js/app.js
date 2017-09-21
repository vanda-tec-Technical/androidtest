angular.module('carQrSeller', ['ionic','ngCookies', 'oc.lazyLoad', 'ngCordova'])
    .run(function ($ionicPlatform, $state, mainUrl, $http, $ionicPopup, $timeout, $rootScope,getPlatform, $location, $ionicHistory, $cordovaAppVersion, setHeadersInfo) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }


            // versionUpdate();
            hasLogin();


            exitApp();
        });

        // 版本更新
        function versionUpdate() {
            // $cordovaAppVersion.getVersionNumber().then(function (v) {
                // $rootScope.ver = v;
                var v = '1.0';
                $http({
                    method: "post",
                    url: (mainUrl + '/outside/mctmobile/merchant/getEdition.htm'),
                    params: {vision: v, tType: getPlatform()}
                }).success(function (data) {
                    console.log(data);
                    if (data.header.flag == 1) {
                        if (v < data.content.edition) {
                            $state.go('versionUpdate', {oldVersionNo: v});
                        } else {
                            $state.go('home');
                            // hasLogin();
                        }
                    } else {
                        $state.go('home');
                        // hasLogin();
                    }
                }).error(function (error) {
                    // console.log(error)
                    // hasLogin();
                    $state.go('home');
                });
            // });
        }

        //判断是否登录，账号是否能正常使用；
        //不能使用进入登陆页面
        function hasLogin() {
            var meInfo = angular.fromJson(localStorage.getItem('meInfo'));
            console.log(meInfo);
            //判断是否登录，
            if (meInfo == null) {     //未登录，跳转到login
                $state.go('login');
            } else {                    //已经登录，判断用户信息是否能正常登录
                $http({
                    withCredentials: true,
                    method: "post",
                    url: (mainUrl + '/login'),
                    // params: {userName: meInfo.name, password: meInfo.mim}

                    data: {username: meInfo.name, password: meInfo.mim},
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
                }).success(function (data, status, headers, config) {

                    var contentType = headers("content-type").split(';');
                    console.log(contentType);
                    var session = contentType[2].split('=')[1];
                    var persistence = contentType[1].split('=')[1];
                    console.log(session);
                    console.log(persistence);
                    meInfo.session = session;
                    meInfo.persistence = persistence;
                    setHeadersInfo(session, persistence);
                    if (data!== null) {       //  用户能正常登陆
                        //判断是否激活，
                        if (data.isActive == 1) {       //已经激活，跳转到home
                            meInfo.userName = data.description;
                            meInfo.point = data.point;
                            meInfo.mctUserId = data.id;
                            console.log(meInfo);
                            localStorage.setItem('meInfo', angular.toJson(meInfo));
                            // versionUpdate();
                            // $state.go('home');
                        } else {                                //未激活，否则跳转到激活页面
                            $state.go('activate');
                        }

                    } else {                            //登录失败或错误，跳转到登陆页面
                        var alertPopup = $ionicPopup.alert({
                            template: data.errorDesc
                        });
                        alertPopup.then(function () {
                            $state.go('login');
                        });
                        $timeout(function () {
                            alertPopup.close();
                        }, 1500);
                    }
                }).error(function (error) {
                    console.log(error);
                    var alertPopup = $ionicPopup.alert({
                        template: angular.toJson(error)
                    });
                    alertPopup.then(function () {
                        $state.go('login');
                    });
                    $timeout(function () {
                        alertPopup.close();
                    }, 3000);
                });
            }
        }


        function exitApp() {
            $ionicPlatform.registerBackButtonAction(function (e) {
                e.preventDefault();
                if ($location.path() == "/home" || $location.path() == "/login") {
                    var confirmPopup = $ionicPopup.confirm({
                        title: '<strong>退出应用?</strong>',
                        template: '你确定要退出应用吗?',
                        okText: '退出',
                        cancelText: '取消'
                    });

                    confirmPopup.then(function (res) {
                        if (res) {
                            ionic.Platform.exitApp();
                        }
                    });
                } else {
                    $ionicHistory.goBack();
                }
                return false;
            }, 101);
        }


    })
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            event: false
        })
    }])
    .config(function ($ionicConfigProvider) {
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');
        $ionicConfigProvider.scrolling.jsScrolling(true);
    })
    /*.config(function ($httpProvider) {
        var headerMe = angular.fromJson(localStorage.getItem('headerMe'));
        var mctUserId = undefined;
        if (headerMe == null) {
            //操作者ID
            mctUserId = '0';
        } else {
            //操作者ID
            mctUserId = headerMe.mctUserId;//.toString();
        }
        // console.log(typeof mctUserId);

        //平台类型
        var platformInfo = '11';
        if (ionic.Platform.platform() === 'ios' && ionic.Platform.isIOS()) {
            if (ionic.Platform.isIPad()) {
                platformInfo = '20';
            } else {
                platformInfo = '21';
            }
        } else if (ionic.Platform.platform() === 'android' && ionic.Platform.isAndroid()) {
            platformInfo = '11';
        }
        //时间戳
        var timestamp = Math.round(new Date().getTime() / 1000);
        var key = mctUserId + platformInfo + timestamp;
        console.log(key);
        //加密
        var summary = hex_sha1(key + 'VandaTecm^c)^t');

        $httpProvider.defaults.headers.common = {
            'mctUserId': mctUserId,
            'terminaltype': platformInfo,
            'timestamp': timestamp,
            'summary': summary
        };
    })*/
;
