jc = new JobCollection('queueJobs');

jc.allow({
  admin: function (userId, method, params) {
    return (userId ? true : false);
  }
});

if(Meteor.users.find().count() === 0) {
  Accounts.createUser({
    email: 'test@email.com',
    password: "password"
  });
}

if(jc.find().count() !== 0) {
  jc.remove({}, function(error, result){
    if(!error)
      console.log('Collection reset. ' + result + ' existing job documents removed');
  });
}

Meteor.startup(function () {

  jc.startJobServer({},function(error, result){
    if(!error){

      console.log('Job Server Started. Here comes a new job every 3 seconds');

      Meteor.setInterval(function(){
        var job = jc.createJob('logEvent', { event: 'Interval on jobServer elapsed', date: new Date() } );
        job.priority('normal').save();
        console.log('Total Jobs:', jc.find().count());
      }, 3000);

      Meteor.publish('queueJobs', function(){
        return jc.find();
      });

    } else {
      console.log("Job Server didn't start");
    }
  });

});