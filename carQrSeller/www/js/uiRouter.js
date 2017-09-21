angular.module('carQrSeller')
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {   // 登录
                url: '/login',
                templateUrl: 'templates/login/login.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/login/login.js'])
                    }]
                },
                controller: 'loginCtrl',
                cache: false
            })
            .state('activate', {    //激活
                url: '/activate',
                templateUrl: 'templates/activate/activate.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/activate/activate.js'])
                    }]
                },
                controller: 'activateCtrl',
                cache: false
            })
            .state('userCenter', {    //激活
                url: '/userCenter',
                templateUrl: 'templates/userCenter/userCenter.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/userCenter/userCenter.js'])
                    }]
                },
                controller: 'userCenterCtrl',
                cache: false
            })
            .state('home', {    //订单列表
                url: '/home',
                templateUrl: 'templates/home/home.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/home/home.js'])
                    }]
                },
                controller: 'homeCtrl',
                cache:false
            })
            .state('carInfo', {     //车辆信息
                url: '/carInfo/:co',
                // url: '/carInfo/:id/:num/:co',
                templateUrl: 'templates/carInfo/carInfo.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/carInfo/carInfo.js'])
                    }]
                },
                controller: 'carInfoCtrl',
                cache:false
            })
            .state('takeCar', {     //车辆消费信息
                url: '/takeCar/:ri/:co',
                // url: '/takeCar/:ri/:carnum/:carid/:co',
                templateUrl: 'templates/takeCar/takeCar.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/takeCar/takeCar.js'])
                    }]
                },
                controller: 'takeCarCtrl',
                cache:false
            })
            .state('accountInfo', {     //账户信息
                url: '/accountInfo',
                templateUrl: 'templates/userCenter/accountInfo.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/userCenter/accountInfo.js'])
                    }]
                },
                controller: 'accountInfoCtrl',
                cache:false
            })
            .state('messages', {     //消息列表
                url: '/messages',
                templateUrl: 'templates/userCenter/messages.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/userCenter/messages.js'])
                    }]
                },
                controller: 'messagesCtrl',
                cache:false
            })
            .state('versionUpdate', {     //版本更新
                url: '/versionUpdate/:oldVersionNo',
                templateUrl: 'templates/versionUpdate.html',
                resolve: {
                    loadPlugIn: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad
                            .load(['js/versionUpdate.js'])
                    }]
                },
                controller: 'versionUpdateCtrl',
                cache:false
            });

        $urlRouterProvider.otherwise('/home');

    });