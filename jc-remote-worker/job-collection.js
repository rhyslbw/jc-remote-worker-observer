var remote = DDP.connect('http://localhost:3000/');
var jc = new JobCollection('queueJobs', { connection: remote });


var q = jc.processJobs(
  'logEvent',
  {
    pollInterval: 1000000000, // Don't poll,
  },
  function (job, cb) {

    // This is just simulating an variable running time for the job, up to 4 seconds
    Meteor.setTimeout(function(){
      // This simulates a random failure of the job
      if (Math.random() > 0.5) {
        console.log('Job ' + job._doc._id + ' Failed', job.data.date, job.data.event);
        job.fail();
      } else {
        console.log('Job ' + job._doc._id + ' Done', job.data.date, job.data.event);
        job.done();
      }
    }, Math.round(Math.random() * 4000));
    cb();
  }
);

remote.onReconnect = function () {
  var self = this;
  console.log('CONNECTED');

  self.call( 'login',
    {
      user: {email: 'remote@worker.com'},
      password: { digest: SHA256(process.env.JC_SERVER_PASSWORD), algorithm: 'sha-256'}
    },
    function(error, result) {
      console.log('AUTHENTICATED');
      self.subscribe('queueJobs', function () {
        console.log('SUBSCRIBED');
        // Observes jobs ready to be worked on, including failed jobs becoming ready again. added refers to the doc being added to the results set, not just new inserts
        jc.find({type: 'logEvent', status: 'ready'})
          .observe({
            added: function () {
              console.log('OBSERVED ADDED MSG. Collection now totals', jc.find().count(), 'Triggering worker');
              q.trigger();
            }
          });
      });
    });
}
