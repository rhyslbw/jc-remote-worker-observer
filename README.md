# jc-remote-worker-observer
Demonstration of a remote server-based [Job-Collection](https://github.com/vsivsi/meteor-job-collection/) worker

Inside there are two Meteor apps, jc-server and jc-worker. Documentation is inline

## Installation:

1. `git clone --recurse https://github.com/rhyslbw/jc-remote-worker-observer.git`
2. Start the server on the default port 3000
3. Start the remote worker on any other port, exporting an ENV variable JC_SERVER_PASSWORD='password' eg `export JC_SERVER_PASSWORD='password'; meteor -p 3100`

###jc-server:
- Creates a JobCollection
- Clears out any previous job documents and users for a fresh run
- Creates a user for the worker to authenticate, satisfying the allow rules.
- Creates a new job up to 8 seconds apart.
- Publishes the cursor

###jc-worker
- Uses the internal [SHA package](https://atmospherejs.com/meteor/sha) for hashing the password.
- connects via DDP.connect to the server and authenticates, reading in the password from an environment variable.
- sets up the remote collection, and observes it for added and changed messages to trigger the worker function.
- The worker prints two fields from the job data properties object to the console.

See [this GitHub issue](https://github.com/vsivsi/meteor-job-collection/issues/59) for the background to this demo, including [more information on security](https://github.com/vsivsi/meteor-job-collection/issues/59#issuecomment-74011582) when your apps are not on a private subnet.