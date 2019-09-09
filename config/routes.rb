Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'valiant', to: 'players#valiant'
  get 'clappr', to: 'players#clappr'
  get 'jwplayer', to: 'players#jwplayer'
  get 'omnivert', to: 'players#omnivert'
  get 'videojs', to: 'players#videojs'
  get 'lucid', to: 'players#lucid'
  get 'u_to_vr', to: 'players#u_to_vr'
  root 'players#index'
end
