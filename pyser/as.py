import requests
import xml.etree.ElementTree as ET

VERGE_RSS_URL = "https://www.theverge.com/rss/index.xml"


def fetch_verge_articles():
    response = requests.get(VERGE_RSS_URL)
    if response.status_code != 200:
        raise Exception("Failed to retrieve data from The Verge")

    root = ET.fromstring(response.content)
    articles = []

    # Iterate through each 'entry' element in the XML
    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        title = entry.find("{http://www.w3.org/2005/Atom}title").text
        link = entry.find("{http://www.w3.org/2005/Atom}link").attrib.get("href")
        author_element = entry.find("{http://www.w3.org/2005/Atom}author")
        author = (
            author_element.find("{http://www.w3.org/2005/Atom}name").text
            if author_element is not None
            else "Unknown"
        )
        published = entry.find("{http://www.w3.org/2005/Atom}updated").text
        summary = (
            entry.find("{http://www.w3.org/2005/Atom}summary").text
            if entry.find("{http://www.w3.org/2005/Atom}summary") is not None
            else ""
        )

        # Append the parsed article to the list
        articles.append(
            {
                "title": title,
                "link": link,
                "author": author,
                "published": published,
                "summary": summary,
            }
        )

    return articles


if __name__ == "__main__":
    articles = fetch_verge_articles()
    for article in articles:
        print(article)
