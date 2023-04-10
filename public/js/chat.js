const socket = io();

const schemaAuthor = new normalizr.schema.Entity('usuario', {}, { idAttribute: 'id' });

const schemaMensaje = new normalizr.schema.Entity('post', { usuario: schemaAuthor }, { idAttribute: 'id' });

const schemaMensajes = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })

socket.on('from-server-messages', messages => {
    let mensajesD = normalizr.denormalize(messages.result, schemaMensajes, messages.entities);
    render(mensajesD.mensajes);
});

function render(messages) {
    let email;
    let timestamp;
    let text;
    const messagesHTML = messages.map( m => {
        if (m.hasOwnProperty("_doc")) {
            email = m._doc.usuario.email;
            timestamp = m._doc.timestamp;
            text = m._doc.text;
        } else {
            email = m.usuario.email;
            timestamp = m.timestamp;
            text = m.text;
        }
        return `<p style= 'color: brown'><b style= 'color: blue'>${email}</b> [${timestamp}]: <span style= 'color: green; font-family: italic'>${text}</span></p>`;
    }).join('');  
    document.querySelector('#history').innerHTML = messagesHTML;
}

function sendMessage() {
    const timestamp = new Date().toLocaleString();
    const inputEmail = document.querySelector('#email');
    const inputContent = document.querySelector('#messageContent');
    if (inputContent.value != "") {
        const nuevoMensaje = {
        usuario: {
            email: inputEmail.value,
        },
        timestamp,
        text: inputContent.value
    }
    socket.emit('from-client-messages', nuevoMensaje);
    inputContent.value = "";
    }
}
