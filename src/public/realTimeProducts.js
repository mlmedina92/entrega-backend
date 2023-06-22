const socketClient = io()//instancio el socket del lado del cliente

let msgHtml = document.getElementById('messages')

const showMessage = (message) => {
    msgHtml.innerHTML += `<p>${message}</p>`
}

// parte del servidor que escucha eventos 
socketClient.on('product-added', message => showMessage(message))
socketClient.on('product-updated', message => showMessage(message))
socketClient.on('product-removed', message => showMessage(message))