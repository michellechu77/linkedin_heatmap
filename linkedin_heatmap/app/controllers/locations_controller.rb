class LocationsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  respond_to :html, :json

def index
  @connection = Connection.new
end

def create
  location = params["location"]
  if Location.where(name: location).exists?
    location = Location.where(name: location).first
  else
    geocode = Geocoder.coordinates(location)
    location = Location.create(name: location, longitude: geocode[0], latitude: geocode[1])
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