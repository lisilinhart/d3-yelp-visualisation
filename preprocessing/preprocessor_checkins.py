# -*- coding: utf-8 -*-

import os
import sys
import csv
import json
import operator
from nltk.stem import WordNetLemmatizer

STARS = 5
CITY = "edinburgh"
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
  terms = {}

  checkins_by_category = {}
  business_categories = {}
  business_ids = read_from_file(CITY + "_businesses.tsv")

  with open("yelp_academic_dataset_business.json") as businesses:
    for index, r in enumerate(businesses):
      business = json.loads(r)
      business_categories[business["business_id"]] = business["categories"]

  with open("yelp_academic_dataset_checkin.json") as checkins:
    for index, r in enumerate(checkins):
      checkin = json.loads(r)

      if checkin["business_id"] in business_ids:
        checkin_info = checkin["checkin_info"]
        categories = business_categories[checkin["business_id"]]

        checkin_count = 0
        for key, value in checkin_info.iteritems():
          checkin_count += int(value)

          # checkin_item = info.split('-', 1 )
          # day = int(checkin_item[1])
          # value = int(checkin_item[0])

        for cat in categories:
          if cat in checkins_by_category.keys():
            checkins_by_category[cat] += checkin_count
          else:
            checkins_by_category[cat] = checkin_count


  with open(CITY + "_checkins_by_category.tsv", "w") as file:
    term_writer = csv.writer(file, delimiter="\t")
    for category, count in reversed(sorted(checkins_by_category.items(), key = operator.itemgetter(1))):
      term_writer.writerow([unicode(category).encode("utf-8"), count])

  # jsonData = []
  # counter = 0
  # for term, count in reversed(sorted(terms.items(), key = operator.itemgetter(1))):
  #   jsonData.append({ "text": term, "size": count })
  #   counter += 1
  #   if counter >= LIMIT:
  #     break

  # with open("review_words_" + CITY + "_" + str(STARS) + "_star.json", "w") as f:
  #   json.dump(jsonData, f)
