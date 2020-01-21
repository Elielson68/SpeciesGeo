function initMap() {

    var belem = {lat:-1.44502, lng: -48.4650};
    var map = new google.maps.Map(document.getElementById('first_map'), {zoom: 4, center: belem});
    var selected_polygon = new Polygon(map)

    var div_component = document.getElementById("insert_inputs")
    var btn_create_poly = document.getElementById("Btn_Create_Poly")
    var select_poly_component = document.getElementById("select_poly")
    var btn_create_vertex = document.getElementById("btn_create_vertex")
    var input_lat = document.getElementById("Latitude")
    var input_lng = document.getElementById("Longitude")
    var btn_save_coordinate = document.getElementById("btn_save_coord")
    var input_send_polygons = document.getElementById("send_polygons")

    var list_componentsHTML = []
    var list_polygons = []
    var polygon_components = {}
    var index_polygon = 0
    list_polygons.push(selected_polygon)

    function addVerticesPolygon(event){
        var new_components = new ComponentHTML()
        event.latLng===undefined ? vertex_lat = input_lat.value : vertex_lat = event.latLng.lat()
        event.latLng===undefined ? vertex_lng = input_lng.value : vertex_lng = event.latLng.lng()
        var coord =  new google.maps.LatLng(vertex_lat, vertex_lng)
        selected_polygon.createVertices(coord)
        var index = selected_polygon.TotalVertices()-1
        selected_polygon.getLastVertex().addListener('position_changed', MouseMovedVertex);
        selected_polygon.getLastVertex().setIndex(index)
        new_components.createInputGroup(vertex_lat, vertex_lng, index, div_component, InputMovedVertex, DeleteVertex)
        list_componentsHTML.push(new_components)
        polygon_components[`polygon${index_polygon}`] = {"polygon": selected_polygon, "components": list_componentsHTML}
        console.log(polygon_components.toString())
    }
    function MouseMovedVertex(){
        var vertex = this
        var index_vertex = parseInt(vertex.getIndex())
        selected_polygon.setVertexPosition(index_vertex, vertex.getPosition())
        list_componentsHTML[index_vertex].setValueInputLat(vertex.getLatitude())
        list_componentsHTML[index_vertex].setValueInputLng(vertex.getLongitude())
    } 
    function InputMovedVertex(){
        var input = this
        var index = input.id.includes("Lat") ? input.id.replace("Lat", "") : input.id.replace("Lng", "")
        var vertex = selected_polygon.findVertex(index)
        selected_polygon.setVertexPosition(index, vertex.getPosition())
        if(input.id.includes("Lat")){
            vertex.setLatitude(parseFloat(input.value))
        }
        else{
            vertex.setLongitude(parseFloat(input.value))
        }
    }
    function DeleteVertex(){
        index = this.id.replace("Delete","")
        delete_input_group = list_componentsHTML[index].getSuperDiv()
        div_component.removeChild(delete_input_group)
        selected_polygon.removeVertex(index)
        RenameIDComponentsHTML(index)
        list_componentsHTML.splice(index,1)    
    }
    function CreatePolygon(){
        var last_created_polygon = list_polygons[list_polygons.length-1]
        if(last_created_polygon.TotalVertices() >= 3 && selected_polygon.TotalVertices() >=3){
            var new_polygon = new Polygon(map)
            list_polygons.push(new_polygon)
            selected_polygon.setActive(false)
            selected_polygon = new_polygon
            index_polygon = list_polygons.length-1
            ClearDivComponent()
            list_componentsHTML = []
            polygon_components[`polygon${index_polygon}`] = {"polygon": selected_polygon, "components": list_componentsHTML}
            
            var new_components = new ComponentHTML()
            total_polygon = list_polygons.length
            new_components.createOption(index_polygon, "Poligono "+total_polygon, select_poly_component)
        }
        else{
            alert("Para criar novo polígono é necessário que o atual tenha mais de 2 vértices!")
        }

    }
    function SelectPolygon(){
        index_polygon = this.value
        if(index_polygon >=0){
            array_keys_polys = Object.keys(polygon_components)
            var picked_poly = array_keys_polys[index_polygon]
            selected_polygon.setActive(false);
            ClearDivComponent()
            list_componentsHTML = []
            selected_polygon = polygon_components[picked_poly]["polygon"];
            list_componentsHTML = polygon_components[picked_poly]["components"]
            for (x=0;x<list_componentsHTML.length;x++){
                div_component.appendChild(list_componentsHTML[x].getSuperDiv())
            }
            selected_polygon.setActive(true);
        }
    }
    function ClearDivComponent(){
        if(list_componentsHTML != []){
            for (x=0; x<list_componentsHTML.length; x++){
                child = list_componentsHTML[x].getSuperDiv()
                div_component.removeChild(child)
            }
        }
    }
    function RenameIDComponentsHTML(index){
        for (i=index;i<selected_polygon.TotalVertices();i++){
            ind = parseInt(i)
            list_componentsHTML[ind+1].setIDSuperDiv("input_vertex"+i)
            list_componentsHTML[ind+1].setIDInputLat("Lat"+i)
            list_componentsHTML[ind+1].setIDInputLng("Lng"+i)
            list_componentsHTML[ind+1].setIDButton("Delete"+i)
            list_componentsHTML[ind+1].setIDSpan("span"+i)
            list_componentsHTML[ind+1].setTextSpan((ind+1)+"ª. "+"Vértice")
            selected_polygon.getListVertices()[ind].setIndex(ind)
        }
    }
    function SavePolygonsVertices(){
        var send_polygons = {}
        for (polygon in polygon_components){
            send_polygons[polygon] = polygon_components[polygon]["polygon"].getVertices()
        }
        send_polygons = JSON.stringify(send_polygons)
        input_send_polygons.value = send_polygons
        alert("Coordenadas salvas!")
    }
    /*
    list_locality = []
    coordinates = []
    for (x=0; x<latitudes.length; x++){
        coordinate =  new google.maps.LatLng(latitudes[x], longitudes[x])
        coordinates.push(coordinate)
    }
    Geo1 = new google.maps.Geocoder()
    Geo1.geocode(
        {'location': coordinates}, 
        function(a){
            a.forEach(function(element, index, array){
                var country = null
                var state = null
                var county = null
                var locality = null
                element.address_components.forEach(function(element, index, array){
                    if (element["types"][0] == "country"){
                        country = element["long_name"]
                    }
                    if (element["types"][0] == "administrative_area_level_1"){
                        state = element["long_name"]
                    }
                    if (element["types"][0] == "administrative_area_level_2"){
                        county = element["long_name"]
                    }
                    if (element["types"][0] == "route"){
                        locality = element["long_name"]
                    }
                    
                })
                var new_locality = new Localitys(country, state, county, locality)
                console.log(new_locality)
            })
        }
    )*/   
    map.addListener('click', addVerticesPolygon);
    btn_create_vertex.addEventListener('click', addVerticesPolygon);
    btn_create_poly.addEventListener('click', CreatePolygon);
    btn_save_coordinate.addEventListener('click', SavePolygonsVertices);
    select_poly_component.addEventListener('change', SelectPolygon);
}