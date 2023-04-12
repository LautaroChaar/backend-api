const socket = io();

const schemaAuthor = new normalizr.schema.Entity(
  "user",
  {},
  { idAttribute: "id" }
);

const schemaMessage = new normalizr.schema.Entity(
  "post",
  { user: schemaAuthor },
  { idAttribute: "id" }
);

const schemaMessages = new normalizr.schema.Entity(
  "posts",
  { messages: [schemaMessage] },
  { idAttribute: "id" }
);

socket.on("from-server-messages", (messages) => {
  let messagesD = normalizr.denormalize(
    messages.result,
    schemaMessages,
    messages.entities
  );
  render(messagesD.messages);
});

function render(messages) {
  let email;
  let timestamp;
  let text;
  const messagesHTML = messages
    .map((m) => {
      if (m.hasOwnProperty("_doc")) {
        email = m._doc.user.email;
        timestamp = m._doc.timestamp;
        text = m._doc.text;
      } else {
        email = m.user.email;
        timestamp = m.timestamp;
        text = m.text;
      }
      return `<p style= 'color: brown'><b style= 'color: blue'>${email}</b> [${timestamp}]: <span style= 'color: green; font-family: italic'>${text}</span></p>`;
    })
    .join("");
  document.querySelector("#history").innerHTML = messagesHTML;
}

function sendMessage() {
  const timestamp = new Date().toLocaleString();
  const inputEmail = document.querySelector("#email");
  const inputContent = document.querySelector("#messageContent");
  if (inputContent.value != "") {
    const newMessage = {
      user: {
        email: inputEmail.value,
      },
      timestamp,
      text: inputContent.value,
    };
    socket.emit("from-client-messages", newMessage);
    inputContent.value = "";
  }
}
