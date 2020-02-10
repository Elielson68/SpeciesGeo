from flask import render_template, redirect, url_for, request, Blueprint
from controller import home_controller
from model.hierarchy_taxon import Hierarchy_Taxon
import googlemaps

hrch_taxon = Hierarchy_Taxon()
spreadsheet_titles = {}
gmaps = googlemaps.Client(key='AIzaSyDJ47tWCXOUSPql_E5MRnw5iFKo9uaaWp8')
used_sheet = home_controller.used_sheet
markers_blueprint = Blueprint('markers', __name__, template_folder='templates')

@markers_blueprint .route("/markers_validation", methods=["GET", "POST"])
def markers_validation():
    if request.method == "POST":
        coord = request.form["selection_coordinate"]
        coord = eval(coord)
        region = request.form["selection_region"]
        region = eval(region)
        region = request.form["selection_region"]
        region = eval(region)
        taxon = request.form["selection_taxon"]
        taxon = eval(taxon)

        used_sheet.coordinate.set_Latitude_Column_values(coord["latitude"])
        used_sheet.coordinate.set_Longitude_Column_values(coord["longitude"])

        used_sheet.locality.set_Country_Column_values(region["country"])
        used_sheet.locality.set_State_Column_values(region["state"])
        used_sheet.locality.set_County_Column_values(region["county"])
        used_sheet.locality.set_Local_Column_values(region["locality"])

        hrch_taxon.set_Genus(used_sheet.Value_in_Column(taxon['genus']))
        hrch_taxon.set_Specie(used_sheet.Value_in_Column(taxon['specie']))
        spreadsheet_titles['country'] = region["country"]
        spreadsheet_titles['state'] = region["state"]
        spreadsheet_titles['county'] = region["county"]
        spreadsheet_titles['locality'] = region["locality"]
        spreadsheet_titles['latitude'] = coord["latitude"]
        spreadsheet_titles['longitude'] = coord["longitude"]
        return redirect(url_for("markers.markers_list"))

@markers_blueprint .route("/markers_list",methods=["GET","POST"])
def markers_list():
    if request.method == "POST":
        polygons = request.form['vertices']
        polygons = eval(polygons)

        coord_lat = used_sheet.coordinate.get_Latitude_Column_values()
        coord_lng = used_sheet.coordinate.get_Longitude_Column_values()
        coord_lat = used_sheet.coordinate.Convert_Lat_Decimal(coord_lat)
        coord_lng = used_sheet.coordinate.Convert_Lng_Decimal(coord_lng)

        spreadsheet_country = used_sheet.locality.get_Country_Column_values()
        spreadsheet_state = used_sheet.locality.get_State_Column_values()
        spreadsheet_county = used_sheet.locality.get_County_Column_values()
        spreadsheet_local = used_sheet.locality.get_Local_Column_values()

        genus = hrch_taxon.get_Genus()
        specie = hrch_taxon.get_Specie()

        list_empty_values = [i for i, item in enumerate(coord_lat) if item == '']
        count = 0
        list_region = []
        list_treatment_region = []
        for x in list_empty_values:
            delete = x-count
            del(coord_lat[delete])
            del(coord_lng[delete])
            del(spreadsheet_country[delete])
            del(spreadsheet_state[delete])
            del(spreadsheet_county[delete])
            del(spreadsheet_local[delete])
            del (genus[delete])
            del (specie[delete])
            count+=1
        try:
            for x in range(len(coord_lat)):
                region = {"country": "null", "state": "null", "county": "null", "locality": "null"}
                reverse_geocode_result = gmaps.reverse_geocode((coord_lat[x], coord_lng[x]), language="pt-BR")
                index = 0
                political = True
                for x in range(len(reverse_geocode_result)):
                    address_components_length = len(reverse_geocode_result[index]['address_components'])
                    if reverse_geocode_result[x]['types'][0] == 'route' and address_components_length < 4:
                        political = True
                        index = x
                        break
                    elif reverse_geocode_result[x]['types'][0] == 'political':
                        political = True
                        index = x
                        break
                    if reverse_geocode_result[x]['types'][0] == 'administrative_area_level_2':
                        political = False
                        index = x
                try:
                    region['country'] = reverse_geocode_result[index]['address_components'][3 if political else 2]['long_name']
                except:
                    region['country'] = "null"
                try:
                    region['state'] = reverse_geocode_result[index]['address_components'][2 if political else 1]['long_name']
                except:
                    region['state'] = "null"
                try:
                    region['county'] = reverse_geocode_result[index]['address_components'][1 if political else 0]['long_name']
                except:
                    region['county'] = "null"
                try:
                    if(political):
                        region['locality'] = reverse_geocode_result[index]['address_components'][0]['long_name']
                    else:
                        region['locality'] = "null"
                except:
                    region['locality'] = "null"
                list_region.append(region)

            for x in range(len(list_region)):
                checked_region = {"country": {'name1': None, 'name2': None, 'score': None}, "state": {'name1': None, 'name2': None, 'score': None}, "county": {'name1': None, 'name2': None, 'score': None}, "locality": {'name1': None, 'name2': None, 'score': None}}
                checked_region['country']['name1'] = spreadsheet_country[x]
                checked_region['country']['name2'] = list_region[x]['country']
                checked_region['country']['score'] = used_sheet.data_treatment.Compare_String(spreadsheet_country[x], list_region[x]['country'])

                checked_region['state']['name1'] = spreadsheet_state[x]
                checked_region['state']['name2'] = list_region[x]['state']
                checked_region['state']['score'] = used_sheet.data_treatment.Compare_String(spreadsheet_state[x], list_region[x]['state'])

                checked_region['county']['name1'] = spreadsheet_county[x]
                checked_region['county']['name2'] = list_region[x]['county']
                checked_region['county']['score'] = used_sheet.data_treatment.Compare_String(spreadsheet_county[x], list_region[x]['county'])

                checked_region['locality']['name1'] = spreadsheet_local[x]
                checked_region['locality']['name2'] = list_region[x]['locality']
                checked_region['locality']['score'] = used_sheet.data_treatment.Compare_String(spreadsheet_local[x], list_region[x]['locality'])
                list_treatment_region.append(checked_region)
        except NameError:
            print("erro: "+NameError)
        row_coord_lat = used_sheet.coordinate.get_Index_Row_Lat()
        row_coord_lng = used_sheet.coordinate.get_Index_Row_Lng()
        return render_template("list/markers_list.html", polygons=polygons, latitude=coord_lat, longitude=coord_lng, row_coord_lat=row_coord_lat, row_coord_lng=row_coord_lng, list_region=list_region, country=spreadsheet_country, state=spreadsheet_state, county=spreadsheet_county, locality=spreadsheet_local, genus=genus, specie=specie, list_checked_regions=list_treatment_region, spreadsheet_titles=spreadsheet_titles)
    else:
        return render_template("form/markers_form.html" )

@markers_blueprint .route("/markers_confirm", methods=["GET", "POST"])
def markers_confirm():
    if request.method == "POST":
        data = request.form["data"]
        data = eval(data)
        used_sheet.Change_Data_Spreadsheet2(data)
        used_sheet.Save_Formatted_Spreadsheet()
        print(data)
        return data
'''
_______________________________________________________________________________________________________________________
UTILIZANDO API REST DO GOOGLEMAPS 
1740 linhas lidas em 4m20s.
'''