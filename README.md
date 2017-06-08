# IotServer

This is a [project submission][iotcup project] for the [IoT Cup][iotcup] and covers data analysis and data visualization of mobile sensor data. 

## Getting Started

This project is seperated into [IotServer][iotserver] and [IotClient][iotclient]. The server is listening on the local network for UDP packages which are send by the [IotClient][iotclient] android application. The IotClient is sending sensor information (accelerometer, gyroscope, magnetic field) which is then processed by the server and stored in a database. The server is serving the visualization of the sensor data at http://localhost:3000, where the data is accessed with [jQuery] via a provided minimal [REST API][restapi]. The visualization is done with the HTML [Canvas][canvas] element and [D3.js][d3].

## Prerequisites

In order to run the code, the following need to be installed

- [Node.js][nodejs]
- [MongoDB][mongodb] 

The following Node packages are used

- [body-parser][body-parser]
- [express][express]
- [mongodb][mongodb-driver]
- [monk][monk]. 

## Install

In order to install the Node packages simpy run
```
npm install
```
## Running

The following command runs the server
```
node index.js
```
A simple UDP server [udp_display.js](udp_display.js) for testing puroses can be run with
```
node udp_display.js
```
which displays all the received packages

## Licence

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


[restapi]: https://en.wikipedia.org/wiki/Representational_state_transfer
[jquery]: https://jquery.com/
[nodejs]: https://nodejs.org/en/
[mongodb]: https://www.mongodb.com/
[body-parser]: https://www.npmjs.com/package/body-parser
[express]: https://www.npmjs.com/package/express
[mongodb-driver]: https://www.npmjs.com/package/mongodb
[monk]: https://www.npmjs.com/package/monk
[iotcup]: http://junior.iotcup.at/
[iotcup project]: http://junior.iotcup.at/projekte/?id=92
[iotclient]: https://github.com/njanakiev/IotClient
[iotserver]: https://github.com/njanakiev/IotServer
[canvas]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
[d3]: https://d3js.org/
