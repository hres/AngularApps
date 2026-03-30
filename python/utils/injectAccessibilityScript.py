import os

def inject_accessibility_script(final_file_path: str, accessibility_link: str, language: str):
    """
    Reads a JS file and injects it into the generated HTML before </body>.
    Replaces placeholders for URL and text based on language.
    """
    # Path to the JS file
    accessibility_js_file = os.path.join(os.path.dirname(__file__), '..', 'buildHtmlFiles', 'javascript', 'accessibilityLink.js')
    
    # Read the JS content
    with open(accessibility_js_file, "r", encoding="utf-8") as f:
        accessibility_script = f.read()

    # Replace placeholders
    accessibility_script = accessibility_script.replace("{{ACCESSIBILITY_URL}}", accessibility_link)
    accessibility_script = accessibility_script.replace(
        "{{ACCESSIBILITY_TEXT}}", "Accessibility statement" if language == "en" else "Déclaration d’accessibilité"
    )

    # Wrap in <script> tag
    accessibility_script = f"<script>\n{accessibility_script}\n</script>"

    # Inject before </body>
    with open(final_file_path, "r+", encoding="utf-8") as f:
        content = f.read()
        if "</body>" in content:
            content = content.replace("</body>", accessibility_script + "\n</body>")
        else:
            # fallback: append at the end
            content += accessibility_script
        f.seek(0)
        f.write(content)
        f.truncate()

    print(f".......... Accessibility script manually added from file to {final_file_path}")