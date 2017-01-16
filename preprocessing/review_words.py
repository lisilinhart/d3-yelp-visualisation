# -*- coding: utf-8 -*-

import os
import sys
import csv
import json
import operator
from nltk.stem import WordNetLemmatizer

STOP_WORDS = ["a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves", "ab", "aber", "abk.", "alle", "allem", "allen", "aller", "alles", "allg.", "als", "also", "am", "an", "ander", "andere", "anderem", "anderen", "anderer", "anderes", "andern", "anders", "aber", "auch", "auf", "aus", "bei", "bes.", "bez.", "bin", "bis", "bist", "bspw.", "da", "daß", "daher", "damit", "dann", "das", "dass", "dasselbe", "dazu", "dein", "deine", "deinem", "deinen", "deiner", "deines", "dem", "demselben", "den", "denn", "denselben", "der", "derer", "derselbe", "derselben", "des", "deshalb", "desselben", "dessen", "dich", "die", "dies", "diese", "dieselbe", "dieselben", "diesem", "diesen", "dieser", "dieses", "dir", "doch", "dort", "dt.", "du", "durch", "edv", "ehem.", "eigtl.", "ein", "eine", "einem", "einen", "einer", "eines", "einig", "einige", "einigem", "einigen", "einiger", "einiges", "einmal", "er", "es", "etc.", "etwas", "euch", "euer", "eure", "eurem", "euren", "eurer", "eures", "für", "ganz", "ganze", "ganzen", "ganzer", "ganzes", "gegen", "ggf.", "hab", "habe", "haben", "hat", "hatten", "hier", "hin", "hinter", "ich", "ihm", "ihn", "ihnen", "ihr", "ihre", "ihrem", "ihren", "ihrer", "ihres", "im", "in", "indem", "ins", "ist", "ja", "jede", "jedem", "jeden", "jeder", "jedes", "jene", "jenem", "jenen", "jener", "jenes", "jetzt", "kann", "können", "könnte", "kein", "keine", "keinem", "keinen", "keiner", "keines", "konnte", "mache", "machst", "macht", "machte", "man", "manche", "manchem", "manchen", "mancher", "manches", "mein", "meine", "meinem", "meinen", "meiner", "meines", "mich", "mir", "mit", "nach", "nein", "nicht", "nichts", "noch", "nun", "nur", "o.ä.", "ob", "oder", "o.g.", "ohne", "sein", "seine", "seinem", "seinen", "seiner", "seines", "selbst", "sich", "sicher", "sie", "sind", "so", "solche", "solchem", "solchen", "solcher", "solches", "sollte", "sondern", "u.a.", "u.ä.", "u.g.", "ugs.", "um", "und", "uns", "unser", "unter", "uvm.", "vgl.", "viel", "vielleicht", "vom", "von", "vor", "während", "wann", "warum", "was", "weg", "weil", "weiter", "welche", "welchem", "welchen", "welcher", "welches", "wenn", "wer", "wie", "wieder", "wir", "wo", "z.b.", "zu", "zum", "zur", "zwar", "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "du", "elle", "en", "et", "eux", "il", "je", "la", "le", "leur", "lui", "ma", "mais", "me", "même", "mes", "moi", "mon", "ne", "nos", "notre", "nous", "on", "ou", "par", "pas", "pour", "qu", "que", "qui", "sa", "se", "ses", "son", "sur", "ta", "te", "tes", "toi", "ton", "tu", "un", "une", "vos", "votre", "vous", "c", "d", "j", "l", "à", "m", "n", "s", "t", "y", "été", "étée", "étées", "étés", "étant", "suis", "es", "est", "sommes", "êtes", "sont", "serai", "seras", "sera", "serons", "serez", "seront", "serais", "serait", "serions", "seriez", "seraient", "étais", "était", "étions", "étiez", "étaient", "fus", "fut", "fûmes", "fûtes", "furent", "sois", "soit", "soyons", "soyez", "soient", "fusse", "fusses", "fût", "fussions", "fussiez", "fussent", "ayant", "eu", "eue", "eues", "eus", "ai", "as", "avons", "avez", "ont", "aurai", "auras", "aura", "aurons", "aurez", "auront", "aurais", "aurait", "aurions", "auriez", "auraient", "avais", "avait", "avions", "aviez", "avaient", "eut", "eûmes", "eûtes", "eurent", "aie", "aies", "ait", "ayons", "ayez", "aient", "eusse", "eusses", "eût", "eussions", "eussiez", "eussent", "ceci", "cela", "celà", "cet", "cette", "ici", "ils", "les", "leurs", "quel", "quels", "quelle", "quelles", "sans", "soi"]

STARS = 5
CITY = "phoenix"
LIMIT = 100

def read_from_file(filename):
  data = []
  with open(filename, "r") as f:
    reader = csv.reader(f, delimiter="\t")
    headers = reader.next()
    for row in reader:
      data.append(row[0])
      f.close()
      return data

if __name__ == "__main__":
  wordnet_lemmatizer = WordNetLemmatizer()
  terms = {}

  business_ids = read_from_file("./data/" + CITY + "_businesses.tsv")

  with open("./data/yelp_academic_dataset_review.json") as reviews:
    for index, r in enumerate(reviews):
      print index
      review = json.loads(r)

      if review["stars"] == STARS and review["business_id"] in business_ids:
        words = filter(lambda t: t not in STOP_WORDS, review["text"].lower().split())
        for word in words:
          word_lemmatized = wordnet_lemmatizer.lemmatize(word)
          if word_lemmatized not in terms:
            terms[word_lemmatized] = 1
          else:
            terms[word_lemmatized] += 1
    #   if index > 10000:
    #     break

  jsonData = []
  counter = 0
  for term, count in reversed(sorted(terms.items(), key = operator.itemgetter(1))):
    jsonData.append({ "text": term, "size": count })
    counter += 1
    if counter >= LIMIT:
      break

  with open("./output/review_words_" + CITY + "_" + str(STARS) + "_star.json", "w") as f:
    json.dump(jsonData, f)
