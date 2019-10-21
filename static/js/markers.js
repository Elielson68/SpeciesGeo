function Detectar_Marks(latitude, longitude, markers, poligono){
  //Cria os markers e os insere no vetor
  
  for(var lat in latitude){
    var coordenadas = new google.maps.LatLng(latitude[lat], longitude[lat])
    var marker = new google.maps.Marker({
      title: "Lat: "+latitude[lat]+"\nLng: "+longitude[lat],
      position: coordenadas,
      map: null,
      icon: "",
    });
    markers.push(marker);
  }
  //Identifica cada marker em cada um dos poligonos, ele pega 1 marker de cada vez pra verificar em todos os poligonos
  
  for(var poli in poligono){
    contador = 0
    for(var marker in markers){
      var isWithinPolygon = google.maps.geometry.poly.containsLocation(markers[marker].position,poligono[poli])
      if(isWithinPolygon){
        contador++
        //Caso ele esteja dentro de algum poligono então ele se torna azul e o looping para e vai pro próximo marker
        markers[marker].icon = "../static/blue_marker2.png"
        markers[marker].setMap(map)
        Criar_TBody(markers[marker].position["lat"](), markers[marker].position["lng"](), (parseInt(poli)+1), contador)
      }
      else if(markers[marker].icon != "../static/blue_marker2.png"){
        //Se não ele continua verificando e inserindo o marker vermelho
        markers[marker].icon = "../static/red_marker2.png"
        markers[marker].setMap(map)
      }
    }
  }
}
function Criar_TBody(latitude, longitude, indice, contador){
  //Criando os dados de cada tabela referente aos poligonos
  var elemento_pai = document.getElementById("tbody_poligono"+indice)
  var linha = document.createElement("tr")
  var indice_coluna = document.createElement("th")
  indice_coluna.innerHTML = contador
  var nome_coluna = document.createElement("td")
  var latitude_coluna = document.createElement("td")
  var longitude_coluna = document.createElement("td")
  linha.appendChild(indice_coluna)
  linha.appendChild(nome_coluna)
  linha.appendChild(latitude_coluna)
  linha.appendChild(longitude_coluna)
  elemento_pai.appendChild(linha)
  latitude_coluna.innerHTML = latitude
  longitude_coluna.innerHTML = longitude
}
function Criar_THead(indice){

  //Pegando o ID da tabela
  var tabela = document.getElementById("tabela")

  //Criando o cabeçario da tabela
  var thead = document.createElement("thead")
  var tr_titulo_tabela = document.createElement("tr")
  var th_titulo = document.createElement("th")
  var texto_th_titulo;
  var tr_titulos = document.createElement("tr")
  var th_indice = document.createElement("th")
  var th_nome = document.createElement("th")
  var th_latitude = document.createElement("th")
  var th_longitude = document.createElement("th")

  //Criando o corpo da tabela
  var tbody = document.createElement("tbody")

  //Título principal
  th_titulo.style = "text-align: center"
  th_titulo.setAttribute("colspan",4)
  th_titulo.id = "thead_poligono"+indice
  th_titulo.className = "thead"
  texto_th_titulo = document.createTextNode("Lista de Markers dentro do Poligono "+indice)
  th_titulo.appendChild(texto_th_titulo)
  tr_titulo_tabela.appendChild(th_titulo)
  thead.appendChild(tr_titulo_tabela)

  //Títulos de cada coluna
  th_indice.setAttribute("scope","col")
  th_indice.innerHTML = "#"
  th_nome.setAttribute("scope","col")
  th_nome.innerHTML = "Nome Científico"
  th_latitude.setAttribute("scope","col")
  th_latitude.innerHTML = "Latitude"
  th_longitude.setAttribute("scope","col")
  th_longitude.innerHTML = "Longitude"

  //Anexando todos eles a coluna principal
  tr_titulos.appendChild(th_indice)
  tr_titulos.appendChild(th_nome)
  tr_titulos.appendChild(th_latitude)
  tr_titulos.appendChild(th_longitude)
  tr_titulos.id = "tr_poligono"+indice
  tr_titulos.style = "display: none"

  //anexando ao cabeçário da tabela
  thead.append(tr_titulos)

  //Identificando o body para inserir os dados de cada poligono individualmente
  tbody.id = "tbody_poligono"+indice
  tbody.style = "display: none"

  //Anexado o cabeçario e o corpo na tabela
  tabela.appendChild(thead)
  tabela.appendChild(tbody)
}

