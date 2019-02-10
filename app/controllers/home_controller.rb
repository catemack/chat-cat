class HomeController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @channels = Channel.all
  end
end
