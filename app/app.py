from flask import Flask, render_template, request
from generate_image import request_image
from generate_story import request_story
from passphrase import passphrase_generator

app = Flask(__name__,template_folder='views')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/passphrase/')
def passphrase():
    number_of_words = request.args.get('number_of_words')
    return passphrase_generator(number_of_words)

@app.route('/generate_story/')
def generate_story():
    words = request.args.get('prompt')
    return request_story(words)

@app.route('/generate_image/')
def generate_image():
    story = request.args.get('story')
    return request_image(story)

if __name__ == '__main__':
    app.run(debug=True)
