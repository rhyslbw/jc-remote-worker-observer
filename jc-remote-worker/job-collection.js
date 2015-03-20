var remote = DDP.connect('http://localhost:3000/');
remote.call('login', { user: { email: 'test@email.com'},  password: 'password' });

var jc = new JobCollection('queueJobs', { connection: remote });

remote.subscribe('queueJobs', function(){
  console.log('Total Documents in remotely managed collection:', jc.find().count());
});

Meteor.startup(function(){

  var q = jc.processJobs(
    'logEvent',
    {
      pollInterval: 1000000000, // Don't poll,
    },
    function (job, cb) {
      console.log(job.data.date, job.data.event);
      job.done();
      cb();
    }
  );

  jc.find({ type: 'logEvent', status: 'ready' })
    .observe({
      added: function() {
        console.log('Observed doc added to collection. Triggering worker')
        q.trigger();
      }
    });


});