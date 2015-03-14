var jc = JobCollection('queueJobs');

jc.allow({
  admin: function (userId, method, params) {
    return true;
  }
});

Meteor.startup(function () {

  if(Meteor.users.find().count() === 0) {
    Accounts.createUser({
      email: 'test@email.com',
      password: "password"
    });
  }

  var job = jc.createJob('testJobType', { message: 'Hello' } );
  job.priority('normal').save();

  jc.startJobServer({},function(error, result){
    if(!error){
      console.log('Job Server Started');
    } else {
      console.log("Job Server didn't start");
    }
  });

});