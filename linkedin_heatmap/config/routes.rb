Rails.application.routes.draw do
  resources :locations, only: [:create, :index]
  root 'locations#index'
end
