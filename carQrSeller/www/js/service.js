angular.module('carQrSeller')
    .constant("mainUrl", "http://192.168.0.100:5555/merchant")
    // .constant("mainUrl", "http://127.0.0.1:5555/merchant")
    // .constant("mainUrl", "http://localhost:5555/merchant")
    // .constant("mainUrl", "http://t.cheshangma.cn")
    // .constant("mainUrl", "http://pm.91-ec.com")
    // .constant("mainUrl", "http://114.55.54.96:7020")
    // .constant("mainUrl", "http://192.168.0.103:8081")
    // .constant("mainUrl", "http://10.69.131.228:80")
    .filter('addImgPath', function (mainUrl) {
        return function (imgPath) {
            return mainUrl + imgPath;
        }
    })
    .factory('getPlatform', function () {
        return function () {
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
            return platformInfo;
        }
    })
    .factory('setHeadersInfo', function ($http) {
        return function (session,per) {

            $http.defaults.headers.common = {
                Session: session,
                persistence:per
            };

        }
    })
    /*.factory('setHeaderInfo', function (getPlatform) {
        return function () {
            var platformInfo = getPlatform();
        }
    });*/