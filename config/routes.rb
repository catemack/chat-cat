Rails.application.routes.draw do
  devise_for :users

  resources :channels, only: [:index, :show] do
    resources :messages
  end

  root to: 'home#index'
end
