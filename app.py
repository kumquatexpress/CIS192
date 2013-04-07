from flask import Flask, request, jsonify, render_template, url_for
import json


app = Flask(__name__)


@app.route("/")
def main_page():
    return render_template('hierarchy.html')


@app.route("/hierarchy")
def hierarchy():
    return render_template('hierarchy.html')


if __name__ == "__main__":
    app.run(debug=False)
