var pageSchetchik = 0;
window.vkApiVersion = 5.80;
window.offsetVal = 0;
window.firstGettingMessage = true;
if (localStorage.getItem('token') !== undefined) {
  $("#token").val(localStorage.getItem('token'));
  window.token = $("#token").val();
  startA();
}
else {
$('#parseFriendsButton').click(function() {
  localStorage.setItem('token', window.token);
  startA();
});
}
//функции


function sendMessage() {
  var user_id = window.user_id1;
  var text = $('.chatInput').val();
  console.log($('.chatInput'));
  $.ajax({
    url: "https://api.vk.com/method/messages.send",
    data: {
      access_token: window.token,
      user_id: user_id,
      message: text,
      v: window.vkApiVersion,
    },
    dataType: 'jsonp'
  })
  getMessages;
  $('.chat').scrollTop($('.chat')[0].scrollHeight);
}

function buttonCreate() {
  for (var i = 1; i <= window.pageSchetchik; i++) {
    $('<button>', {
      id: i,
      text: i,
      click: function(id) {
        $('.added').remove();
        window.offsetVal = (id.currentTarget.id - 1) * 10;
        addFriends();
      }
    }).appendTo('#parseFriendsButton');
  }
}

function addFriends() {
$.ajax({
  url: "https://api.vk.com/method/friends.get",
  data: {
    access_token: window.token,
    user_id: window.userId,
    v: window.vkApiVersion,
    count: 10,
    offset: window.offsetVal,
    fields: "nickname,photo_200",
    order: "hints",
    },
    dataType: 'jsonp',
  }).done(function(result) {
      for (window.schetchik = 0; window.schetchik < 10; window.schetchik++) {
        var elem = $("#friends").append($("<div class='row'>").append($("<div class='row'>")
          .append($("<div class='col added'>").append(result.response.items[window.schetchik].first_name))
          .append($("<div class='col added'>").append(result.response.items[window.schetchik].last_name))
          .append($("<div class='col added'>").append(result.response.items[window.schetchik].id)))
            .append($("<div class='row'>")
            .append($("<div class='col added'>").append($("<img class='rounded-circle avatar'>").attr('src', result.response.items[window.schetchik].photo_200)))
            .append($("<div class='col added'>").append($("<button type=button class='btn btn-sm'>").text('Открыть чат').click(openChat))
                   )
                ))
    }
  })
}

function startA() {
$.ajax({
  url: "https://api.vk.com/method/users.get",
  data: {
    access_token: localStorage.getItem('token'),
    v: window.vkApiVersion,
  },
  dataType: 'jsonp',
}).done(function(result) {
  window.userId = result.response[0].id;
});

$.ajax({
  url: "https://api.vk.com/method/friends.get",
  data: {
    access_token: localStorage.getItem('token'),
    user_id: window.userId,
    v: window.vkApiVersion,
    count: 10,
    fields: "nickname,photo_200",
    order: "hints"
  },
  dataType: 'jsonp'
}).done(function(result) {
  window.userCountFriends = result.response.count;
  window.pageSchetchik = Math.ceil(userCountFriends / 10);
  buttonCreate();
});
 addFriends();
}
function openChat(){
window.firstGettingMessage = true;
$('.addedChat').remove();
var name = $($(this).parent().parent().parent().find("div")[1])[0].outerText;
window.user_id1 = $($(this).parent().parent().parent().find("div")[3])[0].outerText;
setInterval(getMessages,5000); 

var elem2 = $('.chatField').append($("<div class='row addedChat'>").append($("<div class='col chat addedChat'>").text(getMessages)))
  .append($("<div class='row addedChat'>").append($("<div class='col addedChat'>").text(name))
    .append($("<input class='addedChat chatInput'>")).append($("<button class='btn addedChat'>").text('Отправить').click(sendMessage))
    .append($("<div class='col addedChat'>").append($("<img class='rounded-circle avatar addedChat'>").attr('src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Gay_flag.svg/512px-Gay_flag.svg.png'))))
$('.chat').scrollTop($('.chat')[0].scrollHeight);
}
function getMessages(){
$.ajax({
  url: "https://api.vk.com/method/messages.getHistory",
  dataType: 'jsonp',
  data: {
    user_id: window.user_id1,
    v: window.vkApiVersion,
    access_token: window.token,
    count: 40,
    fields: "first_name,last_name",
  }
}).done(function(result){
  result.response.items.reverse();
  var chatBox = [];
  $.each(result.response.items , function(a,message){
    var messageBox;
    if (message.from_id != window.userId){
      messageBox = $('<div class="user">').text('Собеседик');
    }else{
      messageBox = $('<div class="user">').text('Вы');
    }
    chatBox[chatBox.length] = $('<div class="message">').html(messageBox).append(message.body);
  })
$(".chat").html(chatBox);
if (window.firstGettingMessage){
  $('.chat').scrollTop($('.chat')[0].scrollHeight);
}
window.firstGettingMessage = false;
})
}