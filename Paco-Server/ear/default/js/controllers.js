pacoApp.controller('HomeCtrl', ['$scope', '$http', '$routeParams', '$location', '$cacheFactory',
  function($scope, $http, $routeParams, $location, $cacheFactory) {
    $scope.newExperiment = false;
    $scope.experimentId = false;
    $scope.tabIndex = -1;
    $scope.loaded = false;

    $http.get('/userinfo').success(function(data) {

      $scope.loaded = true;

      // Make sure email isn't yourGoogleEmail@here.com for local dev testing
      if (data.user && data.user !== 'yourGoogleEmail@here.com') {
        $scope.user = data.user;

        $http.get('/experiments?admin', {cache: true}).success(function(data) {
          $scope.experiments = data;
        });

        $http.get('/experiments?joined', {cache: true}).success(function(data) {
          $scope.joined = data;
        });

      } else {
        $scope.loginURL = data.login;
      }
      $scope.logoutURL = data.logout;

    }).error(function(data) {
      console.log(data);
    });


    if (angular.isDefined($routeParams.experimentId)) {
      if ($routeParams.experimentId === 'new') {
        $scope.newExperiment = true;
        $scope.experimentId = -1;
      } else {
        $scope.experimentId = parseInt($routeParams.experimentId, 10);
      }
    }

    if (angular.isDefined($routeParams.csvExperimentId)) {
      $scope.csvExperimentId = parseInt($routeParams.csvExperimentId, 10);
    }

    $scope.addExperiment = function() {
      $location.path('/experiment/new');
    };
  }
]);


pacoApp.controller('ExperimentCtrl', ['$scope', '$http',
  '$mdDialog', '$filter', 'config', 'template', '$location',
  function($scope, $http, $mdDialog, $filter, config, template,
    $location) {
    $scope.ace = {};
    $scope.feedbackTypes = config.feedbackTypes;
    $scope.tabs = config.tabs;
    $scope.state = {
      tabId: 0
    };

    if ($location.hash()) {
      var newTabId = config.tabs.indexOf($location.hash());
      if (newTabId !== -1) {
        $scope.state.tabId = newTabId;
      }
    }

    if ($scope.experimentId === -1) {
      $scope.experiment = angular.copy(template.experiment);

      if ($scope.user) {
        $scope.experiment.creator = $scope.user;
        $scope.experiment.contactEmail = $scope.user;
        $scope.experiment.admins.push($scope.user);
      }
    } else if ($scope.experimentId) {
      $http.get('/experiments?id=' + $scope.experimentId, {cache: true}).success(
        function(data) {
          $scope.experiment = data[0];
          $scope.experiment0 = angular.copy(data[0]);
          $scope.prepareAce();
        });
    }

    $scope.$watch('user', function(newValue, oldValue) {
      if ($scope.newExperiment) {
        $scope.experiment.creator = $scope.user;
        $scope.experiment.contactEmail = $scope.user;
        $scope.experiment.admins = [$scope.user];
      }
    });

    // TODO(ispiro): figure out a way to disable the default # scrolling 
    $scope.$watch('state.tabId', function(newValue, oldValue) {
      if ($scope.state.tabId === 0) {
        $location.hash('');
      } else if ($scope.state.tabId > 0) {
        $location.hash(config.tabs[$scope.state.tabId]);
      }
    });

    // Ace is loaded when the Source tab is selected so get pretty JSON here
    $scope.prepareAce = function(editor) {
      if (editor) {
        editor.$blockScrolling = 'Infinity';
      }

      $scope.ace = {
        JSON: JSON.stringify($scope.experiment, null, '  '),
        error: false
      };
    };

    $scope.$watch('ace.JSON', function(newValue, oldValue) {
      try {
        var exp = JSON.parse(newValue);
      } catch (e) {
        $scope.ace.error = true;
        return false;
      }
      $scope.ace.error = false;
      $scope.experiment = exp;
    });

    $scope.saveExperiment = function() {
      $http.post('/experiments', $scope.experiment).success(function(data) {
        if (data.length > 0) {
          if (data[0].status === true) {
            $mdDialog.show(
              $mdDialog.alert()
              .title('Save Status')
              .content('Success!')
              .ariaLabel('Success')
              .ok('OK')
            );

            if ($scope.newExperiment) {
              $location.path('/experiment/' + data[0].experimentId);
            }

            $scope.experiment0 = angular.copy($scope.experiment);

          } else {
            var errorMessage = data[0].errorMessage;
            $mdDialog.show({
              templateUrl: 'partials/error.html',
              locals: {
                errorMessage: errorMessage
              },
              controller: 'ErrorCtrl'
            });
          }
        }
      }).error(function(data, status, headers, config) {
        console.log(data);
      });
    };

    $scope.addGroup = function() {
      $scope.experiment.groups.push(angular.copy(template.group));
    };

    $scope.remove = function(arr, idx) {
      arr.splice(idx, 1);
    };

    $scope.convertBack = function(event) {
      var json = event.target.value;
      $scope.experiment = JSON.parse(json);
    };
  }
]);


