Rails.application.routes.draw do
  resources :locations, only: [:create, :index]
  resources :connections, only: [:create, :index, :destroy]


  root 'locations#index'
end
