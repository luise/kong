[![Build Status](https://travis-ci.org/kelda/kong.svg?branch=master)](https://travis-ci.org/kelda/kong)

# Using Kelda to Launch the Kong Gateway

[Kelda](http://docs.kelda.io) makes it easy to launch and manage a
[Kong](https://getkong.org/) gateway on any cloud provider.  This repositary
contains an example Kelda blueprint which describes how to start a colleciotn
of Kong Gateways.  Once you have [installed
Kelda](http://docs.kelda.io/#quick-start) you can launch collection of Kong
gateways by simply running:

```console
$ kelda run ./sparkRun.js
```

More details on installation and configuration of this blueprint below.

## Download the blueprint in this repository

Start by cloning this repository and installing the necessary dependencies:

```console
$ git clone https://github.com/kelda/kong.git
$ cd kong
$ npm install .
```

## Launch a collection of Kong gateways

First start a Kelda daemon:

```console
$ kelda daemon
```

The daemon is a long-running process, so you'll need to run future commands in
a new window (to learn more about the daemon, refer to
the [Kelda documentation](http://docs.kelda.io)).

The Kelda blueprint in `keldaRun.js` will start an example collection of Kong
gateways using your default base infrastructure.  If you haven't done so
already, create a default base infrastructure:

```console
$ kelda init
```

For more about creating a Kelda base infrastructure, refer to the
[Kelda docs](http://docs.kelda.io).

Finally, run the example Kong blueprint:

```console
$ kelda run ./kongRun.js
```

This will use the blueprint `kongExample.js` to launch the Kong gateways. It
will take a bit for the VMs to boot up, for Kelda to configure the network, and
for Docker containers to be initialized. The command `kelda show` provides
useful information about the VMs and containers in the deployment.  Once
everything is up, the `kelda show` output will look something like this:

```console
MACHINE         ROLE      PROVIDER    REGION       SIZE         PUBLIC IP        STATUS
i-0b30451866    Master    Amazon      us-west-1    m4.xlarge    54.241.166.50    connected
i-09de1f5fb0    Worker    Amazon      us-west-1    m4.xlarge    18.144.73.195    connected
i-05dc503277    Worker    Amazon      us-west-1    m4.xlarge    54.193.77.46     connected

CONTAINER       MACHINE         COMMAND                HOSTNAME    STATUS     CREATED              PUBLIC IP
0d9a21d2e070    i-05dc503277    postgres:9.5           postgres    running    About an hour ago
f1924c55d5cb    i-05dc503277    kong                   kong2       running    44 minutes ago       54.193.77.46:[80,8444,443,8001]

b3a5df901769    i-09de1f5fb0    kong sh -c kong ...    migrator    running    44 minutes ago
b3c53b99877d    i-09de1f5fb0    kong                   kong        running    44 minutes ago       18.144.73.195:[80,443,8001,8444]
```

At this point, the gateways should be available on port 80 of the public IP
reported in the kelda show output.

### Caveat
Note the example blueprint uses a Postgres container hosted on Kelda for the
Kong database.  In production, you'll want to use a database backed by
persistent storage to avoid losing data.  In this case, you should tweak
kongRun.js to point at Amazon RDS, or some other professionally managed
Postgres instance.

Also, note.  This is a work in progress.  Please file issues, and [contact
us](kelda.io) with feedback.
