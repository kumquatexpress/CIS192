codiphy
=======

Online collaborative software planning.

General Idea: 
Plan software with other people through an easy to use online interface that allows for simultaneous changes in a manner similar to Google Docs.  Acts as a better substitute for UML and other similar tools for describing interactions between the design of software.  (Python implementation of a partially working concept done at PennApps)

Specific Goals:
Set up a webserver on EC2 with the correct packages and have Flask running on top of nginx: http://flask.pocoo.org/docs/deploying/uwsgi/#starting-your-app-with-uwsgi
Integrate a working NoSQL database (Mongo, DynamoDB, Cassandra) into our application as both a convenience and a learning opportunity
Automatically scaffold code based on the class diagram and any underlying methods/attributes present
Use javascript libraries to graphically diagram applications in the form of CRC cards with arrows representing relationships

Using websockets, automatically update the app for all users in a team at the same time without refreshing the page

Make the app as light as possible, eliminate any overhead that doesn’t have a use; be pythonic


Team Members:
Boyang Niu, David Xu, Patrick Hulce

Division of labor:
Front-End - General
Front-End - Graphical Representation
Database Interaction
WebSocket/Client Interaction

Packages:
Flask (to serve the pages)
Socket.IO (https://github.com/abourget/gevent-socketio, http://socket.io/) (to process updates)
MongoDB ORM (MongoKit, MongoEngine)

jQuery
