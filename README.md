# Define your own games for Pinball 2000 plattform

[![Build Status](https://drone.io/github.com/amitevski/FlipperApp/status.png)](https://drone.io/github.com/amitevski/FlipperApp/latest)
[![Coverage Status](https://img.shields.io/coveralls/amitevski/FlipperApp.svg)](https://coveralls.io/r/amitevski/FlipperApp)

## Limitations

### Only runs on Linux

We are using parport2 low-level driver, which is only available for linux.

## Installation

### Libraries

1. for new ubuntu follow the instructions at https://github.com/rogerwang/node-webkit/wiki/The-solution-of-lacking-libudev.so.0
1. ```sudo npm install -g grunt-cli bower```
1. ```npm install```
1. ```npm run-script install-deps```
1. because we use compass for frontend we need ruby and compass
    1. ```sudo apt-get install ruby```
    1. ```gem install compass```
1. in node-webkit native addons have to be built manually
    1. ```sudo npm install -g nw-gyp```
    1. ```cd src/app/node/node_modules/FlipperDriver/node_modules/parport2```
    1. ```nw-gyp configure --target=0.11.2```
    1. ```nw-gyp build```

### Build

1. ```grunt build```
1. The executables can be found at ```dist/releases/Pinball2000```

### Run

Execute the generated executable with sudo.
We need root privileges in order to access the parallel port.


## Run Tests

1. ```grunt hub:test```
