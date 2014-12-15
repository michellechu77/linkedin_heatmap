class ConnectionsController < ApplicationController
  skip_before_filter  :verify_authenticity_token
  respond_to :html, :json

  def index
    connection_names = []
    location_id = Location.where(name: params["location"]).first.id
    network_in_loc = Connection.where(location_id: location_id)

    network_in_loc.each do |connection|
      full_name = connection.first_name + " " + connection.last_name
      connection_names << full_name
    end

    respond_to do |format|
      if true
        format.json {render :json => connection_names}
      end
    end
  end

  def create
    locations = []
    params["network"].each_value do |connection|
      if connection["id"] != "private"
        location = Location.where(name: connection["location"]["name"].remove("Greater").remove("Area").strip).first
        Connection.create(first_name: connection["firstName"], last_name: connection["lastName"], location_id: location.id)
        locations << location.name
      end
    end
    locations = locations.uniq

    respond_to do |format|
      if true
        format.json {render :json => locations}
      end
    end
  end

  def logout
    Connection.delete_all
    reset_session

    respond_to do |format|
      if true
        format.json {render :json => nil}
      end
    end
  end

  private

  def connection_params
    params.require(:connection).permit(:first_name, :last_name, :location_id)
  end

end