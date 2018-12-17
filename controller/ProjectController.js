"use strict";

/* globals ProjectView,ProjectModel*/

var view = new ProjectView(),
    model = new ProjectModel(),
    controller = null;

function ProjectController() {
    var locationInterval;
    var timeoutInterval;
    var recordInterval;
    var raceInterval;
    var _this = this;
    var race = false;
    var target;

    view.setPedoToggleCallback(function () {
        if (this.checked) {
            view.setCounter(0);
        } else {
            view.setCounter(-1);
        }
    });
    view.setMenuMapCallback(function () {
        view.changeToMap();
        return false;
    });

    view.setMenuSettingsCallback(function () {
        view.changeToSettings();
        return false;
    });

    view.setMenuStatsCallback(function () {
        view.changeToStats();
        return false;
    });

    // view.setArmbandToggleCallback(function () {
    //     if (this.checked) {
    //         alert("checked");
    //     } else {
    //         alert("nada");
    //     }
    // });

    view.setResetButtonCallback(function () {
        localStorage.clear();
    });

    view.setStartCancelCallback(function () {
        view.clearDestinationInput();
        view.showInputHint(true);
    });

    view.setRaceButtonCallback(function (){
        var count = localStorage.getItem("count");
        if(count == undefined)
            count = -1;
        var names = JSON.parse(localStorage.getItem("names"));
        var select = document.getElementById("selectName");
        select.innerHTML = "";
        for(var i=0;i<=count;i++){
            var option = document.createElement("option");
            option.innerHTML = names[i];
            select.add(option);
        }

    });

    view.selectRaceConfirmButtonCallback(function(){

        var select = document.getElementById("selectName");

        if(select.selectedIndex>= 0){
            race =true;
            target = select.selectedIndex;
            // alert(race);
            // alert(target);
        }
    });

    view.setStartConfirmButtonCallback(function () {

        var name = view.getDestinationInput();
        view.clearDestinationInput();
        if(name === null || name === "" || name.length > 15) {
            view.showInputHint(false);
        }else{
            view.initMap();
            view.clearMap();
            model = new ProjectModel();
            view.showInputHint(true);
            $('#startDialog').modal('hide');
            document.getElementById("mapFinishButton").disabled = false;
            document.getElementById("mapStartButton").disabled = true;
            document.getElementById("mapRaceButton").disabled = true;
            model.setRunName(name);

            locationInterval = setInterval(function(){

                view.drawRoute(model.getLocs());
                view.refreshMap();
            }, 1000);
            timeoutInterval = setInterval(_this.checkForTimeout,2000);
            if(race){

                var locs = [];

                var lats = JSON.parse(localStorage.getItem("pathLat"+target));

                var lngs = JSON.parse(localStorage.getItem("pathLng"+target));
                for(var i=0;i<lats.length;i++){
                    locs.push({latitude: lats[i], longitude: lngs[i]});
                }
                var timeS = new Date(JSON.parse(localStorage.getItem("start"))[target]);
                var timeF = new Date(JSON.parse(localStorage.getItem("finish"))[target]);
                var msec = timeF.valueOf() - timeS.valueOf();
                var hh = Math.floor(msec / 1000 / 60 / 60);
                msec -= hh * 1000 * 60 * 60;
                var mm = Math.floor(msec / 1000 / 60);
                msec -= mm * 1000 * 60;
                var intervalTime = msec/locs.length;
                var depth = 0;
                raceInterval = setInterval(function(){
                    if(depth>locs.length){
                        view.drawRace(locs,depth);
                    } else{
                        view.drawRace(locs,depth);
                        depth++;
                    }
                    view.refreshMap();
                }, intervalTime);

            }
            model.initRun();
        }
    });

    view.setFinishButtonCallback(function () {
        model.setInterrupted();
        document.getElementById("mapFinishButton").disabled = true;
        document.getElementById("mapStartButton").disabled = false;
        document.getElementById("mapRaceButton").disabled = false;
        race = false;
        clearInterval(raceInterval);
        clearInterval(locationInterval);
        clearInterval(timeoutInterval);
    });



    this.checkForTimeout = function () {
        if(model.getInterruptedFlag()){
            document.getElementById("mapFinishButton").disabled = true;
            document.getElementById("mapStartButton").disabled = false;
            document.getElementById("mapRaceButton").disabled = false;
            clearInterval(locationInterval);
            clearInterval(timeoutInterval);
            clearInterval(raceInterval);
        }
    };

    this.init = function () {
        view.init();
        view.initMap();
        view.setArmbandCheckbox(false);
        view.load();
    };
}

controller = new ProjectController();
window.addEventListener("load", controller.init);
