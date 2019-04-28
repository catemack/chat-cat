class Channel < ApplicationRecord
  validates :name, uniqueness: true

  def as_json(options={})
    super(options.merge({:methods => :type}))
  end
end