pacoApp.controller('CsvCtrl', ['$scope', '$http', '$mdDialog', '$timeout', '$location',
  function($scope, $http, $mdDialog, $timeout, $location) {

    var startMarker =
      '<title>Current Status of Report Generation for job: ';
    var endMarker = '</title>';

    $scope.status = 'Idle';

    if ($location.hash() && $location.hash() === 'anon') {
      $scope.anon = true;
    }

    $scope.poll = function() {
      $scope.status += '.';

      $http.get($scope.jobUrl).success(
        function(data) {

          $scope.result = data;

          if (data === 'pending\n') {
            $timeout($scope.poll, 1000);
          } else {
            $scope.csv = data;
            var rows = data.split('\n');
            $scope.table = [];
            for (var i = 0; i < rows.length; i++) {
              var cells = rows[i].split(',');
              if (cells.length > 1) {
                $scope.table.push(cells);
              }
            }
            var blob = new Blob([data], { type : 'text/csv' });
            $scope.csvData = (window.URL || window.webkitURL).createObjectURL(blob);
          }
        }
      )
    };
    
    $scope.status = 'Sending CSV request';
    $scope.endpoint = '/events?q=experimentId=' + $scope.csvExperimentId + '&csv';
    
    if ($scope.anon) {
      $scope.endpoint += '&anon=true';
    }
    
    $http.get($scope.endpoint).success(
      function(data) {
        //TODO: endpoint should return report URL, not HTML
        startPos = data.indexOf(startMarker) + startMarker.length;
        endPos = data.indexOf(endMarker);
        if (startPos !== -1 && endPos !== -1) {
          $scope.jobUrl = '/jobStatus?jobId=' + data.substring(startPos,
            endPos) + '&cmdline=1';
          $scope.status = 'Waiting';
          $scope.poll();
        }
    });
  }
]);

pacoApp.controller('GroupCtrl', ['$scope', 'template',
  function($scope, template) {
    $scope.hiding = false;

    $scope.dateToString = function(d) {
      var s = d.getUTCFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      return s;
    };

    $scope.addInput = function(event, expandFn) {
      $scope.group.inputs.push(angular.copy(template.input));
      expandFn(true);
      event.stopPropagation();
    };

    $scope.toggleGroup = function($event) {
      $scope.hiding = !$scope.hiding;
    };

    $scope.addScheduleTrigger = function(event, expandFn) {
      $scope.group.actionTriggers.push(angular.copy(template.scheduleTrigger));
      var trigger = $scope.group.actionTriggers[$scope.group.actionTriggers
        .length - 1];
      expandFn(true);
      event.stopPropagation();
    };

    $scope.addEventTrigger = function(event, expandFn) {
      $scope.group.actionTriggers.push(angular.copy(template.eventTrigger));
      expandFn(true);
      event.stopPropagation();
    };

    $scope.aceLoaded = function(editor) {
      editor.$blockScrolling = 'Infinity';
    };

    $scope.$watch('group.fixedDuration', function(newVal, oldVal) {
      if (newVal && newVal == true && $scope.group.startDate ==
        undefined) {
        var today = new Date();
        var today = new Date();
        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
        $scope.group.startDate = $scope.dateToString(today);;
        $scope.group.endDate = $scope.dateToString(tomorrow);
      }
    });
  }
]);


