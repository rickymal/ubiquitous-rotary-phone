send_request('/', 'POST', new Headers(), {})
  .then(e => e.text())
  .then(e => console.log("Content to new request:" + e))
function delete_owner_book(bookId) {
  var headers = new Headers();
  var body = JSON.stringify({ bookId });
  headers.append("Content-type", "application/json");
  send_request('/api/delete_owner_book', 'POST', headers, body)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}
function update_book(self, bookId, last_title, last_description) {
  self.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(self.target));
  form_parsed.last_title = last_title,
    form_parsed.last_description = last_description
  form_parsed.bookId = bookId
  var headers = new Headers();
  var body = JSON.stringify(form_parsed);
  headers.append("Content-type", "application/json");
  send_request('/api/edit_title', 'POST', headers, body)
    .then((e) => {
      if (e.status == 200) {
        return e.json();
      }
    })
    .then((response_parsed) => {
      var title_content = document.getElementById("h1Id-" + bookId)
      var description_content = document.getElementById("textId-" + bookId)
      title_content.innerHTML = form_parsed.title
      description_content.innerHTML = form_parsed.description
      // document.getElementById("frm2").style.display = "none"
      document.getElementById("container-updater").style.display = "none"
    });
}
// mostra o campo e altera seu eventlistener
function edit_owner_book(bookId) {
  var edit_container = document.getElementById("container-updater")
  edit_container.style.display = "flex"
  var title = document.getElementById("h1Id-" + bookId).textContent
  var description = document.getElementById("textId-" + bookId).textContent
  document.getElementById("title-updater").setAttribute('value', title)
  document.getElementById("description-updater").innerHTML = description
  document.getElementById("frm2").addEventListener("submit", (e) => update_book(e, bookId, title, description))
}
function devolve_reserved_book(bookId) {
  var headers = new Headers();
  var body = JSON.stringify({ bookId });
  headers.append("Content-type", "application/json");
  send_request('/api/devolve_reserved_book', 'POST', headers, body)
    .then((e) => {
      return e.json();
    })
    .then(({ bookId, userId, status }) => {
      document.getElementById("id-" + bookId).remove();
    });
}
async function _request_owner_title() {
  var headers = new Headers();
  headers.append("Content-type", "application/json");
  send_request('/api/request_owner_books', 'GET', headers,)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");
      card_document.innerHTML = ""
      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML += `
        <div class="card" id = id-${response_parsed.ID}>
            <div class="text-content">
              <h1 id = "h1Id-${response_parsed.ID}">${response_parsed.title}</h1>
              <text id = "textId-${response_parsed.ID}">${response_parsed.descr}</text>
            </div>
            <div>
              <button id="btn" onclick = "delete_owner_book(${response_parsed.ID},)">Excluir título</button>
              <button id="btn" onclick = "edit_owner_book(${response_parsed.ID},)">Editar título</button>
            </div>
        </div>
        `;
      });
    })
    .catch(async (error) => { console.log("error: " + error) });
}
// teste (e funcionou melhor que na função acima _request_owner_title)
async function request_owner_title() {
  var headers = new Headers();
  headers.append("Content-type", "application/json");
  send_request('/api/request_owner_books', 'GET', headers,)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");
      // const card_document.innerHTML =  
      lof_response_parsed.forEach((response_parsed) => {
        card_document.innerHTML += `
        <div class="card" id = id-${response_parsed.ID}>
            <div class="text-content">
              <h1 id = "h1Id-${response_parsed.ID}">${response_parsed.title}</h1>
              <text id = "textId-${response_parsed.ID}">${response_parsed.descr}</text>
            </div>
            <div>
              <button id="btn" onclick = "delete_owner_book(${response_parsed.ID},)">Excluir título</button>
              <button id="btn" onclick = "edit_owner_book(${response_parsed.ID},)">Editar título</button>
            </div>
        </div>
        `;
      });
    })
    .catch(async (error) => { });
}
async function request_reserved_title() {
  var headers = new Headers();
  headers.append("Content-type", "application/json");
  send_request('/api/request_reserved_books', 'GET', headers,)
    .then(async (response) => {
      return response.json();
    })
    .then(async (lof_response_parsed) => {
      var card_document = document.getElementById("flex-row-content");
      // const card_document.innerHTML =  
      lof_response_parsed.forEach((response_parsed) => {
        var component_as_string = `
        <div class="card" id = id-${response_parsed.ID}>
            <div class="text-content">
              <h1>${response_parsed.title}</h1>
              <text>${response_parsed.descr}</text>
            </div>
            <div>
              <button id="btn" onclick = "devolve_reserved_book(${response_parsed.ID})">Desfazer reserva</button>
            </div>
        </div>
        `;
        var new_document = document.createElement("div");
        new_document.id = "to-unwrap"
        new_document.innerHTML = component_as_string;
        card_document.insertBefore(new_document, card_document.firstChild);
        new_document.outerHTML = new_document.innerHTML
      });
    })
    .catch(async (error) => { });
}
async function onLoad() {
  // adicionar o userId do usuário
  // var form_doc = document.getElementById("hidden-input-user-id");
  // form_doc.setAttribute("value", userId.toString());
  await request_reserved_title();
  await request_owner_title();
}
// capturar os elementos
document.getElementById("frm1").addEventListener("submit", function (e) {
  // document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const form_parsed = Object.fromEntries(new FormData(e.target));
  var headers = new Headers();
  var body = JSON.stringify(form_parsed);
  headers.append("Content-type", "application/json");
  send_request('/api/add_title', 'POST', headers, body)
    .then((e) => {
      if (e.status == 200) {
        return e.json();
      }
    })
    .then((response_parsed) => {
      var component_as_string = `
      <div class="card" id = id-${response_parsed.ID}>
          <div class="text-content">
            <h1 id = "h1Id-${response_parsed.ID}">${response_parsed.title}</h1>
            <text id = "textId-${response_parsed.ID}">${response_parsed.descr}</text>
          </div>
          <div>
            <button id="btn" onclick = "delete_owner_book(${response_parsed.ID})">Excluir título</button>
            <button id="btn" onclick = "edit_owner_book(${response_parsed.ID})">Editar título</button>
          </div>
      </div>
      `;
      var card_document = document.getElementById("flex-row-content");
      var new_document = document.createElement("div");
      new_document.innerHTML = component_as_string;
      card_document.appendChild(new_document);
    });
});

window.onload = onLoad;
