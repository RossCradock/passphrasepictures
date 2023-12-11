import config
from openai import OpenAI

def request_image(story):
    client = OpenAI(api_key=config.API_KEY)

    try:
        image = client.images.generate(
            #model="dall-e-3", # requires size "1024x1024"
            prompt=story,
            #size="1024x1024",
            size="512x512",
            quality="standard",
            n=1
        )
        return image.data[0].url
    except Exception as e:
        return [f'Error: failed to fetch images. {e}']
