import re
import string

# Curated high-frequency English stopwords for NLP text matching
STANDARD_STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and",
    "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being",
    "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't",
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during",
    "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
    "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here",
    "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i",
    "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it",
    "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
    "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or",
    "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same",
    "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
    "some", "such", "than", "that", "that's", "the", "their", "theirs", "them",
    "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll",
    "they're", "they've", "this", "those", "through", "to", "too", "under",
    "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're",
    "we've", "were", "weren't", "what", "what's", "when", "when's", "where",
    "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with",
    "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've",
    "your", "yours", "yourself", "yourselves", "also", "including", "responsible",
    "experience", "years", "role", "work", "working", "using", "knowledge"
}

def clean_text(raw_text: str) -> str:
    """
    Cleans raw resume or job text for NLP processing.
    - Preserves tech tokens (e.g., C++, C#, .NET, Node.js)
    - Removes URLs, emails, phone numbers, and non-alphanumeric noise
    """
    if not raw_text or not isinstance(raw_text, str):
        return ""

    text = raw_text.strip()
    
    # Remove URLs
    text = re.sub(r"https?://\S+|www\.\S+", " ", text)
    
    # Remove Emails
    text = re.sub(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b", " ", text)
    
    # Remove Phone numbers
    text = re.sub(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}", " ", text)
    
    # Normalize special tech symbols before stripping punctuation
    text = re.sub(r"\bc\+\+\b", "cpp_tech", text, flags=re.IGNORECASE)
    text = re.sub(r"\bc#\b", "csharp_tech", text, flags=re.IGNORECASE)
    text = re.sub(r"\.net\b", "dotnet_tech", text, flags=re.IGNORECASE)
    text = re.sub(r"\bnode\.js\b", "nodejs_tech", text, flags=re.IGNORECASE)
    text = re.sub(r"\breact\.js\b", "reactjs_tech", text, flags=re.IGNORECASE)
    text = re.sub(r"\bvue\.js\b", "vuejs_tech", text, flags=re.IGNORECASE)

    # Convert to lowercase
    text = text.lower()
    
    # Remove standard punctuation except alphanumeric and space
    text = re.sub(r"[^\w\s]", " ", text)
    
    # Revert tech placeholders back to canonical tokens
    text = text.replace("cpp_tech", "c++")
    text = text.replace("csharp_tech", "c#")
    text = text.replace("dotnet_tech", ".net")
    text = text.replace("nodejs_tech", "node.js")
    text = text.replace("reactjs_tech", "react")
    text = text.replace("vuejs_tech", "vue.js")

    # Collapse multiple whitespaces
    text = re.sub(r"\s+", " ", text).strip()
    return text

def remove_stopwords(text: str) -> str:
    """Removes standard English stopwords from cleaned text string."""
    tokens = text.split()
    filtered = [t for t in tokens if t.lower() not in STANDARD_STOPWORDS and len(t) > 1]
    return " ".join(filtered)

def preprocess_for_tfidf(text: str) -> str:
    """Prepares text for TF-IDF Vectorization by cleaning and filtering stopwords."""
    cleaned = clean_text(text)
    return remove_stopwords(cleaned)
