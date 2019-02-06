class CreateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :messages do |t|
      t.text :body, null: false
      t.belongs_to :user, index: true
      t.belongs_to :channel, index: true

      t.timestamps
    end
  end
end
