
//-1) make single click drop lap
//-2) record duration instead of actual time.
//-3) Pause is not time pause, but instead participant block.
//-4) make sure first participant start time is activity start time.

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var SwimAMile = angular.module('SwimAMile', ['ngRoute']);
var apiRoot = '/';
var gsessions = [];
var password = '15910535-a88e-413a-9a6f-6a384c704fe4';
//configure our routes
SwimAMile.config(function ($routeProvider) {
    $routeProvider

        // route for the home page
        .when('/', {
            templateUrl: 'pages/login.html',
            controller: 'loginController'

        })
        // route for the about page
        .when('/Name', {
            templateUrl: 'pages/Name.html',
            controller: 'NameController'
        })
        .when('/Welcome', {
            templateUrl: 'pages/Welcome.html',
            controller: 'WelcomeController'
        })

        .when('/SelectSession', {
            templateUrl: 'pages/SelectSession.html',
            controller: 'SelectSessionController'
        })

        .when('/SelectLane', {
            templateUrl: 'pages/SelectLane.html',
            controller: 'SelectLaneController'
        })
         .when('/StartList', {
             templateUrl: 'pages/StartList.html',
             controller: 'startListController'
         })

        .when('/StartSession', {
            templateUrl: 'pages/StartSession.html',
            controller: 'StartSessionController'
        })
         .when('/ImportPaused', {
             templateUrl: 'pages/ImportPaused.html',
             controller: 'ImportPausedController'
         })
         .when('/Result', {
             templateUrl: 'pages/Result.html',
             controller: 'ResultController'
         })

});

// create the controller and inject Angular's $scope
SwimAMile.controller('loginController',['$scope','$http', function ($scope, $http) {
    // create a message to display in our view
    $scope.message = 'Login Page';
    $scope.uniquID = '';
    $scope.erroText = '';
    $scope.validateUniquId = function () {

        console.info($scope.uniquID);
        var url = apiRoot + 'api/v1/Event/GetEventSummary/' + $scope.uniquID;
        $http.get(url).
                      success(function (data, status, headers, config) {
                          if (status == 200) {
                              gsessions = data;
                              window.localStorage.setItem("eventSummary", JSON.stringify(data));
                              window.localStorage.setItem("password", $scope.uniquID);
                              location.href = '#/Welcome';

                          }
                          else {
                              alert('Invalid password for the event.')
                          }
                      }).
                      error(function (data, status, headers, config) {
                          alert(data);
                      });

    };
}]);



SwimAMile.controller('WelcomeController',['$scope','$http',  function ($scope, $http) {

    $scope.name = {};
    $scope.distance = {};
    $scope.length = {};
    $scope.laps = {};

    var data = JSON.parse(window.localStorage.getItem("eventSummary"));

    $scope.name = data.name;
    $scope.distance = data.distance;
    $scope.length = data.length;
    $scope.laps = data.laps;

    $scope.submit = function () {
        location.href = '#/SelectSession';
    }

}]);



SwimAMile.controller('NameController', ['$scope','$http','$filter', function ($scope, $http, $filter) {

    $scope.Sessions = [];
    var password = localStorage.getItem("password");

    $scope.itemSelected = {};
    $scope.LaneCount = [];
    $scope.selectedLane = 0;
    $scope.ErrorHide = true;
    $scope.Error = '';
    $scope.SessionSelected = function (Count) {
        var sessionId = $scope.itemSelected;
        var singleObj = $filter('filter')($scope.Sessions, { Id: sessionId })[0];
        localStorage.setItem("sessionId", sessionId)
        $scope.LaneCount = [];
        for (var i = 1; i <= singleObj.Lanes; i++) {
            $scope.LaneCount.push(i);
        }
    }

    $scope.submit = function () {

        $scope.Error = '';

        if ($scope.itemSelected == null || $scope.itemSelected < 1) {
            $scope.ErrorHide = false;
            $scope.Error = 'Session is required.';
        }
        if ($scope.selectedLane == null || $scope.selectedLane < 1) {
            $scope.ErrorHide = false;
            $scope.Error = $scope.Error + 'Lane is required.';
        }
        if ($scope.Error == '') {
            localStorage.setItem("laneSelected", $scope.selectedLane)
            location.href = '#/StartSession';
        }
    }
    for (var i = 1; i <= 10; i++) {
        $scope.LaneCount.push(i);
    }


    var url = apiRoot + 'api/v1/Event/GetSessions/' + password;
    $http.get(url).
                  success(function (data, status, headers, config) {
                      if (status == 200) {
                          $scope.Sessions = data;
                          //window.localStorage.setItem("sessions", JSON.stringify(data));
                          location.href = '#/Welcome';
                      }
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });
}]);


