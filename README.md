# jc-remote-worker-observer
Demonstration of an issue with Job-Collection and a remote Meteor worker

Inside there are two Meteor apps, Server and Remote Worker. The dev branch of job-collection and job have been cloned and added to the projects.

To reproduce:

1. git clone --recurse https://github.com/rhyslbw/jc-remote-worker-observer.git
2. Start the server on the default port 3000
3. Start the remote worker on any other port.

The server app:
- Creates a JobCollection
- Creates a user if required
- Clears out any previous job documents
- Creates a new job every 3 seconds
- Publishes the cursor

The worker (server-only):
- connects via DDP.connect to the server and authenticates
- sets up the remote collection, and observes it for added messages to trigger the worker.
- The worker prints two fields from the job data properties object to the console.


