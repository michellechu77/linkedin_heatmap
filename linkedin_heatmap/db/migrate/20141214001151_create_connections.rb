class CreateConnections < ActiveRecord::Migration
  def change
    create_table :connections do |t|
      t.string :first_name
      t.string :last_name
      t.references :location

      t.timestamps
    end
  end
end
