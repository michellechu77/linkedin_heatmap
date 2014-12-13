class LocationsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  respond_to :html, :json

def index
  puts "########"
  puts "In Index"
end

def create
  puts "*"  * 100
  puts params
  location = params["location"]
  if Location.where(name: location).exists?
    location = Location.where(name: location).first
    puts "$" * 90
  else
    geocode = Geocoder.coordinates(location)
    location = Location.create(name: location, longitude: geocode[0], latitude: geocode[1])
    puts "Created"
  end

  coordinates = {latitude: location.latitude, longitude: location.longitude}

  respond_to do |format|
    if location
      format.json {render :json => coordinates}
    else
      format.json {render :json => coordinates}
    end
  end
end

private
def location_params
  params.require(:location).permit(:name, :latitude, :longitude)
end

end