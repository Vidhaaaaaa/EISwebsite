import os
from pathlib import Path

from flask import Flask, render_template


def create_app() -> Flask:
    app = Flask(__name__)

    def list_gallery_images() -> list[str]:
        """
        Drop images into: static/gallery/
        They will automatically appear on /gallery (no code changes needed).
        """
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

    EVENTS = [
        {
            "title": "Build Night",
            "meta": "Monthly · Low-pressure co-work + tiny demos",
        },
        {
            "title": "Prototype Sprint",
            "meta": "Weekend · Idea → prototype → story",
        },
        {
            "title": "Founder AMA",
            "meta": "Small room · Honest Q&A",
        },
    ]

    HERO_BG = "img/hero-bg.svg"

    @app.route("/")
    def home():
        return render_template(
            "home.html",
            hero_bg=HERO_BG,
            events=EVENTS,
            gallery_preview=list_gallery_images()[:6],
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

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True)

