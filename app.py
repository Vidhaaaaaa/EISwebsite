import os
from pathlib import Path
import requests
import json
from datetime import datetime

from flask import Flask, render_template, request, jsonify


def create_app() -> Flask:
    app = Flask(__name__)

    def list_gallery_images() -> list[str]:
        gallery_dir = Path(app.static_folder) / "gallery"
        if not gallery_dir.exists():
            return []

        allowed = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
        items: list[str] = []
        for name in sorted(os.listdir(gallery_dir)):
            ext = Path(name).suffix.lower()
            if ext in allowed:
                items.append(f"gallery/{name}")
        return items

    HERO_BG = "img/hero-bg.svg"

    @app.route("/")
    def home():
        return render_template(
            "home.html",
            hero_bg=HERO_BG,
            images=list_gallery_images()[:6]
        )

    @app.route("/about")
    def about():
        return render_template("about.html")

    @app.route("/gallery")
    def gallery():
        return render_template(
            "gallery.html",
            images=list_gallery_images(),
        )

    @app.route("/get-involved")
    def get_involved():
        return render_template("get_involved.html")
    
    @app.route("/event-form")
    def event_form():
        return render_template("event_form.html")
    
    @app.route("/submit-registration", methods=["POST"])
    def submit_registration():
        try:
            # Get form data
            data = request.json
            
            # Add timestamp
            data['timestamp'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            
            # Send to Google Sheet via Apps Script using GET method
            script_url = "https://script.google.com/macros/s/AKfycbwZsleJEs3Of7TzmMe3QlgPw-SlZxlQIRp0v8Jd6_VzZEgY0ppWRzkgql9UjHfejHCm/exec"
            
            # Convert data to URL parameters
            params = {}
            for key, value in data.items():
                if value:  # Only include non-empty values
                    params[key] = str(value)
            
            response = requests.get(
                script_url,
                params=params,
                timeout=30
            )
            
            return jsonify({
                'status': 'success',
                'message': 'Registration submitted successfully!',
                'script_response': response.text
            })
            
        except Exception as e:
            print(f"Error submitting registration: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': f'Error: {str(e)}'
            }), 500
    
    @app.route("/pwing")
    def pwing():
        return "pwong"

    return app


if __name__ == "__main__":
    application = create_app()
    debug = os.environ.get("FLASK_ENV") == "development"
    port = int(os.environ.get("PORT", 5000))
    application.run(host="0.0.0.0", port=port, debug=debug)

