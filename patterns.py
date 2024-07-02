import pandas as pd
from sklearn.neighbors import NearestNeighbors

# Example order data
orders = pd.read_csv('orders.csv')  # Load your order data

# Pivot the order data to create a user-item matrix
user_item_matrix = orders.pivot(index='user_id', columns='product_id', values='quantity').fillna(0)

# Apply collaborative filtering using k-nearest neighbors
model = NearestNeighbors(metric='cosine', algorithm='brute')
model.fit(user_item_matrix.values)

# Generate recommendations for a specific user
user_id = 1
distances, indices = model.kneighbors(user_item_matrix.loc[user_id].values.reshape(1, -1), n_neighbors=5)
recommended_items = user_item_matrix.columns[indices.flatten()]
