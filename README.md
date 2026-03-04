# EIS MUJ · Official Flask Website (v1)

This is a small Flask application for the **Entrepreneur & Innovation Society (EIS)** at **Manipal University Jaipur**.

It is designed to be:

- clean and modern
- focused on content, not clutter
- friendly for new visitors discovering the club for the first time

The site includes:

- `Home` – parallax hero, idea orbit visual, tracks overview
- `About` – how the society works and core values
- `Events` – example formats for upcoming activities
- `Get Involved` – who should join and a simple interest form (front-end only)

---

## Getting started

### 1. Create and activate a virtual environment (recommended)

In PowerShell, from the project folder:

```powershell
cd "c:\Users\admin\Desktop\all projects\EIS\EISwebsite"
python -m venv .venv
.venv\Scripts\Activate.ps1
```

### 2. Install dependencies

```powershell
pip install -r requirements.txt
```

### 3. Run the app

Option A – using `python` directly:

```powershell
python app.py
```

Then open `http://127.0.0.1:5000/` in your browser.

Option B – using Flask CLI:

```powershell
$env:FLASK_APP = "app:create_app"
flask run --debug
```

---

## Customising for EIS MUJ

- Update text in the templates inside the `templates/` folder:
  - `home.html`
  - `about.html`
  - `events.html`
  - `get_involved.html`
- Adjust colours, effects or layout in `static/css/styles.css`.
- Wire up the interest form in `get_involved.html` to an email service or database once you are ready.

