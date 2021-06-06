# CoWIN Vaccine Slot Search

A super simple Vaccine search application, will give you OS notification when a slot is available per your preference! I know that only tech folks will be able to use this, infact my intended audience was the same. During you working hours, you may leave this running behind the scene, you may act when you see an alert popping out. I am assuming this shoudl be a tad bit faster than the Telegram alerts, see if it's useful. 

## Setup

- Install Node.js

## Configuration
Reviwe the config.json File, you may configure the following.
### District ID
- Get the State IDs & the district IDs from Co-WIN using the APIs. You may use the postman collection available in the repo.
- Co-WIN API https://apisetu.gov.in/public/api/cowin/cowin-public-v2
### Pin codes
- Configure one or more Pincodes for the given district. Please be sure to use the valid pincodes which belong to your district, you may leave it blank to keep the search district wide. I often find the success with specific alerts for 3-4 Pincodes, hence thought it could be useful for you guys.
### Min Age Limit
- Leave it default if you wish to see alerts for all age groups
### Vaccines
- Add remove your preference, the names should be what we have in the API

## How to Run
- npm init (This would initialize the project)
- node index.js (Run this from the project root folder)
-- This will initiate a cron job which will run for ever. The job will fire the Co-WIN Public APIs in every 4 seconds, the API spec requesting to limit max 100 calls per 5mt, so we are making about 75 calls. Feel free to update the cron, but mkae sure you don't abuse the system.
-- You shoudl see an alert popping on your Windows/Mac/Linux, i.e whenever there's a slot available matching to your search criteria. Mac guys should look at the Notification centre, alternately you should see the details of the Vaccine slot being displayed on the console where you are running your Node program.

## Notification
![Alt text](./notification.png?raw=true "Mac Notification Centre")
