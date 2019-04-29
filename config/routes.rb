Rails.application.routes.draw do
  devise_for :users

  resources :channels, only: [:index, :show] do
    member do
      post '/join', action: :join
    end

    resources :messages
  end

  root to: 'home#index'
end
