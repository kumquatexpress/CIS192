from flask import Flask, request, jsonify
import json


app = Flask(__name__)


@app.route("/")
def main_page():
    return "hello"


if __name__ == "__main__":
    app.run(debug=False)
