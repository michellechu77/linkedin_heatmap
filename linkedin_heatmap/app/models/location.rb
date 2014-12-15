class Location < ActiveRecord::Base
  has_many :connections
end