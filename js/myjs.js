window.addEventListener("load", function () {
    page.Functions.Init();
    page.Functions.zeev_XhttpLoadPage('welcome.html');
});

var page = {

    Functions: {

        zeev_XhttpLoadPage: (function (url) {
            document.getElementById("menu").style.display = "none";
            var xhttp;
            var message;

            if (navigator.appName == "Microsoft Internet Explorer")
                xhttp = new ActiveXObject("Microsoft.XMLHTTP");
            else
                xhttp = new XMLHttpRequest();

            if (url !== null && url !== undefined && url !== "") {
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("content").innerHTML = this.responseText;
                    } else {
                        if (this.readyState == 4 && this.status != 200) {
                            message = `Ocorreu um erro ao executar a consulta.\r\n${this.responseText}`;
                            alert(message);
                        }
                    }
                };
                xhttp.open("GET", url, true);
                xhttp.send();
            }
        }),

        Init: (async () => {
            let divMenuBar = document.getElementById('menu-bar');

            divMenuBar.onclick = function () {
                let divHiddenMenu = document.getElementById('menu');

                if (divHiddenMenu.style.display == "none")
                    divHiddenMenu.style.display = "";
                else
                    divHiddenMenu.style.display = "none";

            };
        })

    }


}