$(function() {
  app.init();
})

var app = {
  server : "http://127.0.0.1:3000/classes/messages",

  init : function() {
    app.username = window.location.search.substr(10);

    //cache a reference to the dom... so we can reuse continually
    app.$text = $('#message');

    // setInterval( function() {
    //   app.loadMessages();
    // }, 1000)
    app.loadAllMessages();

    $('#messageForm').on('submit', app.handleSubmit)
  },

  handleSubmit : function(e) {
    e.preventDefault();
    // debugger
    var $form = e.target;
    var message = {
      'username': app.username,
      'text': app.$text.val()
      // 'roomname': '4chan'
    };
    app.sendMessage(message);
  },

  loadAllMessages : function() {
    console.log("Refreshing DOM...")
    app.loadMessages();
    setTimeout(app.loadAllMessages, 2000)
  },

  renderMessage : function(message) {
    var $user = $('<div>', {class : 'user'}).text(message.username);
    var $text = $('<div>', {class : 'text'}).text(message.text);
    var $message = $('<div>', {class : 'chat', 'data-id': message.objectId }).append($user, $text);
    return $message;
  },

  addToDom : function(message) {
    if ( $('#chats').find('.chat[data-id=' + message.objectId+ ']').length === 0 ) {
      var $html = app.renderMessage(message);
      console.log("Never been here before")
      $('#chats').prepend($html);
    } else {
      console.log("This item is on the page")
    }
  },

  processMessages : function(messages) {
    // $('#chats').empty();

    for (var i = messages.length; i > 0; i--) {
      //create html nodes
      app.addToDom(messages[i -1]);
    }
  },

  loadMessages : function() {
    // app.startSpinner();
    $.ajax({
      url: app.server,
      type: 'GET',
      data: {order: '-createdAt'},
      contentType : 'application/json',
      success: function (json) {
        console.log("this is get")
        console.log(json)
        // console.log(json.results);
        app.processMessages(json.results)
        // var messages = parseJSON(data);
        // drawMessages(messages);
        // drawRefreshButton();
      },
      // error: function(data) {
      //   console.log("Error")
      // }
      complete: function() {
        // app.stopSpinner();
      }
    })
  },

  sendMessage : function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType : 'application/json',
      success: function (json) {
        console.log("This is JSON")
        console.log(json);
        message.objectId = json.objectId;
        app.addToDom(message);
      },
      // error: function(data) {
      //   console.log("Error")
      // }
      complete: function() {
        // app.stopSpinner();
      }
    })
  }
}



// var message = {
//   'username': 'shawndrost',
//   'text': 'trololo',
//   'roomname': '4chan'
// };



// var parseJSON = function(data) {
//   var messages = [];
//   for (var key in data) {
//     var results = data[key];
//     for (var i in results) {
//       var message = results[i].text;
//       messages.push(message);
//     }
//   }
//   return messages;
// }

// var getMessages = function() {
//   $.ajax({
//     url: 'https://api.parse.com/1/classes/chatterbox',
//     type: 'GET',
//     data: JSON.stringify(message),
//     contentType : 'application/json',
//     success: function (data) {
//       var messages = parseJSON(data);
//       drawMessages(messages);
//       drawRefreshButton();
//     },
//     error: function(data) {
//       console.log("Error")
//     }
//   });
// }

// var drawMessages = function(messages) {
//   // var $button = $('<button/>')[0];
//   var $messageDiv = $('#chats')[0];
//   $($messageDiv).empty();
//   var $h1 = $('<h1>chatterbox</h1>');
//   $($messageDiv).append($h1);
//   for (var i = 0; i < messages.length; i++) {
//     var $message = $('<p/>')[0];
//     $($message).text(messages[i])
//     $($messageDiv).append($message);
//   }
// }

// var drawRefreshButton = function() {
//   var $button = $('<button/>')[0];
//   $($button).addClass("refresh");
//   $($button).text("Refresh");
//   var $messageDiv = $('#chats')[0];
//   $($messageDiv).prepend($button);
// }

// $('#chats').on('click', 'button.refresh', function() {
//   console.log("Refreshing...");
//   getMessages();
// })


// getMessages();
// drawRefreshButton();



// $.ajax({
//   // always use this url
//   url: 'https://api.parse.com/1/classes/chatterbox',
//   type: 'POST',
//   data: JSON.stringify(message),
//   contentType: 'application/json',
//   success: function (data) {
//     console.log('chatterbox: Message sent');
//   },
//   error: function (data) {
//     // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
//     console.error('chatterbox: Failed to send message');
//   }
// });