# Amazon-products-Data-Analysis-with-julius-Ai-Python-

# Inventory Intelligence Report: A Deep Dive into 100,000 Products

## 📌 Project Overview
This project delivers a comprehensive end-to-end data analysis of a large-scale product inventory dataset containing **100,000 products across 13 structured attributes**. The objective was to validate data integrity, evaluate catalog distribution patterns, and engineer financial metrics to identify inventory value concentration and critical restocking priorities.

### Key Deliverables:
- **Data Quality Assessment:** Verified 100% data cleanliness (zero missing or duplicate values).
- **Feature Engineering:** Calculated `Potential Revenue Value` ($Price \times Stock$) to map capital distribution.
- **Stock Optimization:** Identified high-revenue, low-stock vulnerability points across 13 major categories.
- **Brand Segmentation:** Utilized distributional boxplots to separate premium brand tiers from budget-friendly players.

---

## 🛠️ Tech Stack & Libraries
- **Language:** Python
- **Data Manipulation:** Pandas, NumPy
- **Data Visualization:** Matplotlib, Seaborn
- **Environment:** Jupyter Notebook / Julius AI Environment

---

## 📈 Key Findings & Insights

### 1. Data Integrity Summary
- **Total Records:** 100,000 rows
- **Features:** 13 variables (including Brand, Category, Price, Stock, Availability)
- **Data Cleanliness:** 0 missing values, 0 duplicate rows. Standardized categorical availability arrays (`in_stock`, `out_of_stock`, `limited_stock`).

### 2. Top 5 Categories by Potential Revenue Value
| Category | Total Potential Revenue | Average Price | Total Stock |
| :--- | :--- | :--- | :--- |
| **Kids' Clothing** | 769,705,803 | 511.66 | 1,500,373 |
| **Books & Stationery** | 767,004,410 | 501.76 | 1,516,299 |
| **Women's Clothing** | 763,208,900 | 503.49 | 1,505,469 |
| **Grooming Tools** | 761,329,591 | 502.86 | 1,514,774 |
| **Health & Wellness** | 759,192,537 | 509.53 | 1,482,398 |

*Strategic Insight:* **Health & Wellness** and **Kids' Clothing** represent critical supply chain focus areas due to high capital potential bound to tighter inventory levels.

### 3. Brand Pricing Intelligence
- **Premium Tier:** *Macdonald Inc*, *Morton PLC*, and *Mcbride Ltd* consistently lead both mean and median distributions.
- **Value Tier:** *Gordon and Sons* maintains a high volume footprint while remaining highly budget-friendly.
- **Outlier Detection:** Flagged two specific premium asset pricing anomalies in the *Morton PLC* portfolio (priced at 993 and 352) for catalog maintenance checks.

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME
