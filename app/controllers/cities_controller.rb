class CitiesController < ApplicationController
    def index
        render :json => Country.find(params[:country_id]).cities
    end
    
    def show
      render :json => City.find(params[:id])
    end
end
