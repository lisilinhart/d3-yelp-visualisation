# -*- coding: utf-8 -*-

import os
import sys
import csv
import json
import operator
from nltk.stem import WordNetLemmatizer

STOP_WORDS = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"]

STARS = 5

if __name__ == "__main__":
  wordnet_lemmatizer = WordNetLemmatizer()
  terms = {}
  with open("yelp_academic_dataset_review.json") as reviews:
    for index, r in enumerate(reviews):
      print index
      review = json.loads(r)
      if review["stars"] == STARS:
        words = filter(lambda t: t not in STOP_WORDS, review["text"].lower().split())
        for word in words:
          word_lemmatized = wordnet_lemmatizer.lemmatize(word)
          if word_lemmatized not in terms:
            terms[word_lemmatized] = 1
          else:
            terms[word_lemmatized] += 1
      # if index > 1000:
      #   break

  with open("review_texts_" + str(STARS) + "_star_lemmatized.tsv", "w") as file:
    term_writer = csv.writer(file, delimiter="\t")
    for term, count in reversed(sorted(terms.items(), key = operator.itemgetter(1))):
      term_writer.writerow([unicode(term).encode("utf-8"), count])
