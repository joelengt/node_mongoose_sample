var socket = io();

socket.on('new image', (data) => {
    data = JSON.parse(data);

    console.log(data);

    var container = document.querySelector('#imagenes');
    var source = document.querySelector('#image-template').innerHTML;

    var template = Handlebars.compile(source);
    // container.innerHTML += template(data);
    container.innerHTML = template(data) + container.innerHTML;

})
