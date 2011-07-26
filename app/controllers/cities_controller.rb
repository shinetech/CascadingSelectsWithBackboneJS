class CitiesController < ApplicationController
    def index
        render :json => Country.find(params[:country_id]).cities
    end  
end
