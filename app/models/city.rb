class City < ActiveRecord::Base
  has_many :suburbs
  belongs_to :country
end
