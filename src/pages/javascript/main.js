

function onLoad() {
  fetch_list_of_books();
}

// função disparada quando o usuário clica no card para reservar um livro
function choose_book(bookId) {
  
  var headers = new Headers();
  headers.append("Content-type", "application/json");

  send_request('/api/choose_book','POST',headers, JSON.stringify({ bookId }))
    .then((e) => {
      return e.json();
    })
    .then((f) => {
      if (f.status == "Added successful") {
        var div_to_delete = document.getElementById("div-" + bookId);
        div_to_delete.remove();
      } else {
        alert(
          "O usuário só pode escolher um livro por vez, 'devolva' o livro antes de obter mais um"
        );
      }
    })
    .catch((err) => {
      console.log("Error: " + err);
    });
}

function fetch_list_of_books() {
  var method = "GET";
  var mode = "no-cors";
  var cache = "default";
  var headers = new Headers();
  var requestOptions = new Request("/api/books", {
    method,
    headers,
    mode,
    cache,
  });
  headers.append("Content-type", "application/json");
  const division = document.getElementById("flex-row-content");

  send_request('/api/books','GET',headers)
    .then((data) => {
      console.log('verificando o conteúdo de retorno')
      console.log(data.status)
      console.log(typeof data)
      // console.log(Object.entries(data.headers))
      console.log(data.headers.get("Content-type"))

      var content_type = data.headers.get("Content-type")
      if (content_type == "text/plain") {
        return data.text()
      } else if (content_type == "application/json") {
        return data.json();
      } else {
        throw new Error("the header 'Content-type' isn't with the correct format")
      }

    })
    .then((e) => {

      console.log("CCCONTEUD")
      console.log(e)

      e.forEach((content) => {
        division.innerHTML += `
                <div class='card' id = "div-${content.ID}">
                    <div class="text-content">
                        <h1>${content.title}</h1>
                        <text>${content.descr}</text>
                    </div>
                    <div>
                        <button id = "btn-${content.ID}" onclick = "choose_book(${content.ID})">Reservar títulos</button>
                    </div>
                </div>
                `;
      });
    })
    .catch(
      (err) => "Algo do errado não está certo na request dos livros: " + err
    );
}

window.onload = onLoad;
