var remote = DDP.connect('http://localhost:3000');
remote.call('login', { user: { email: 'test@email.com'},  password: 'password' });

jc = new JobCollection('queueJobs', {ddp: remote});
console.log('Documents in collection', jc.find().count());

Meteor.startup(function(){

  var q = jc.processJobs(
    'testJobType',
    {
      pollInterval: 1000000000, // Don't poll,
    },
    function (job, cb) {
      console.log(job.data.message);
      job.done();
      cb();
    }
  );

  jc.find({ type: 'testJobType', status: 'ready' })
    .observe({
      added: function() {
        q.trigger();
      }
    });
});