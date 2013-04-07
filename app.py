from flask import Flask, request, jsonify, render_template, url_for
import json


app = Flask(__name__)


@app.route("/")
def main_page():
    return render_template('index.html')


@app.route("/hierarchy")
def hierarchy():
    return render_template('hierarchy.html')


@app.route("/list")
def list():
    return render_template('list.html')


@app.route("/new")
def new():
    return render_template('new.html')


@app.route("/project")
def project():
    return render_template('project.html')


if __name__ == "__main__":
    app.run(debug=False)
