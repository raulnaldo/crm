// replace these values with those generated in your TokBox Account
var apiKey = '46432412';
var sessionId = '1_MX40NjQzMjQxMn5-MTU3MDA5MTMwNzI3NX5BR3BneStMM21GVUxoNGhma3VGQnA4S1V-fg';
var token = 'T1==cGFydG5lcl9pZD00NjQzMjQxMiZzaWc9ZTQ2MTU3NGE0NjdhZDFkODExYTBjNDM3ZThmNWQwYTFhNDYxMWFhMzpzZXNzaW9uX2lkPTFfTVg0ME5qUXpNalF4TW41LU1UVTNNREE1TVRNd056STNOWDVCUjNCbmVTdE1NMjFHVlV4b05HaG1hM1ZHUW5BNFMxVi1mZyZjcmVhdGVfdGltZT0xNTcwMDkxMzQ3Jm5vbmNlPTAuNzI5Mzg5OTY1NDQyOTI1NyZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTcyNjgzMzQ3JmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

// Handling all of our errors here by alerting them
function handleError(error) {
    if (error) {
      alert(error.message);
    }
  }
  
  // (optional) add server code here
  initializeSession();
  
  function initializeSession() {
    var session = OT.initSession(apiKey, sessionId);

    var myPublisherStyle={};
    myPublisherStyle.audioLevelDisplayMode="off";


    // Subscribe to a newly created stream
    session.on('streamCreated', function(event) {
      session.subscribe(event.stream, 'subscriber', {
        insertMode: 'append',
        width: '100%',
        height: '100%',        
        insertDefaultUI: true, 
        showControls: false,
        style: myPublisherStyle              
      }, handleError);
    });
  
    // Create a publisher o camara espejo


    var publisher = OT.initPublisher('publisher', {
      insertMode: 'append',
      width: '100%',
      height: '100%',      
      insertDefaultUI: true, 
      showControls: true,
      style: myPublisherStyle      
    }, handleError);
  
    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, initialize a publisher and publish to the session
      if (error) {
        handleError(error);
      } else {
        session.publish(publisher, handleError);
      }
    });
  }