SwimAMile.controller('SelectSessionController',['$scope','$http', '$filter',  function ($scope, $http, $filter) {
    var password = localStorage.getItem("password");
    $scope.Sessions = [];
    $scope.itemSelected = {
        Id: 0
    };

    $scope.selected = function (e) {
        localStorage.setItem("SessionSelectedId", $scope.itemSelected.Id)
        var obj = $filter('filter')($scope.Sessions, { Id: $scope.itemSelected.Id })[0];

        localStorage.setItem("sessionId", obj.Id)
        localStorage.setItem("laneCount", obj.Lanes)
    }


    $scope.submit = function () {

        if ($scope.itemSelected != null && $scope.itemSelected.Id > 0) {
            location.href = '#/SelectLane';
        }
    }

    var url = apiRoot + 'api/v1/Event/GetSessions/' + password;
    $http.get(url).
                  success(function (data, status, headers, config) {
                      if (status == 200) {
                          $scope.Sessions = data;
                          //window.localStorage.setItem("sessions", JSON.stringify(data));
                      }
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });

}]);

SwimAMile.controller('SelectLaneController',['$scope','$http', '$filter', function ($scope, $http, $filter) {

    $scope.sessionId = localStorage.getItem("sessionId")
    $scope.LaneCount = localStorage.getItem("laneCount")
    $scope.LaneCounts = [];
    $scope.itemSelected = {
        Id: 0
    };


    $scope.submit = function () {

        if ($scope.itemSelected != null && $scope.itemSelected.Id > 0) {
            localStorage.setItem("laneId", $scope.itemSelected.Id);
            location.href = '#/StartList';
        }
    }


    for (var i = 1; i <= $scope.LaneCount; i++) {
        $scope.LaneCounts.push(i);
    }
}]);

SwimAMile.controller('startListController',['$scope','$http',function ($scope, $http) {
    $scope.laneId = localStorage.getItem("laneId");
    $scope.sessionId = localStorage.getItem("sessionId");
    $scope.participants = [];
    var url = apiRoot + 'api/v1/Participant/GetParticipants/' + $scope.sessionId + '/' + $scope.laneId + '/' + password;
    $http.get(url).
                  success(function (data, status, headers, config) {
                      if (status == 200) {
                          angular.forEach(data, function (item) {
                              if (item.participantStatus != "Disqualified") {
                                  $scope.participants.push({
                                      id: item.id,
                                      age: item.age,
                                      bib: item.bib,
                                      division: item.division,
                                      email: item.email,
                                      fName: item.fName,
                                      gender: item.gender,
                                      lane: item.lane,
                                      lName: item.lName,
                                      sessionId: item.sessionId,
                                      srNo: item.srNo,
                                      startTime: item.startTime,
                                      itemStatus: item.itemStatus, //either modified, not modified
                                      participantStatus: item.participantStatus, //either active, disqualified etc
                                      remainingLaps: item.remainingLaps,
                                      totalLength: item.totalLength,
                                      lapLength: item.lapLength,
                                      laps: item.laps,
                                      lapStatus: '', // either started or finished
                                      tempLapNo: item.laps.length,
                                      statusText: '' //to be displayed in box
                                  });
                              }
                          });

                          localStorage.setItem("participants", JSON.stringify($scope.participants));
                      }
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });

    $scope.StartSession = function () {
        location.href = '#/StartSession';
    }
    $scope.Add = function () {
        $scope.participants.push({ id: -1, bib: '', name: '', status: 'Added' });
    }
    $scope.SyncOnline = function () {

        var tosync = [];
        angular.forEach($scope.participants, function (item) {
            if (item.status != 'notchanged') {
                tosync.push(item);
            }
        });


    }
}]);


