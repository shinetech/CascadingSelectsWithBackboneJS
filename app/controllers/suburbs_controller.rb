class SuburbsController < ApplicationController
    def index
        render :json => City.find(params[:city_id]).suburbs
    end  
    
    def show
      render :json => Suburb.find(params[:id])
    end
end
