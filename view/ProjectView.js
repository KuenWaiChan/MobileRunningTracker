"use strict";

function ProjectView() {
    var mapScreen = document.getElementById("mapScreen"),
        settingsScreen = document.getElementById("settingsScreen"),
        statsScreen = document.getElementById("statsScreen"),

        map = document.getElementById("map"),
        navMap = document.getElementById("navMap"),
        navStats = document.getElementById("navStats"),
        navSettings = document.getElementById("navSettings"),
        menuMapButton = document.getElementById("menuMap"),
        menuSettingsButton = document.getElementById("menuSettings"),
        menuStatsButton = document.getElementById("menuStats"),
        pedoLabel = document.getElementById("pedoCount"),
        pedoToggle = document.getElementById("pedometerToggle"),
        startButton = document.getElementById("mapStartButton"),
        finishButton = document.getElementById("mapFinishButton"),
        startCancelButton = document.getElementById("mapStartCancelButton"),
        startConfirmButton = document.getElementById("mapStartConfirmButton"),
        addressInputBox = document.getElementById("destinationInput"),
        raceButton = document.getElementById("mapRaceButton"),
        mapRaceConfirmButton = document.getElementById("mapRaceConfirmButton"),
        armbandToggle = document.getElementById("armbandToggle"),
        resetButton = document.getElementById("resetButton"),
        statsTable = document.getElementById("statsTableBody");


    this.setMenuMapCallback = function (callback) {
        menuMapButton.addEventListener("click", callback);
    };
    this.setPedoToggleCallback = function (callback) {
        pedoToggle.addEventListener("change", callback);
    };
    this.setMenuSettingsCallback = function (callback) {
        menuSettingsButton.addEventListener("click", callback);
    };

    this.setMenuStatsCallback = function (callback) {
        menuStatsButton.addEventListener("click", callback);
    };

    this.setArmbandToggleCallback = function (callback) {
        armbandToggle.addEventListener("change", callback);
    };

    this.setResetButtonCallback = function (callback) {
        resetButton.addEventListener("click", callback);
    };
    this.setRaceButtonCallback = function(callback){
        raceButton.addEventListener("click", callback);
    };

    this.selectRaceConfirmButtonCallback = function(callback){
        mapRaceConfirmButton.addEventListener("click", callback);
    };

    this.setStartConfirmButtonCallback = function (callback) {
        startConfirmButton.addEventListener("click", callback);
    };

    this.clearDestinationInput = function (){
        addressInputBox.value="";
    };

    this.getDestinationInput = function () {
        return(addressInputBox.value);
    };

    this.setStartCancelCallback = function (callback) {
        startCancelButton.addEventListener("click", callback);
    };

    this.setFinishButtonCallback = function (callback) {
        finishButton.addEventListener("click", callback);
    };
    this.changeToMap = function (coords) {
        mapScreen.style.display = "block";
        settingsScreen.style.display = "none";
        statsScreen.style.display = "none";
        navMap.classList.add("activeTab");
        navSettings.classList.remove("activeTab");
        navStats.classList.remove("activeTab");
    };

    this.showInputHint = function (correct) {
        if (!correct) {
            addressInputBox.style.backgroundColor = "#FFCD28";
        } else {
            addressInputBox.style.backgroundColor = "transparent";
        }

    };
    this.changeToSettings = function () {
        mapScreen.style.display = "none";
        settingsScreen.style.display = "block";
        statsScreen.style.display = "none";

        navMap.classList.remove("activeTab");
        navSettings.classList.add("activeTab");
        navStats.classList.remove("activeTab");
    };

    this.changeToStats = function () {
        this.load();
        mapScreen.style.display = "none";
        settingsScreen.style.display = "none";
        statsScreen.style.display = "block";

        navMap.classList.remove("activeTab");
        navSettings.classList.remove("activeTab");
        navStats.classList.add("activeTab");
    };

    this.setArmbandCheckbox = function (checked){
        armbandToggle.checked = (checked === true);
    };

    this.initMap = function () {

        map = new GMaps({
            div: '#map',
            zoom: 16,
            lat: 0,
            lng: 0,
            disableDefaultUI: true
        });

        GMaps.geolocate({
            success: function(position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
                map.addMarker({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    title: 'You are here!'
                });
            },
            error: function(error) {
                alert('Geolocation failed: ' + error.message);
            },
            not_supported: function() {
                alert("Your browser does not support geolocation");
            },
            always: function() {

            }
        });
    };

    this.drawRoute = function (locs) {
        console.log("testc");
        console.log(locs);
        if(locs.length > 0) {
            var actualPath = [];

            for (var i = 0; i < locs.length; i++) {
                var temp = [locs[i].latitude, locs[i].longitude];
                actualPath.push(temp);
            }
            map.drawPolyline({
                path: actualPath,
                strokeColor: '#131540',
                strokeOpacity: 0.6,
                strokeWeight: 6
            });

        }
    };
    this.clearMap = function(){
        map.removePolylines();
        map.refresh();
    };
    this.refreshMap = function(){
        map.refresh();
    };
    this.drawRace = function(locs, depth) {
        console.log("testa");
        console.log(locs);
        console.log(depth);
        if(locs.length > 0) {
            console.log("testb");
            // alert("test");
            var actualPath = [];

            for (var i = 0; i < depth; i++) {
                var temp = [locs[i].latitude, locs[i].longitude];
                actualPath.push(temp);
            }

            map.drawPolyline({
                path: actualPath,
                strokeColor: '#40070b',
                strokeOpacity: 0.6,
                strokeWeight: 6
            });
        }
    };

    this.load = function () {
        var count, timeS, timeF, name;

        statsTable.innerHTML= "";
        if(typeof(localStorage) !== "undefined"){

            count = localStorage.getItem("count");
            if(count != undefined){
                for(var i = 0; i <= count; i++){
                    var row = statsTable.insertRow(statsTable.rows.length),
                        cell0 = row.insertCell(0),
                        cell1 = row.insertCell(1),
                        cell2 = row.insertCell(2);
                    timeS = new Date(JSON.parse(localStorage.getItem("start"))[i]);
                    timeF = new Date(JSON.parse(localStorage.getItem("finish"))[i]);
                    name = JSON.parse(localStorage.getItem("names"))[i];
                    cell0.innerHTML = timeS.toString().substr(0,15);
                    cell1.innerHTML = name;
                    var msec = timeF.valueOf() - timeS.valueOf();
                    var hh = Math.floor(msec / 1000 / 60 / 60);
                    msec -= hh * 1000 * 60 * 60;
                    var mm = Math.floor(msec / 1000 / 60);
                    msec -= mm * 1000 * 60;
                    var ss = Math.floor(msec / 1000);
                    if(hh<10){
                        hh="0"+hh;
                    }
                    if(mm<10){
                        mm="0"+mm;
                    }
                    if(ss<10){
                        ss="0"+ss;
                    }
                    cell2.innerHTML = hh+":"+mm+":"+ss;
                }
            }

        }

    };

    this.setCounter = function (int) {
        if (int > -1) {
            pedoLabel.innerHTML = "Steps: " + int;
        }else {
            pedoLabel.innerHTML = "Steps: Disabled";
        }


    };
    this.init = function () {
        window.onload = function () {
            document.getElementById("urlspan").innerHTML = window.location.protocol + "//" + window.location.host + window.location.pathname;
        };
    };
}