SwimAMile.controller('StartSessionController',['$scope','$http', '$filter','$timeout', function ($scope, $http, $filter, $timeout) {
    $scope.participants = JSON.parse(localStorage.getItem("participants"));
    $scope.seconds = 0;//localStorage.getItem("Secondspassed");
    if (localStorage.getItem("Secondspassed") != "") {
        $scope.seconds = parseInt(localStorage.getItem("Secondspassed"));
    }
    $scope.time = '00:00:00';

    $scope.paused = false;
    $scope.disQualified = false;

    $scope.pauseText = 'Pause';
    $scope.disQualifyText = 'Disqualify';
    $scope.EventStarted = false;

    $scope.clicked = function (e) {


        var singleObj = $filter('filter')($scope.participants, { id: e })[0];

        if ($scope.disQualified == true) {

            singleObj.participantStatus = "Disqualified";
            singleObj.statusText = "Disqualified";
            localStorage.setItem("participants", JSON.stringify($scope.participants));
            return false;
        }
        if ($scope.paused == true) {
            if (singleObj.participantStatus == 'started') {
                singleObj.participantStatus = "Paused";
                singleObj.statusText = "Paused";
                localStorage.setItem("participants", JSON.stringify($scope.participants));

                $scope.save().success(function (data, status, headers, config) {
                    alert('saved')
                }).error(function (data, status, headers, config) { alert('Error while saving.'); });

                return false;
            }
        }

        if (singleObj.participantStatus == "NotStarted") {
            singleObj.participantStatus = 'started';
            $scope.EventStarted = true;
            singleObj.lapStatus = 'started';
            singleObj.startTime = $scope.time;
            singleObj.tempLapNo = singleObj.tempLapNo + 1;
            singleObj.statusText = 'Lap ' + singleObj.tempLapNo + ' has ' + singleObj.lapStatus;

        }
        else if (singleObj.participantStatus == "started") {

            if (singleObj.remainingLaps > 0) {
                singleObj.laps.push({
                    LapStartTime: singleObj.startTime,
                    LapFinishTime: $scope.time,
                    LapNo: singleObj.tempLapNo
                });

                singleObj.startTime = $scope.time;
                singleObj.remainingLaps = singleObj.remainingLaps - 1;
                singleObj.length = singleObj.length - singleObj.lapLength;
                if (singleObj.remainingLaps > 0) {
                    singleObj.tempLapNo = singleObj.tempLapNo + 1;
                }
                else {
                    singleObj.participantStatus = 'finished';
                }

                singleObj.statusText = 'Lap ' + singleObj.tempLapNo;
            }
            else {
                singleObj.participantStatus = 'finished';
            }
        }
      

        localStorage.setItem("participants", JSON.stringify($scope.participants));


    }

    $scope.heat = localStorage.getItem("sessionId");
    $scope.lane = localStorage.getItem("laneId");


    $scope.pause = function () {
        $scope.paused = !$scope.paused;
        if ($scope.paused == true) {
            $scope.pauseText = 'Resume';
        }
        else {
            $scope.pauseText = 'Pause';
        }
    }
    $scope.import = function () {
        localStorage.setItem("participants", JSON.stringify($scope.participants));
        $scope.save(
            function () { location.href = '#/ImportPaused'; }
            );
        
    }

    $scope.disqualify = function () {
        $scope.disQualified = !$scope.disQualified;
        if ($scope.disQualified == true) {
            $scope.disQualifyText = 'click on participants to disqualify';
        }
        else {
            $scope.disQualifyText = 'Disqualify';
        }
    }
    $scope.tick = function () {
        if ($scope.EventStarted = true) {
            $scope.seconds = $scope.seconds + 1;
            localStorage.setItem("Secondspassed", $scope.seconds)
            $scope.calculateTimeFromSeconds();
        }

        $timeout($scope.tick, 1000);
    }

    $scope.save = function (ExecuteAfterSave) {
        var url = apiRoot + 'api/v1/Participant/SaveActivity/' + localStorage.getItem("password")
        $http.post(url, $scope.participants).
                      success(function (data, status, headers, config) {
                          if (status == 200) {
                              if (ExecuteAfterSave)
                                  ExecuteAfterSave();

                          }
                          else {
                              alert('Invalid password for the event.')
                          }
                      }).
                      error(function (data, status, headers, config) {
                          alert(data);
                      });


    }

    $scope.calculateTimeFromSeconds = function () {
        var sec_num = parseInt($scope.seconds);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        $scope.time = hours + ':' + minutes + ':' + seconds;

    }
    $timeout($scope.tick, 1000);
}]);


