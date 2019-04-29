class HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @current_user = current_user
    @channels = Channel.all
  end
end
