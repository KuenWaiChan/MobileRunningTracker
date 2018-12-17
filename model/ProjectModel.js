"use strict";

function ProjectModel() {
    var watch,
        startTime,
        finishTime,
        loc,
        locs = [],
        _this = this,
        flag,
        runName,
        timeoutCounter = 0;

    this.initRun = function () {
        flag = false;
        startTime = new Date();
        this.getLocation();
        return true;
    };

    this.run = function(watch){
        var count,
            start,
            finish,
            names;
        if(flag && timeoutCounter < 3) {
            navigator.geolocation.clearWatch(watch);
            finishTime = new Date();

            if(startTime !== undefined && finishTime !== undefined && runName !== undefined) {
                if (typeof (localStorage) !== undefined) {
                    count = localStorage.getItem("count");
                    if(count == undefined)
                        count = 0;
                    else
                        count++;
                    localStorage.setItem("count", count);
                    if(count == 0){
                        start = [startTime];
                        finish = [finishTime];
                        names = [runName];
                    } else{
                        start = JSON.parse(localStorage.getItem("start"));
                        finish = JSON.parse(localStorage.getItem("finish"));
                        names = JSON.parse(localStorage.getItem("names"));
                        start.push(startTime);
                        finish.push(finishTime);
                        names.push(runName);
                    }
                    localStorage.setItem("start", JSON.stringify(start));
                    localStorage.setItem("finish", JSON.stringify(finish));
                    localStorage.setItem("names", JSON.stringify(names));
                    var pathLat = [];
                    var pathLng = [];
                    for(var i=0; i<locs.length; i++){
                        pathLat.push(locs[i].latitude);
                        pathLng.push(locs[i].longitude);
                    }

                    localStorage.setItem("pathLat"+count, JSON.stringify(pathLat));
                    localStorage.setItem("pathLng"+count, JSON.stringify(pathLng));

                    // itemsForStorage.push(_this.getRouteName(), startTime, finishTime);
                    // localStorage.setItem("records", JSON.stringify(itemsForStorage) + "\n");
                    // localStorage.setItem(_this.getRouteName(), JSON.stringify(locs));
                }
            }
            timeoutCounter = 0;
        }else if(timeoutCounter >= 3){
            navigator.geolocation.clearWatch(watch);
            timeoutCounter = 0;
        }
    };

    this.getLocation = function () {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000
        };
        watch = navigator.geolocation.watchPosition(function(pos){
            timeoutCounter = 0;
            loc = pos.coords;
            locs.push(loc);

            _this.run(watch);
        }, function (err){
            console.warn(err);
            if(timeoutCounter < 3) {
                _this.getLocation();
                timeoutCounter++;
            }else{
                _this.setInterrupted();
            }
        }, options);
    };

    this.setRunName = function(name){
        runName = name;
    };

    this.setInterrupted = function () {
        flag = true;
        _this.run(watch);
    };

    this.getInterruptedFlag = function(){
        return flag;
    };

    this.getLocs = function () {
        return locs;
    };

    this.getStartTime = function () {
        return startTime;
    };

    this.getFinishTime = function () {
        return finishTime;
    };

    this.getRouteName = function () {
        return runName;
    }

}
