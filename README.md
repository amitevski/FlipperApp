# Define your own games for Pinball 2000 plattform

[![Build Status](https://drone.io/github.com/amitevski/FlipperApp/status.png)](https://drone.io/github.com/amitevski/FlipperApp/latest)

## Limitations

### Only runs on Linux

We are using parport2 low-level driver, which is only available for linux.

## Installation

### Libraries

1. for new ubuntu follow the instructions at https://github.com/rogerwang/node-webkit/wiki/The-solution-of-lacking-libudev.so.0
1. ```npm install -g grunt-cli bower```
1. ```npm install```
1. ```npm run-script install-deps```

### Build

1. ```grunt nodewebkit```
1. The executable can be found at ```dist/releases/Pinball2000```

### Run

Execute the generated executable with sudo.
We need root privileges in order to access the parallel port.


## Run Tests

1. ```grunt hub:test```