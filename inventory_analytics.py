"""
E-Commerce Inventory Analytics & Customer Optimization Pipeline
Author: Technical Data Analyst / Portfolio Project
Description: End-to-end pipeline handling data validation, feature engineering, 
             unsupervised machine learning (K-Means), text processing, and 
             advanced dashboard visualization on a 100k product catalog.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from collections import Counter
import re

# Set plotting aesthetics
sns.set_theme(style="whitegrid")
plt.rcParams.update({'font.size': 10, 'axes.labelsize': 12, 'axes.titlesize': 14})

def load_and_clean_data(filepath):
    """Loads dataset and performs structural data validation & sanitization."""
    print("--- Phase 1: Data Loading & Sanitization ---")
    df = pd.read_csv(filepath)
    
    # Check shape and missing values
    print(f"Dataset Shape: {df.shape[0]} rows, {df.shape[1]} columns")
    print(f"Missing Values Identified:\n{df.isnull().sum()}\n")
    
    # Ensure strict numeric parsing
    df['Price'] = pd.to_numeric(df['Price'], errors='coerce')
    df['Stock'] = pd.to_numeric(df['Stock'], errors='coerce')
    
    # Drop rows where critical numeric features failed parsing
    df = df.dropna(subset=['Price', 'Stock'])
    
    # Uniform string cleanup for categorical tracking
    df['Category'] = df['Category'].str.strip()
    df['Availability'] = df['Availability'].str.strip().str.lower()
    
    print(f"Sanitization complete. Clean rows remaining: {len(df)}")
    return df

def perform_feature_engineering(df):
    """Engineers strategic business metrics for portfolio evaluation."""
    print("\n--- Phase 2: Feature Engineering ---")
    
    # Calculate Potential Gross Revenue per product profile
    df['Potential_Revenue'] = df['Price'] * df['Stock']
    
    print("Engineered Column: 'Potential_Revenue' successfully calculated.")
    return df

def run_data_mining_and_clustering(df):
    """Executes Unsupervised K-Means clustering to map price-stock volatility."""
    print("\n--- Phase 3: Unsupervised Data Mining (Clustering) ---")
    
    # Extract features for clustering matrix
    features = ['Price', 'Stock']
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(df[features])
    
    # Instantiating K-Means with 4 distinct inventory profiles
    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    df['Inventory_Cluster'] = kmeans.fit_predict(scaled_features)
    
    # Label mapping based on quadrant attributes
    print("Inventory Segments Engineered:")
    for cluster_id in sorted(df['Inventory_Cluster'].unique()):
        cluster_data = df[df['Inventory_Cluster'] == cluster_id]
        print(f" * Cluster {cluster_id} - Count: {len(cluster_data)} | "
              f"Mean Price: ${cluster_data['Price'].mean():.2f} | "
              f"Mean Stock: {cluster_data['Stock'].mean():.0f}")
              
    return df

def extract_text_insights(df):
    """Performs light tokenization and frequency distribution modeling on descriptions."""
    print("\n--- Phase 4: Product Description Text Mining ---")
    
    # Sampling text rows to accelerate keyword extraction loop
    sample_text = " ".join(df['Description'].dropna().sample(5000, random_state=42).astype(str))
    
    # Core regex cleaning and tokenization
    words = re.findall(r'\b[a-zA-Z]{4,}\b', sample_text.lower())
    
    # Filter standard generic business stop words
    stop_words = {'with', 'this', 'that', 'from', 'they', 'have', 'more', 'about', 'their'}
    filtered_words = [w for w in words if w not in stop_words]
    
    most_common = Counter(filtered_words).most_common(5)
    print(f"Top Core Descriptive Keywords Mined: {most_common}")
    return most_common

def generate_analytics_dashboard(df):
    """Generates an executive-ready, 4-panel analytical monitoring dashboard."""
    print("\n--- Phase 5: Generating Advanced Enterprise Dashboard ---")
    fig, axes = plt.subplots(2, 2, figsize=(18, 14))
    
    # Plot 1: Top 10 Product Categories by Count
    top_categories = df['Category'].value_counts().head(10)
    sns.barplot(x=top_categories.values, y=top_categories.index, ax=axes[0, 0], palette="viridis")
    axes[0, 0].set_title("Top 10 Product Categories by Volume")
    axes[0, 0].set_xlabel("Product Count")
    
    # Plot 2: Price vs Stock Scatter colored by K-Means Clusters
    # Sampling points to ensure smooth visualization render without memory overhead
    sample_df = df.sample(5000, random_state=42)
    sns.scatterplot(data=sample_df, x='Price', y='Stock', hue='Inventory_Cluster', 
                    palette="deep", alpha=0.6, ax=axes[0, 1])
    axes[0, 1].set_title("Inventory Segmentation Matrix (K-Means)")
    axes[0, 1].set_xlabel("Unit Price ($)")
    axes[0, 1].set_ylabel("Stock Availability")
    
    # Plot 3: Aggregated Average Revenue Metrics per Category Top 5
    top_rev_categories = df.groupby('Category')['Potential_Revenue'].sum().sort_values(ascending=False).head(5)
    sns.barplot(x=top_rev_categories.values / 1e6, y=top_rev_categories.index, ax=axes[1, 0], palette="magma")
    axes[1, 0].set_title("Top 5 Grossing Categories by Revenue Potential")
    axes[1, 0].set_xlabel("Potential Revenue Value ($ Millions)")
    
    # Plot 4: Global Availability Composition
    availability_mix = df['Availability'].value_counts()
    axes[1, 1].pie(availability_mix.values, labels=availability_mix.index, autopct='%1.1f%%',
                   startangle=140, colors=sns.color_palette("pastel"))
    axes[1, 1].set_title("Global Pipeline Fulfillment Status")
    
    # Global layout adjustments
    plt.tight_layout()
    output_filename = 'inventory_analytics_dashboard.png'
    plt.savefig(output_filename, dpi=300)
    plt.close()
    print(f"Dashboard successfully rendered and saved to storage as: '{output_filename}'")

def main():
    """Main execution controller loop."""
    data_path = 'products-100000.csv'
    
    # Execute full analysis stages
    product_df = load_and_clean_data(data_path)
    product_df = perform_feature_engineering(product_df)
    product_df = run_data_mining_and_clustering(product_df)
    extract_text_insights(product_df)
    generate_analytics_dashboard(product_df)
    
    print("\n--- Execution Pipeline Finished Successfully ---")

if __name__ == "__main__":
    main()
