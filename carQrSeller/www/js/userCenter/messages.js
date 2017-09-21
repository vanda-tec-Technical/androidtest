angular.module('carQrSeller.messages', [])
    .controller('messagesCtrl', function ($scope, $http, mainUrl,$ionicPopup,$timeout,$ionicHistory) {
    //     /outside/mctmobile/noticeEvent/getPayMsgs.htm
        $http({
            method: "GET",
            url: (mainUrl + '/v1/noticeEvent'),
            params: {
                page:0,
                size:'100',
                params:{
                    beginCreateTime:'',     //创建时间区间(开始)
                    endCreateTime:'',       //创建时间区间(结束)
                    type:'',        //创建时间区间(结束)
                    status:'',      //消息状态
                    Idreceiver:''   //消息接收者
                }
            }
        }).success(function (data) {
            console.log(data);
            /*if (data.header.flag === 1) {
                for(var i=0,l=data.content.list.length;i<l;i++){
                    data.content.list[i].context=data.content.list[i].context.split('||');
                }
                $scope.lists = data.content.list;
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


        $scope.returnPage = function(){
            /*$http({
                method: "post",
                url: (mainUrl + '/outside/mctmobile/noticeEvent/getPayMsgs.htm'),
                params: {}
            }).success(function (data) {
                console.log(data);
                if (data.header.flag === 1) {

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
            });*/
            $ionicHistory.goBack();
        }
    });