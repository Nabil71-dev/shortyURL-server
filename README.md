![shorty](https://github.com/Nabil71-dev/shortyURL-server/assets/69987319/4719be25-8e6d-4f16-b0ed-66d557d1db6e)

## Add env
* replace .env.example file to .env for firebase auth and other credentials

## Install all the libraries and dependencies and run
```bash
npm install
npm start
```

## Overview
It's a simple URL shortner project which I created to utilize my recent learnings and tricks

## Features 
###### Current version
 * Token based auth (with access and refresh token)
 * SLS lemda function for URL validation check
 * URL create by user for fixed time
 * LRU cache for url access
 * CRON-job to cover daily limit
 * User and URL manage from admin side
 * URL, user analytics 
###### Next version
 * custom alais set
 * Req limit

###### Technologies and methologies
* ExpressJs,
* JWT, (access token & refresh token)
* CRON-job, 
* Redis cache, 
* Seeding, 
* ORM (mongoose), 
* SLS function, 
* bcrypt, 

## how it works flow-chart
![flow-chart](https://github.com/Nabil71-dev/shortyURL-server/assets/69987319/df2047fe-f411-48fc-b3e2-825b7e5af576)
