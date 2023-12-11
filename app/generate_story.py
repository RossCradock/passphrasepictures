import config
from openai import OpenAI

def request_story(words):
    client = OpenAI(api_key=config.API_KEY)

    try:
        completion = client.chat.completions.create(
          model="gpt-3.5-turbo",
          messages=[
            {"role": "system", "content": "You are an assistant who provides single sentence stories in the present tense which are as short as possible and must include the given items. The sentence should be a story that can also be used in an image generation prompt"},
            {"role": "user", "content": words}
          ]
        )
        print(completion)
        return str(completion.choices[0].message.content)
    except Exception as e:
        return [f'Error: failed generate the story. {e}']
