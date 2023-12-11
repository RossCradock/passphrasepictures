import secrets
import json
from pathlib import Path

def passphrase_generator(number_of_words):
    number_of_words = int(number_of_words)
    if number_of_words > 7:
        return 'Error: Too many words'
    #return json.dumps(['correct', 'horse', 'battery','staple'])
    try:
        file_path = Path(__file__).with_name('pictionary_words.txt')
        with file_path.open('r') as file:
            lines = file.readlines()
            words = [secrets.choice(lines) for _ in range(number_of_words)]
            words = [word.strip() for word in words]
            return json.dumps(words)
    except FileNotFoundError:
        return f"Error: wordlist not found."
    except Exception as e:
        return f"Error: {str(e)}"

