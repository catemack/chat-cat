class ApplicationController < ActionController::Base
  private

  def load_current_user
    @current_user = current_user
  end

  def login_required
    head :forbidden unless current_user.present?
  end
end
