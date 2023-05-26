import pandas as pd
import nltk
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.metrics.pairwise import cosine_similarity
import re
from wordcloud import WordCloud
import matplotlib.pyplot as plt


df = pd.read_csv("good-CSV.csv")


# Perform German-specific NLP tasks
nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words('german')

# hack to remove numbers 
# Define regex pattern
#pattern = r'\b[^\d\W]+\b'
pattern = r'[\d\W]+'
# Apply regex and split to DataFrame column
#df['text'] = df['title'].str.replace(pattern, '',regex = True)
# Apply regex and split to DataFrame column
df['text'] = df['package'].apply(lambda x: re.sub(pattern, ' ', x))


vectorizer = CountVectorizer(stop_words=stopwords)
X = vectorizer.fit_transform(df['text'])

feature_names = vectorizer.get_feature_names_out()

lda = LatentDirichletAllocation(n_components=50, random_state=42)
lda.fit(X)

# Extract keywords
keywords_per_topic = []

for topic_idx, topic in enumerate(lda.components_):
    top_keywords_idx = topic.argsort()[:-11:-1]
    top_keywords = [feature_names[i] for i in top_keywords_idx]
    keywords_per_topic.append(top_keywords)

#df['keywords'] = keywords_per_topic

# Calculate cosine similarity for each topic
similarity_matrix = cosine_similarity(X, lda.components_)

# Assign categories to DataFrame rows based on similarity
categories = []
keywords = []

for i in range(len(df)):
    topic_index = similarity_matrix[i].argmax()
    keywords.append(",".join(keywords_per_topic[topic_index]))
    categories.append(f'Category {topic_index+1}')
    

df['category'] = categories
df['keywords'] = keywords

# Create word cloud image
plt.figure(figsize=(10, 5))

for category in df['category'].unique():
    #text = ' '.join(df[df['category'] == category]['text'])
    text = ' '.join(df[df['category'] == category]['keywords'].iloc[0].split(","))
  
    # Generate word cloud
    wordcloud = WordCloud(width=800, height=400, background_color='white').generate(text)

    # Plot word cloud
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.axis('off')
    plt.title(category)

    # Save word cloud as PNG file
    filename = f'wordcloud_{category}.png'
    plt.savefig(filename, bbox_inches='tight')

    # Clear plot for the next word cloud
    plt.clf()

plt.close()


#print(df)