SwimAMile.controller('ImportPausedController',['$scope','$http', '$filter', function ($scope, $http, $filter) {

    $scope.sessionId = localStorage.getItem("sessionId")
    $scope.LaneCount = localStorage.getItem("laneId")
    $scope.participants = [];
    
    
    var url = apiRoot + 'api/v1/Participant/GetPausedParticipants/' + $scope.sessionId + '/' + $scope.LaneCount + '/' + password;

    $http.get(url).
                  success(function (data, status, headers, config) {
                      if (status == 200) {
                          angular.forEach(data, function (item) {
                              if (item.participantStatus != "Disqualified") {
                                  $scope.participants.push({
                                      id: item.id,
                                      age: item.age,
                                      bib: item.bib,
                                      division: item.division,
                                      email: item.email,
                                      fName: item.fName,
                                      gender: item.gender,
                                      lane: item.lane,
                                      lName: item.lName,
                                      sessionId: item.sessionId,
                                      srNo: item.srNo,
                                      startTime: item.startTime,
                                      itemStatus: item.itemStatus, //either modified, not modified
                                      participantStatus: item.participantStatus, //either active, disqualified etc
                                      remainingLaps: item.remainingLaps,
                                      totalLength: item.totalLength,
                                      lapLength: item.lapLength,
                                      laps: item.laps,
                                      lapStatus: '', // either started or finished
                                      tempLapNo: item.laps.length,
                                      statusText: '' //to be displayed in box
                                      ,checked:false
                                  });
                              }
                          });
                      }
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });


    $scope.submit = function () {

        var participantids = $filter('filter')($scope.participants, { checked: true });
        

        var url = apiRoot + 'api/v1/Participant/ImportPausedParticipants/' + $scope.sessionId + '/' + $scope.LaneCount + '/' + password;

        if (participantids.length > 0) {
            $http.post(url, participantids).
                  success(function (data, status, headers, config) {
                      if (status == 200) {
                          $scope.participants = [];
                          angular.forEach(data, function (item) {
                              if (item.participantStatus != "Disqualified") {
                                  $scope.participants.push({
                                      id: item.id,
                                      age: item.age,
                                      bib: item.bib,
                                      division: item.division,
                                      email: item.email,
                                      fName: item.fName,
                                      gender: item.gender,
                                      lane: item.lane,
                                      lName: item.lName,
                                      sessionId: item.sessionId,
                                      srNo: item.srNo,
                                      startTime: item.startTime,
                                      itemStatus: item.itemStatus, //either modified, not modified
                                      participantStatus: item.participantStatus, //either active, disqualified etc
                                      remainingLaps: item.remainingLaps,
                                      totalLength: item.totalLength,
                                      lapLength: item.lapLength,
                                      laps: item.laps,
                                      lapStatus: '', // either started or finished
                                      tempLapNo: item.laps.length,
                                      statusText: '' //to be displayed in box
                                  });
                              }
                          });

                          localStorage.setItem("participants", JSON.stringify($scope.participants));
                          $scope.back();
                      }
                  }).
                  error(function (data, status, headers, config) {
                      alert(data);
                  });
        }
    }
    $scope.back = function () {
        location.href = '#/StartSession';
        
    } 
}]);


SwimAMile.controller('ResultController', function ($scope) {
    $scope.message = 'ResultController';
});

SwimAMile.controller('contactController', function ($scope) {
    $scope.message = 'contactController';
});