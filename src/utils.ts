

export function getJSON(request, data_source = "json") {
    return new Promise(function (resolve, reject) {
        var body_parsed = "";
        request.on("data", (chunk) => {
            body_parsed += chunk;
        });

        request.on("end", () => {
            try {
                if (data_source == "json") {
                    var content_parsed = null
                    try {
                        content_parsed = JSON.parse(body_parsed);
                    } catch (err) {
                        console.log("ERROR")
                        console.log(body_parsed)
                        reject(new Error("Erro na conversão do JSON"))
                    }
                    resolve(content_parsed);
                } else if (data_source == "query") {
                    let transpiled_object = {};
                    body_parsed.split("&").forEach((content) => {
                        var key_value_pair = content.split("=");
                        transpiled_object[key_value_pair[0]] = key_value_pair[1];
                    });
                    // transpiled_object['userId'] = response.getHeader('userId')

                    resolve(transpiled_object);
                } else {
                    reject(new Error("data_source parameter don't recognized"));
                }
            } catch (err) {
                reject(err);
            }
        });

        request.on("error", (error) => {
            reject(error);
        });
    });
}

export function getHeader(request) {
    const headers = {};
    console.log("Chega aqui")
    Object.entries(request.headers).forEach((e) => (headers[e[0]] = e[1]));
    console.log("mas n aqui")
    return headers
  }