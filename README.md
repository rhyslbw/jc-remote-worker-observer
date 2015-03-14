# jc-remote-worker-observer
Demonstration of an issue with Job-Collection and a remote Meteor worker

Inside there are two Meteor apps, Server and Remote Worker. The dev branch of job-collection and job have been cloned and added to the projects.

To reproduce:
1. Clone repo
2. Start the server on the default port 3000
3. Start the remote worker on any other port.

The server app creates a user and a job.
The worker:
- connects via DDP.connect to the server and authenticates
- sets up the collection, and observes it for additions to trigger the worker

