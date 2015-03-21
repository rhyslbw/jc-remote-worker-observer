jc = new JobCollection('queueJobs');

jc.remove({});
Meteor.users.remove({});
Accounts.createUser({
  email: 'remote@worker.com',
  password: "password"
});

jc.setLogStream(process.stdout);

// Remote worker must be authenticated
jc.allow({
  worker: function (userId, method, params) {
    return (userId ? true : false);
  }
});

Meteor.startup(function () {

  jc.startJobServer({},function(error, result){
    if(!error){

      console.log('Job Server Started. A new job will be created up to 8 seconds apart');

      // This is just simulating an event that creates a job at a random interval.
      (function loop() {
        var randomInterval = Math.round(Math.random() * 8000);
        Meteor.setTimeout(function() {

          var job = jc.createJob('logEvent', { event: 'New job in queue after an interval of ' + randomInterval + ' milliseconds', date: new Date() } );

          // Retry forever, wait 1 second in between attempts
          job.priority('normal').retry({wait: 1000}).save();
          console.log('Total Jobs:', jc.find().count());

          loop();
        }, randomInterval);
      }());

      Meteor.publish('queueJobs', function(){
        return jc.find();
      });

    } else {
      console.log("Job Server didn't start");
    }
  });

});