couchdb-logger-service
======================

[![Build Status](https://travis-ci.org/Magomogo/couchdb-logger-service.png)](https://travis-ci.org/Magomogo/couchdb-logger-service)

Restful event logging service

Installation
------------

    git clone https://github.com/Magomogo/couchdb-logger-service.git
    cd couchdb-logger-service
  
Optional step, configure:
  
    cp ./config.dist.json ./config.json
    vi ./config.json
  
  
Install with npm

    npm install
    
Usage
-----

Webinterface is located at http://127.0.0.1:5984/logger-application/_design/main/_rewrite/

To record an event just POST it to http://127.0.0.1:5984/logger-application/_design/main/_rewrite/new as JSON. Note
that "message" and "channel" are mandatory values. Each event will be marked with current timestamp.

