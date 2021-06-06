const cron = require('node-cron');
const express = require('express');
const fetch = require('node-fetch');
var dateFormat = require("dateformat");
const notifier = require('node-notifier');
const path = require('path');
const fs = require('fs');
var config = require("./config");

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var format = require('date-format');

console.log('TODAY::'+format('dd-MM-yyyy', new Date()));
console.log('Polling CoWin API Every 4 seconds, so 75 calls per 5mts');
const theday = format('dd-MM-yyyy', new Date());
const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id="+config.district_id+"&date="+theday;
const settings = { method: "Get" };

// ...
// 683576,682016,683580,682041,683101,682041
const app = express();

// Schedule tasks to be run on the server.
cron.schedule('*/4 * * * * *', function() {
  
    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        
        var centers = json.centers;
        
        centers.forEach(center => {

            var sessions = center.sessions;
            sessions.forEach(element => {
              if(element.available_capacity>0 && config.min_age_limit.includes(element.min_age_limit) && config.vaccines.includes(element.vaccine)){
              
                let showNotification = false;

                if(config.pincodes.length <= 0 && !localStorage.getItem(element.session_id)){
                  showNotification = true;
                }
                //filter for the PIN code per config, else show everything per district
                if(config.pincodes.length > 0 && config.pincodes.includes(center.pincode) && !localStorage.getItem(element.session_id)){
                    showNotification = true;
                }

                if(showNotification){
                    localStorage.setItem(element.session_id,element.available_capacity);
                    console.log(center.name+"\n"+
                    center.pincode+"\n"+
                    center.block_name+"\n");
                    console.log(element);
                    const notification= center.name+"-"+center.pincode+"\n"+element.vaccine+" Total Slots:"+element.available_capacity+"\n"+"Dose 1:"+element.available_capacity_dose1+" Dose 2:"+element.available_capacity_dose2;
                    //console.log(notification); 

                    notifier.notify(
                      {
                        title: 'CoWIN Alert',
                        message: notification,
                        icon: path.join(__dirname, 'covid19logo.jpeg'), // Absolute path (doesn't work on balloons)
                        sound: true, // Only Notification Center or Windows Toasters
                        wait: true, // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                        timeout: 20
                      },
                      function (err, response, metadata) {
                        console.log(response, metadata);
                      }
                    );
                }
                
            }
            });
            
        });
    });
  });

app.listen(3000);