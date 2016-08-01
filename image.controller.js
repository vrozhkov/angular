'use strict';
angular.module('Home')
    .controller('ImageController',
    function ($scope,$upload, $timeout,$rootScope,$http,$location,$modal,localStorageService) {     
        $http.get('/api/check_user').success(function (check) {
            $scope.check =check;
            if($scope.check.status == false){
                $location.path('/login');
            }else{              
                    if(localStorageService.get('image')!=null && localStorageService.get('order_id') !=null){
                        $rootScope.photoUpload ={"image" : localStorageService.get('image'),"order_id": localStorageService.get('order_id')};
                        $rootScope.markers = localStorageService.get('markers');
                        if($rootScope.photoUpload ==  undefined){
                            $location.path('/');
                        }
                        else {
                            var p;var h;$scope.photoUpload = [];
                            if($rootScope.markers !=  undefined || $rootScope.markers != null) {
                                $scope.markers = $rootScope.markers;
                            }else{
                                $scope.markers = [];
                            }
                            $scope.photoUpload = $rootScope.photoUpload;
                            $scope.edits = false;                            
                            $scope.mouseclick = function (e) {                               
                                var id ='';
                                var myimage = document.getElementById("img");
                                var w = myimage.width;
                                var q = myimage.height;
                                if (e.offsetX != undefined) {
                                    p = (e.offsetX / w) * 100;
                                    h = (e.offsetY / q) * 100;
                                    if(e.offsetX >= 200){
                                        $scope.left = -200;
                                        $scope.scaleY=1;
                                        $scope.top = -1;
                                        $scope.topcoment= -110;
                                    }
                                    if(e.offsetX < 200){
                                        $scope.left= -(e.offsetX-8);
                                        $scope.scaleY=1;
                                        $scope.top = -1;
                                        $scope.topcoment= -110;
                                    }
                                    if(e.offsetY < 110){
                                        $scope.topcoment= 70;
                                        $scope.scaleY=-1;
                                        $scope.top = 40;
                                    }
                                    if(w-e.offsetX<200 ){
                                        $scope.right= -(w-e.offsetX+8);
                                        $scope.left= '';
                                    }
                                    $scope.markers.push({
                                        "id": $scope.markers.length + 1,
                                        "x": p,
                                        "y": h,
                                        "color": '#FF8C00',
                                        "comment": '',
                                        "show":'true',
                                        "left":$scope.left,
                                        "scaleY":$scope.scaleY,
                                        "top":$scope.top,
                                        "topcoment":$scope.topcoment,
                                        "right": $scope.right
                                    });
                                }
                                if (e.offsetX == undefined) {
                                    e = e || window.event;
                                    var target = e.target || e.srcElement,
                                        rect = target.getBoundingClientRect(),
                                        offsetX = e.clientX - rect.left,
                                        offsetY = e.clientY - rect.top;
                                    p = (offsetX / w) * 100;
                                    h = (offsetY / q) * 100;
                                    if(offsetX >= 200){
                                        $scope.left = -200;
                                        $scope.scaleY=1;
                                        $scope.top = -1;
                                        $scope.topcoment= -110;
                                    }
                                    if(offsetX < 200){
                                        $scope.left= -(offsetX-8);
                                        $scope.scaleY=1;
                                        $scope.top = -1;
                                        $scope.topcoment= -110;
                                    }
                                    if(offsetY < 110){
                                        $scope.topcoment= 70;
                                        $scope.scaleY=-1;
                                        $scope.top = 40;
                                    }
                                    if(w-offsetX<200 ){
                                        $scope.right= -(w-offsetX+8);
                                        $scope.left= '';
                                    }
                                    $scope.markers.push({
                                        "id": $scope.markers.length + 1,
                                        "x": p,
                                        "y": h,
                                        "color": '#FF8C00',
                                        "comment": "",
                                        "show":'true',
                                        "left":$scope.left,
                                        "scaleY":$scope.scaleY,
                                        "top":$scope.top,
                                        "topcoment":$scope.topcoment,
                                        "right": $scope.right
                                    });
                                }
                                id = $scope.markers.length;
                                $http.post('/api/upload_image_save', {
                                    "order_id": $rootScope.photoUpload.order_id,
                                    "coords": $scope.markers}).success(function (data) {
                                    $scope.response = [];$scope.markers = [];
                                    $scope.response = data;
                                    $scope.markers = angular.fromJson($scope.response.data.dots_coords);
                                    for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                        if($scope.markers[i].id ==  id && $scope.markers[i].x ==p && $scope.markers[i].y ==h)  {
                                            $scope.markers[i].show = 'true';
                                        }
                                    }
                                    localStorageService.set('markers',$scope.markers);
                                });
                            };                           
                            $scope.save = function (coordX, coordY,id) {
                                for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                    if ($scope.markers[i].x == coordX && $scope.markers[i].y == coordY && $scope.markers[i].id == id) {
                                        if($scope.markers[i].comment == ''){
                                            $scope.comment =false;
                                        }
                                        else{
                                            $scope.comment = true;
                                        $scope.markers[i].color = '#027C81';
                                        $scope.markers[i].show = 'false';
                                        $scope.edits = false;
                                        }
                                    }
                                }
                                if($scope.comment == false){
                                    $scope.messages = " ";
                                    $scope.messages ="Please add comment";
                                    $scope.state = 4;
                                    $scope.location = '';
                                    $modal.open({
                                        templateUrl: 'modules/home/views/modalConfirming.html',
                                        controller: 'ModalInstanceCtrl',
                                        resolve: {
                                            messages: function () {
                                                return $scope.messages;
                                            },
                                            state: function () {
                                                return $scope.state;
                                            },
                                            location: function () {
                                                return $scope.location;
                                            }
                                        }
                                    });
                                }
                                else{
                                $http.post('/api/upload_image_save', {
                                    "order_id": $rootScope.photoUpload.order_id,
                                    "coords": $scope.markers
                                }).success(function (data) {
                                    $scope.response = [];$scope.markers = [];
                                    $scope.response = data;
                                    $scope.markers = angular.fromJson($scope.response.data.dots_coords);
                                    for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                        $scope.markers[i].show = 'false';
                                    }
                                    localStorageService.set('markers',$scope.markers);
                                });
                                }
                            };
                            $scope.orange_marker = false;
                            $scope.submit = function () {
                                $rootScope.submited =false;
                                $scope.submits = [];
                                var number = 0;
                                for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                    if ($scope.markers[i].color == '#FF8C00') {
                                        $scope.orange_marker = true;
                                    }
                                    if ($scope.markers[i].color == '#027C81') {
                                        $scope.submits.push({
                                            "id": number+1,
                                            "x":$scope.markers[i].x,
                                            "y": $scope.markers[i].y,
                                            "color": $scope.markers[i].color,
                                            "comment": $scope.markers[i].comment,
                                            "show":'false'});
                                        number ++;
                                    }
                                }
                                if($scope.submits.length == 0){
                                    $rootScope.submited =true;
                                    $scope.messages = " ";
                                    $scope.messages ="Please add marker";
                                    $scope.state = 4;
                                    $scope.location = '';
                                    $modal.open({
                                        templateUrl: 'modules/home/views/modalConfirming.html',
                                        controller: 'ModalInstanceCtrl',
                                        resolve: {
                                            messages: function () {
                                                return $scope.messages;
                                            },
                                            state: function () {
                                                return $scope.state;
                                            },
                                            location: function () {
                                                return $scope.location;
                                            }
                                        }
                                    });
                                }
                                if($scope.submits.length != 0) {
                                    $rootScope.submited =false;
                                    if($scope.orange_marker == true) {
                                        $scope.messages = " ";
                                        $scope.messages = "Some edits weren't saved properly. Do you still want to submit the image?";
                                        $scope.state = 1;
                                        $scope.location = '';
                                        $modal.open({
                                            templateUrl: 'modules/home/views/modal.html',
                                            controller: 'SubmitCtrl',
                                            resolve: {
                                                messages: function () {
                                                    return $scope.messages;
                                                },
                                                submits: function () {
                                                    return $scope.submits;
                                                }
                                            }
                                        });
                                    }
                                    if($scope.orange_marker != true){
                                        $rootScope.submited =false;
                                        $http.post('/api/submit_order_image', {
                                            "order_id": $rootScope.photoUpload.order_id,
                                            "coords": $scope.submits
                                        }).success(function (data) {
                                            $scope.response = data;
                                            if(data.status == true){
                                            localStorageService.remove('image');localStorageService.remove('order_id');localStorageService.remove('markers');
                                            $scope.messages = " ";
                                            $scope.messages ="Your brief has been send to your Photo Minion. If you have more images that need fixing, just go ahead and upload another one.";
                                            $scope.state = 1;
                                            $scope.location = '';
                                            $modal.open({
                                                templateUrl: 'modules/home/views/modalConfirming.html',
                                                controller: 'ModalInstanceCtrl',
                                                resolve: {
                                                    messages: function () {
                                                        return $scope.messages;
                                                    },
                                                    state: function () {
                                                        return $scope.state;
                                                    },
                                                    location: function () {
                                                        return $scope.location;
                                                    }
                                                }
                                            });}
                                            if(data.status != true){
                                                $scope.messages = " ";
                                                $scope.messages ="Error.";
                                                $scope.state = 1;
                                                $scope.location = '';
                                                $modal.open({
                                                    templateUrl: 'modules/home/views/modalConfirming.html',
                                                    controller: 'ModalInstanceCtrl',
                                                    resolve: {
                                                        messages: function () {
                                                            return $scope.messages;
                                                        },
                                                        state: function () {
                                                            return $scope.state;
                                                        },
                                                        location: function () {
                                                            return $scope.location;
                                                        }
                                                    }
                                                });
                                                $rootScope.submited =true;
                                            }
                                        });
                                    }
                                }
                            };
                            $scope.discard = function (coordX, coordY,id) {
                                $http.post('/api/get_coordinates', {
                                    "order_id": $rootScope.photoUpload.order_id
                                }).success(function (data) {
                                    $scope.markers = [];
                                    $scope.markers = angular.fromJson(data.coords);
                                    for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                        if ($scope.markers[i].id == id && $scope.markers[i].x == coordX && $scope.markers[i].y == coordY) {
                                            $scope.markers[i].show = 'true';
                                        }
                                    }
                                });
                                $scope.edits = false;
                                localStorageService.set('markers',$scope.markers);
                            };
                            $scope.open = function (coordX, coordY,id) {
                                for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                    if ($scope.markers[i].id == id && $scope.markers[i].x == coordX && $scope.markers[i].y == coordY) {
                                        if( $scope.markers[i].show == 'true'){
                                            $scope.markers[i].show = 'false';}
                                        else{ $scope.markers[i].show = 'true';}
                                    }
                                    else{$scope.markers[i].show = 'false';}
                                }
                                localStorageService.set('markers',$scope.markers);
                            };
                            $scope.change = function () {
                                $scope.edits = true;
                            };
                            $scope.delete = function (coordX, coordY,id) {
                                for (var i = 0; i <= $scope.markers.length - 1; i++) {
                                    if ($scope.markers[i].x == coordX && $scope.markers[i].y == coordY && $scope.markers[i].id == id) {
                                        $scope.markers.splice(i, 1);
                                    }
                                }
                                $http.post('/api/upload_image_save', {
                                    "order_id": $rootScope.photoUpload.order_id,
                                    "coords": $scope.markers
                                }).success(function (data) {
                                    $scope.response = [];
                                    $scope.response = data;
                                    if($scope.markers != ''){
                                        $scope.markers = [];
                                        $scope.markers = angular.fromJson($scope.response.data.dots_coords);
                                    } else{
                                        $scope.markers = [];
                                        $rootScope.markers = {};
                                    }
                                    localStorageService.set('markers',$scope.markers);
                                });
                            };
                            $scope.deleteImage = function () {
                                $http.post('/api/delete_image', {
                                    order_id: $scope.photoUpload.order_id}).success(function (response) {
                                    $scope.deleteStatus = response;
                                    if ($scope.deleteStatus.message == 1) {
                                        localStorageService.remove('image');localStorageService.remove('order_id'); localStorageService.remove('markers');$location.path('/');
                                    }
                                    if ($scope.deleteStatus.message == 2) {
                                        $scope.messages = " ";
                                        $scope.messages ="An error in the database";
                                        $scope.state = 1;
                                        $scope.location = '';
                                        $modal.open({
                                            templateUrl: 'modules/home/views/modalConfirming.html',
                                            controller: 'ModalInstanceCtrl',
                                            resolve: {
                                                messages: function () {
                                                    return $scope.messages;
                                                },
                                                state: function () {
                                                    return $scope.state;
                                                },
                                                location: function () {
                                                    return $scope.location;
                                                }
                                            }
                                        });
                                    }
                                    if ($scope.deleteStatus.message == 3) {
                                        $scope.messages = " ";
                                        $scope.messages = "The order is not found";
                                        $scope.location = '';
                                        $scope.state = 4;
                                        $modal.open({
                                            templateUrl: 'modules/home/views/modalConfirming.html',
                                            controller: 'ModalInstanceCtrl',
                                            resolve: {
                                                messages: function () {
                                                    return $scope.messages;
                                                },
                                                state: function () {
                                                    return $scope.state;
                                                },
                                                location: function () {
                                                    return $scope.location;
                                                }
                                            }
                                        });
                                    }
                                });
                            };
                        }
                    }
                    else{
                        localStorageService.remove('image');localStorageService.remove('order_id');localStorageService.remove('markers');$location.path('/');
                    }
            }
        });
    });

   