pacoApp.controller('InputCtrl', ['$scope', 'config', function($scope, config) {

  $scope.responseTypes = config.responseTypes;

  $scope.$watch('input.responseType', function(newValue, oldValue) {
    if ($scope.input.responseType === 'list' &&
      $scope.input.listChoices === undefined) {
      $scope.input.listChoices = [''];
    }
  });

  $scope.addChoice = function() {
    $scope.input.listChoices.push('');
  }
}]);


pacoApp.controller('TriggerCtrl', ['$scope', '$mdDialog', 'config', 'template',
  function($scope, $mdDialog, config, template) {

    $scope.scheduleTypes = config.scheduleTypes;

    $scope.addAction = function(event) {
      var action = angular.copy(template.defaultAction);
      $scope.trigger.actions.push(action);
    }

    $scope.addSchedule = function(event) {
      $scope.trigger.schedules.push(angular.copy(template.schedule));
    }

    $scope.addCue = function(event) {
      $scope.trigger.cues.push(angular.copy(template.cue));
    }

    $scope.showSchedule = function(event, schedule) {
      $mdDialog.show({
        templateUrl: 'partials/schedule.html',
        locals: {
          schedule: schedule
        },
        clickOutsideToClose: true,
        controller: 'ScheduleCtrl'
      });
    };

    $scope.showAction = function(event, action, triggerType) {

      $mdDialog.show({
        templateUrl: 'partials/action.html',
        locals: {
          action: action,
          triggerType: triggerType
        },
        clickOutsideToClose: true,
        controller: 'ActionCtrl'
      });
    };

    $scope.showCue = function(event, cue) {
      $mdDialog.show({
        templateUrl: 'partials/cue.html',
        locals: {
          cue: cue
        },
        clickOutsideToClose: true,
        controller: 'CueCtrl'
      });
    };
  }
]);


pacoApp.controller('ActionCtrl', ['$scope', '$mdDialog', 'config', 'template',
  'action', 'triggerType',
  function($scope, $mdDialog, config, template, action, triggerType) {

    $scope.action = action;
    $scope.triggerType = triggerType;
    $scope.actionTypes = config.actionTypes;
    $scope.hide = $mdDialog.hide;

    $scope.$watch('action.actionCode', function(newValue, oldValue) {
      if (newValue <= 2) {
        angular.extend($scope.action, template.defaultAction);
      } else if (newValue >= 3) {
        angular.extend($scope.action, template.otherAction);
      }
    });

    $scope.aceLoaded = function(editor) {
      editor.$blockScrolling = 'Infinity';
    };
  }
]);


pacoApp.controller('CueCtrl', ['$scope', '$mdDialog', 'config', 'cue',
  function($scope, $mdDialog, config, cue) {

    $scope.cue = cue;
    $scope.cueTypes = config.cueTypes;
    $scope.hide = $mdDialog.hide;
  }
]);


pacoApp.controller('ErrorCtrl', ['$scope', '$mdDialog', 'config',
  'errorMessage',
  function($scope, $mdDialog, config, errorMessage) {

    $scope.errorMessage = errorMessage;
    $scope.hide = $mdDialog.hide;

    // TODO(ispiro): correctly handle Exception errors
    if (errorMessage.indexOf('Exception') === 0) {
      $scope.errors = [errorMessage];
    } else {

      var err = JSON.parse($scope.errorMessage);
      $scope.errors = [];
      for (error in err) {
        $scope.errors.push(err[error].msg);
      }
    }
  }
]);


