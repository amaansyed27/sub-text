import fitz  # PyMuPDF

def create_predatory_tos(filename="predatory_terms.pdf"):
    doc = fitz.open()  # new empty PDF
    page = doc.new_page()
    
    content = [
        "TERMS OF SERVICE\n\n",
        "1. Introduction\n",
        "Welcome to our service. By using it, you agree to everything below.\n\n",
        "2. Data Rights (Red Flag)\n",
        "By using this app, you grant us a worldwide, irrevocable license to sell your personal data ",
        "to third-party advertisers for profit. We claim full ownership of any content you create.\n\n",
        "3. Cancellation (Red Flag)\n",
        "You may cancel your subscription at any time, but you will be charged a $500 'early termination fee' ",
        "regardless of when you cancel.\n\n",
        "4. Liability (Red Flag)\n",
        "We are not responsible for any damages, including physical harm, caused by our service. ",
        "You agree to waive your right to a trial by jury and must resolve all disputes via arbitration ",
        "in a location of our choosing.\n\n",
        "5. Hidden Fees\n",
        "A $10 monthly 'maintenance fee' will be charged to your card without further notice.\n"
    ]
    
    text = "".join(content)
    page.insert_text((50, 50), text, fontsize=12)
    
    doc.save(filename)
    print(f"Created {filename} using PyMuPDF")

if __name__ == "__main__":
    create_predatory_tos()
