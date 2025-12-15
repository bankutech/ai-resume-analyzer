from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from werkzeug.utils import secure_filename
import PyPDF2
from docx import Document
import re

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    try:
        with open(file_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    text = ""
    try:
        doc = Document(file_path)
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX: {e}")
    return text

def extract_text_from_file(file_path, file_type):
    """Extract text based on file type"""
    if file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    elif file_type == 'docx':
        return extract_text_from_docx(file_path)
    else:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()

def analyze_resume_creatively(text):
    """Creative AI-powered resume analysis"""
    
    # Extract key information
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    linkedin_pattern = r'linkedin\.com/in/[\w-]+'
    github_pattern = r'github\.com/[\w-]+'
    
    emails = re.findall(email_pattern, text)
    phones = re.findall(phone_pattern, text)
    linkedin = re.findall(linkedin_pattern, text, re.IGNORECASE)
    github = re.findall(github_pattern, text, re.IGNORECASE)
    
    # Count sections
    sections = {
        'experience': len(re.findall(r'(experience|work history|employment|professional experience)', text, re.IGNORECASE)),
        'education': len(re.findall(r'(education|university|college|degree|bachelor|master|phd)', text, re.IGNORECASE)),
        'skills': len(re.findall(r'(skills|technical skills|competencies)', text, re.IGNORECASE)),
        'projects': len(re.findall(r'(projects|project|portfolio)', text, re.IGNORECASE)),
        'certifications': len(re.findall(r'(certification|certified|certificate)', text, re.IGNORECASE)),
    }
    
    # Analyze content quality
    word_count = len(text.split())
    char_count = len(text)
    
    # Skill keywords (common tech and soft skills)
    tech_skills = ['python', 'javascript', 'java', 'react', 'node', 'sql', 'aws', 'docker', 
                   'kubernetes', 'git', 'agile', 'scrum', 'machine learning', 'ai', 'data science']
    soft_skills = ['leadership', 'communication', 'teamwork', 'problem solving', 'analytical', 
                   'creative', 'collaboration', 'management']
    
    found_tech_skills = [skill for skill in tech_skills if skill.lower() in text.lower()]
    found_soft_skills = [skill for skill in soft_skills if skill.lower() in text.lower()]
    
    # Calculate scores (0-100)
    scores = {
        'completeness': min(100, (len(emails) * 20 + len(phones) * 20 + len(linkedin) * 20 + len(github) * 20 + sum(sections.values()) * 4)),
        'content_quality': min(100, (word_count / 10) + (len(found_tech_skills) * 5) + (len(found_soft_skills) * 3)),
        'professionalism': min(100, (len(emails) * 30 + len(linkedin) * 30 + (1 if word_count > 200 else 0) * 40)),
        'technical_depth': min(100, len(found_tech_skills) * 10),
        'creativity': min(100, (len(found_soft_skills) * 10 + (1 if len(github) > 0 else 0) * 30 + (1 if sections['projects'] > 0 else 0) * 20)),
        'overall': 0
    }
    
    scores['overall'] = sum(scores.values()) / len([k for k in scores.keys() if k != 'overall'])
    
    # Generate creative insights
    personality_traits = []
    if scores['creativity'] > 70:
        personality_traits.append("Innovative Thinker")
    if scores['technical_depth'] > 70:
        personality_traits.append("Technical Expert")
    if sections['projects'] > 2:
        personality_traits.append("Project-Driven")
    if len(found_soft_skills) > 5:
        personality_traits.append("Well-Rounded Professional")
    if len(github) > 0:
        personality_traits.append("Code Contributor")
    
    if not personality_traits:
        personality_traits.append("Emerging Professional")
    
    # Generate improvement suggestions
    suggestions = []
    if scores['completeness'] < 70:
        suggestions.append("Add more contact information and professional links")
    if scores['technical_depth'] < 60:
        suggestions.append("Highlight more technical skills and technologies")
    if sections['projects'] == 0:
        suggestions.append("Include a projects section to showcase your work")
    if word_count < 300:
        suggestions.append("Expand on your experiences with more detail")
    if len(found_soft_skills) < 3:
        suggestions.append("Add more soft skills to show your interpersonal abilities")
    if scores['creativity'] < 50:
        suggestions.append("Showcase creative projects or unique achievements")
    
    # Career trajectory prediction
    career_level = "Entry Level"
    if word_count > 800 and sections['experience'] > 3:
        career_level = "Senior Professional"
    elif word_count > 500 and sections['experience'] > 1:
        career_level = "Mid-Level Professional"
    
    # Generate strengths and areas for growth
    strengths = []
    if scores['technical_depth'] > 70:
        strengths.append("Strong technical foundation")
    if scores['professionalism'] > 70:
        strengths.append("Professional presentation")
    if sections['certifications'] > 0:
        strengths.append("Commitment to continuous learning")
    
    areas_for_growth = []
    if scores['content_quality'] < 60:
        areas_for_growth.append("Content depth and detail")
    if scores['creativity'] < 50:
        areas_for_growth.append("Creative expression and uniqueness")
    
    return {
        'scores': scores,
        'contact_info': {
            'emails': emails[:1],  # Limit to first email
            'phones': phones[:1],
            'linkedin': linkedin,
            'github': github
        },
        'sections_found': sections,
        'skills': {
            'technical': found_tech_skills,
            'soft': found_soft_skills,
            'total_count': len(found_tech_skills) + len(found_soft_skills)
        },
        'statistics': {
            'word_count': word_count,
            'character_count': char_count,
            'sections_count': sum(sections.values())
        },
        'personality_traits': personality_traits,
        'career_level': career_level,
        'strengths': strengths if strengths else ["Strong foundation to build upon"],
        'areas_for_growth': areas_for_growth if areas_for_growth else ["Continue developing your professional profile"],
        'suggestions': suggestions if suggestions else ["Your resume looks great! Keep refining it."],
        'creative_insights': {
            'resume_personality': personality_traits[0] if personality_traits else "Professional",
            'uniqueness_score': scores['creativity'],
            'market_readiness': "High" if scores['overall'] > 75 else "Medium" if scores['overall'] > 50 else "Developing"
        }
    }

@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            file_type = filename.rsplit('.', 1)[1].lower()
            text = extract_text_from_file(file_path, file_type)
            
            if not text or len(text.strip()) < 50:
                os.remove(file_path)
                return jsonify({'error': 'Could not extract meaningful text from file'}), 400
            
            analysis = analyze_resume_creatively(text)
            
            # Clean up uploaded file
            os.remove(file_path)
            
            return jsonify(analysis), 200
        else:
            return jsonify({'error': 'Invalid file type. Please upload PDF, DOCX, or TXT'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