pacoApp.controller('ScheduleCtrl', ['$scope', '$mdDialog', 'config', 'template',
  'schedule',
  function($scope, $mdDialog, config, template, schedule) {

    $scope.schedule = schedule;

    $scope.scheduleTypes = config.scheduleTypes;
    $scope.weeksOfMonth = config.weeksOfMonth;
    $scope.esmPeriods = config.esmPeriods;
    $scope.repeatRates = range(1, 30);
    $scope.daysOfMonth = range(1, 31);
    $scope.days = [];
    $scope.hide = $mdDialog.hide;

    if ($scope.schedule.weekDaysScheduled !== undefined) {
      var bits = parseInt($scope.schedule.weekDaysScheduled).toString(2);
      for (var i = 0; i < bits.length; i++) {
        var bit = bits[bits.length - i - 1];
        if (bit == '1') {
          $scope.days[i] = true;
        }
      }
    }

    function range(start, end) {
      var arr = [];
      for (var i = start; i <= end; i++) {
        arr.push(i);
      }
      return arr;
    }

    $scope.addTime = function(times, idx) {
      times.splice(idx + 1, 0, angular.copy(template.signalTime));
    };

    $scope.remove = function(arr, idx) {
      arr.splice(idx, 1);
    };

    $scope.parseInt = function(number) {
      return parseInt(number, 10);
    }

    $scope.$watchCollection('days', function(days) {
      var sum = 0;
      if (days) {
        for (var i = 0; i < 7; i++) {
          if ($scope.days[i]) {
            sum += Math.pow(2, i);
          }
        }
        $scope.schedule.weekDaysScheduled = sum;
      }
    });

    $scope.$watch('schedule.scheduleType', function(newValue, oldValue) {

      if (angular.isDefined(newValue)) {
        if ($scope.schedule.signalTimes === undefined) {
          $scope.schedule.signalTimes = [angular.copy(template.signalTime)];
        }

        if (newValue === 4 && oldValue !== 4) {

          // We can't just assign a new copy of the template to the schedule
          // variable since this orphans it from the top-level experiment.
          // Instead, we use extend to copy the properties of the template in.
          angular.extend($scope.schedule, template.defaultEsmSchedule);
        }

      }
    });
  }
]);


pacoApp.controller('AdminCtrl', ['$scope', 'config', function($scope, config) {

  $scope.dataDeclarations = config.dataDeclarations;
  $scope.declared = [];

  $scope.inList = function(item) {
    if ($scope.experiment && $scope.experiment.extraDataCollectionDeclarations) {
      var id = parseInt(item);
      if ($scope.experiment.extraDataCollectionDeclarations.indexOf(id) !==
        -1) {
        return true;
      }
    }
    return false;
  }

  $scope.toggle = function(item) {
    var id = parseInt(item);
    var find = $scope.experiment.extraDataCollectionDeclarations.indexOf(
      id);

    if (find === -1) {
      $scope.experiment.extraDataCollectionDeclarations.push(id);
    } else {
      $scope.experiment.extraDataCollectionDeclarations.splice(find, 1);
    }
  };
}]);


pacoApp.controller('SummaryCtrl', ['$scope', 'config', function($scope, config) {

  $scope.getActionSummary = function() {
    if ($scope.action.actionCode !== undefined && $scope.action.actionCode !==
      '') {
      return config.actionTypes[$scope.action.actionCode - 1];
    } else {
      return 'Undefined';
    }
  };

  $scope.getCueSummary = function() {
    if ($scope.cue.cueCode !== undefined && $scope.cue.cueCode !== '') {
      return config.cueTypes[$scope.cue.cueCode - 1];
    } else {
      return 'Undefined';
    }
  };

  $scope.getScheduleSummary = function() {
    var sched = $scope.schedule;
    var str = '';

    if (sched.scheduleType === null) {
      return 'Undefined';
    }

    //ispiro:using === for these comparisons breaks on schedule edit
    if (sched.scheduleType == 0) {
      if (sched.repeatRate == 1) {
        str += 'Every day';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' days'
      }
    } else if (sched.scheduleType == 1) {
      str += 'Every weekday';
    } else if (sched.scheduleType == 2) {
      if (sched.repeatRate == 1) {
        str += 'Every week';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' weeks'
      }
    } else if (sched.scheduleType == 3) {
      if (sched.repeatRate == 1) {
        str += 'Every month';
      } else if (sched.repeatRate != undefined) {
        str += 'Every ' + sched.repeatRate + ' months'
      }
    } else if (sched.scheduleType == 4) {
      str += config.scheduleTypes[4] + ', ' + sched.esmFrequency +
        ' time';
      if (sched.esmFrequency > 1) {
        str += 's per ';
      } else {
        str += ' per ';
      }
      str += config.esmPeriods[sched.esmPeriodInDays];

    } else if (sched.scheduleType == 5) {
      str = 'Self report only';
    } else {
      str = 'Undefined';
    }

    if (sched.scheduleType >= 0 && sched.scheduleType <= 3) {
      if (sched.signalTimes) {
        str += ', ' + sched.signalTimes.length;
        if (sched.signalTimes.length == 1) {
          str += ' time each';
        } else {
          str += ' times each';
        }
      }
    }

    return str;
  };
}]);
