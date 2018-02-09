#!/usr/bin/env python
# Name: Steven Schoenmaker  
# Student number: 10777679
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # creates a list of the titles of the top 50 series (first page IMDB)
    title_list = dom.select('a[href$=adv_li_tt]')
    titles = [title.string for title in title_list]

    # creates a list of the ratings of the top 50 series (first page IMDB)
    rating_list = dom.findAll("meta", {"itemprop" :"ratingValue"})
    ratings = [rating['content'] for rating in rating_list] 

    # creates a list of the genres of the top 50 series (first page IMDB)
    genre_list = dom.findAll("span", {"class" :"genre"})
    genres = [genre.text.replace(' ', '').replace('\n', '') for genre in genre_list]

    # creates a list of all actors
    actor_list = dom.select('a[href*="adv_li_st_"]')

    # count the amount of actors per serie (maximum of 9)
    current_actors = []
    actor_amount_list = []
    highest_number = -1
    for actor in range(len(actor_list)):
        actor_string = str(actor_list[actor])
        number_index = actor_string.find('">') # the character previous of '">' is the number of an actor in a serie
        current_number = int(actor_string[number_index - 1])

        # finds the highest number and appends it when a lower number is found (new serie)
        if highest_number < current_number:
            highest_number = current_number
        else:
            actor_amount_list.append(highest_number)
            highest_number = -1

        if actor == len(actor_list) - 1:
            actor_amount_list.append(highest_number) # creates a list containing the amount of actors per serie

    # creates a list of actor names per serie
    actors = []
    current_serie = 0
    for i in range(len(actor_list)):
        current_actors.append(actor_list[i].text)
        if (i + 1) % (actor_amount_list[current_serie] + 1) == 0:
            actors.append(current_actors)
            current_actors = []
            current_serie = current_serie + 1

    # creates a list of the runtimes of the top 50 series (first page IMDB)
    runtime_list = dom.findAll("span", {"class" :"runtime"})
    runtimes = [runtime.text.replace(' ', '').replace('min', '') for runtime in runtime_list]

    # creates a list of the top 50 series (info = title, rating, genre, actors and runtime)
    tvseries = [[titles[i], ratings[i], genres[i], str(actors[i])[1:-1], runtimes[i]] for i in range(len(titles))]

    return tvseries


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])
    # for every serie, write a row with title, rating, genre, actors and runtime in CSV format
    for serie in tvseries:
        writer.writerow(serie)



def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
