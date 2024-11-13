from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import xml.etree.ElementTree as ET
from typing import List, Dict

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],  # Allows all origins; specify domains here if you want more control
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

VERGE_RSS_URL = "https://www.theverge.com/rss/index.xml"


@app.get("/verge-tech", response_model=List[Dict[str, str]])
async def fetch_verge_articles():
    try:
        response = requests.get(VERGE_RSS_URL)
        if response.status_code != 200:
            raise HTTPException(
                status_code=500, detail="Failed to retrieve data from The Verge"
            )

        root = ET.fromstring(response.content)
        articles = []

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
            content = (
                entry.find("{http://www.w3.org/2005/Atom}content").text
                if entry.find("{http://www.w3.org/2005/Atom}content") is not None
                else ""
            )
            # image = entry.find("{http://www.w3.org/2005/Atom}content/")
            articles.append(
                {
                    "title": title,
                    "link": link,
                    "author": author,
                    "published": published,
                    "content": content,
                    # "image": image
                }
            )

        return articles

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
