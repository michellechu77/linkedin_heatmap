Rails.application.routes.draw do
  resources :locations, only: [:create, :index]
  resources :connections, only: [:create, :index]

  get 'connections/logout'

  root 'locations#index'
end
