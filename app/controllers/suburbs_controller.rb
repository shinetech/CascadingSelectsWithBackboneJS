class SuburbsController < ApplicationController
    def index
        render :json => City.find(params[:city_id]).suburbs
    end  
end
