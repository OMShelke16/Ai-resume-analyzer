import os
import re
from typing import Dict, List, Any, Optional
import docx
from .skill_extractor import skill_extractor

# Optional PDF readers
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    import pypdf
except ImportError:
    pypdf = None

try:
    import fitz  # PyMuPDF
except ImportError:
    fitz = None

class ResumeParser:
    def __init__(self):
        self.email_regex = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b")
        self.phone_regex = re.compile(r"(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}\b")

        # Academic Degree patterns with strict word boundaries
        self.degree_patterns = [
            (r"\b(?:B\.?Tech(?:nology)?|Bachelor\s+of\s+Technology)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Bachelor of Technology"),
            (r"\b(?:B\.?E\.?|Bachelor\s+of\s+Engineering)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Bachelor of Engineering"),
            (r"\b(?:B\.?S\.?c?(?:\s+in|\s+of)?|Bachelor\s+of\s+Science)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Bachelor of Science"),
            (r"\b(?:B\.?C\.?A\.?|Bachelor\s+of\s+Computer\s+Applications)\b", "Bachelor of Computer Applications"),
            (r"\b(?:B\.?B\.?A\.?|Bachelor\s+of\s+Business\s+Administration)\b", "Bachelor of Business Administration"),
            (r"\b(?:B\.?A\.?|Bachelor\s+of\s+Arts)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Bachelor of Arts"),
            (r"\b(?:B\.?Com\.?|Bachelor\s+of\s+Commerce)\b", "Bachelor of Commerce"),
            (r"\bBachelor(?:'s)?(?:\s+Degree)?(?:\s+in|\s+of\s+[A-Za-z\s&,]+)?\b", "Bachelor's Degree"),
            (r"\b(?:M\.?Tech(?:nology)?|Master\s+of\s+Technology)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Master of Technology"),
            (r"\b(?:M\.?E\.?|Master\s+of\s+Engineering)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Master of Engineering"),
            (r"\b(?:M\.?S\.?c?(?:\s+in|\s+of)?|Master\s+of\s+Science)(?:\s+(?:in|–|-)\s+[A-Za-z\s&,]+)?\b", "Master of Science"),
            (r"\b(?:M\.?C\.?A\.?|Master\s+of\s+Computer\s+Applications)\b", "Master of Computer Applications"),
            (r"\b(?:M\.?B\.?A\.?|Master\s+of\s+Business\s+Administration)\b", "Master of Business Administration"),
            (r"\b(?:M\.?A\.?|Master\s+of\s+Arts)\b", "Master of Arts"),
            (r"\bMaster(?:'s)?(?:\s+Degree)?(?:\s+in|\s+of\s+[A-Za-z\s&,]+)?\b", "Master's Degree"),
            (r"\b(?:Ph\.?D\.?|Doctor\s+of\s+Philosophy|Doctorate)\b", "Doctor of Philosophy (Ph.D.)"),
            (r"\bDiploma(?:\s+in\s+[A-Za-z\s&,]+)?\b", "Diploma"),
            (r"\b(?:Senior\s+Secondary|Higher\s+Secondary|Class\s+XII|Class\s+12|12th\s+(?:Grade|Standard|CBSE|ICSE|State\s+Board)?)\b", "Senior Secondary (Class XII)"),
            (r"\b(?:Secondary\s+School|High\s+School|Class\s+X|Class\s+10|10th\s+(?:Grade|Standard|CBSE|ICSE|State\s+Board)?)\b", "High School (Class X)")
        ]

        # Section Header regex patterns
        self.section_headers = {
            "education": [
                r"^education\b", r"^academic\s+background\b", r"^academic\s+qualification[s]?\b",
                r"^academics\b", r"^educational\s+qualification[s]?\b", r"^academic\s+record\b", r"^degrees\b"
            ],
            "experience": [
                r"^experience\b", r"^work\s+experience\b", r"^professional\s+experience\b",
                r"^employment\s+history\b", r"^work\s+history\b", r"^internships?\b",
                r"^internship\s+experience\b", r"^professional\s+background\b", r"^relevant\s+experience\b",
                r"^employment\b", r"^career\s+history\b"
            ],
            "projects": [
                r"^projects?\b", r"^personal\s+projects?\b", r"^academic\s+projects?\b",
                r"^key\s+projects?\b", r"^notable\s+projects?\b", r"^technical\s+projects?\b",
                r"^selected\s+projects?\b", r"^capstone\s+projects?\b"
            ],
            "skills": [
                r"^skills?\b", r"^technical\s+skills?\b", r"^core\s+competencies\b",
                r"^skills\s*&\s*tools\b", r"^technologies\b", r"^key\s+skills?\b",
                r"^expertise\b", r"^areas\s+of\s+expertise\b", r"^programming\s+skills?\b",
                r"^technical\s+proficiencies\b", r"^skills\s+summary\b"
            ],
            "certifications": [
                r"^certifications?\b", r"^certificates?\b", r"^licenses\s*&\s*certifications?\b",
                r"^courses\s*&\s*certifications?\b", r"^credentials?\b", r"^achievements?\b",
                r"^honors\s*&\s*awards?\b", r"^awards\s*&\s*certifications?\b"
            ],
            "summary": [
                r"^summary\b", r"^professional\s+summary\b", r"^career\s+objective\b",
                r"^objective\b", r"^about\s+me\b", r"^profile\b", r"^executive\s+summary\b"
            ]
        }

        # Professional Role Titles
        self.role_keywords = [
            "software engineer", "software developer", "frontend developer", "frontend engineer",
            "backend developer", "backend engineer", "full stack developer", "full stack engineer",
            "web developer", "mobile developer", "android developer", "ios developer",
            "data scientist", "data engineer", "data analyst", "machine learning engineer",
            "ai engineer", "deep learning engineer", "nlp engineer", "computer vision engineer",
            "devops engineer", "cloud engineer", "cloud architect", "site reliability engineer",
            "qa engineer", "quality assurance engineer", "test engineer", "automation engineer",
            "database administrator", "system administrator", "security engineer", "cybersecurity analyst",
            "product manager", "project manager", "scrum master", "technical lead", "tech lead",
            "engineering manager", "intern", "trainee", "associate", "consultant", "developer", "engineer"
        ]

        # Academic / Educational Institution keywords
        self.institution_keywords = [
            "university", "institute", "college", "school", "academy", "campus",
            "iit", "nit", "iiit", "bits", "dps", "vidyalaya", "polytechnic", "autonomous", "faculty"
        ]

    def extract_text_from_file(self, file_path: str) -> str:
        """Extracts text from PDF, DOCX, or TXT file with robust fallback mechanisms."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        ext = file_path.rsplit(".", 1)[-1].lower()

        if ext == "pdf":
            return self._extract_text_from_pdf(file_path)
        elif ext in ["docx", "doc"]:
            return self._extract_text_from_docx(file_path)
        elif ext == "txt":
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        else:
            raise ValueError(f"Unsupported file format: .{ext}")

    def _extract_text_from_pdf(self, file_path: str) -> str:
        text = ""
        # 1. Try pdfplumber for best layout extraction
        if pdfplumber is not None:
            try:
                with pdfplumber.open(file_path) as pdf:
                    pages_text = [page.extract_text() or "" for page in pdf.pages]
                    text = "\n".join(pages_text).strip()
                    if text and len(text) > 40:
                        return text
            except Exception as e:
                print(f"pdfplumber extraction failed: {e}")

        # 2. Try PyMuPDF (fitz)
        if fitz is not None:
            try:
                doc = fitz.open(file_path)
                pages_text = [page.get_text() for page in doc]
                text = "\n".join(pages_text).strip()
                if text and len(text) > 40:
                    return text
            except Exception as e:
                print(f"PyMuPDF extraction failed: {e}")

        # 3. Try pypdf
        if pypdf is not None:
            try:
                reader = pypdf.PdfReader(file_path)
                pages_text = [page.extract_text() or "" for page in reader.pages]
                text = "\n".join(pages_text).strip()
                if text:
                    return text
            except Exception as e:
                print(f"pypdf extraction failed: {e}")

        return text

    def _extract_text_from_docx(self, file_path: str) -> str:
        try:
            doc = docx.Document(file_path)
            full_text = []
            for para in doc.paragraphs:
                if para.text.strip():
                    full_text.append(para.text.strip())
            
            # Extract from tables as well
            for table in doc.tables:
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        full_text.append(" | ".join(row_text))
            
            return "\n".join(full_text)
        except Exception as e:
            print(f"python-docx extraction failed: {e}")
            return ""

    def extract_candidate_name(self, text: str, lines: List[str]) -> str:
        """
        Extracts candidate's full name from the header/initial lines of the resume.
        """
        for line in lines[:8]:
            cleaned = line.strip(" -|,:_~*#\t")
            # Ignore headers, emails, phones, URLs
            if not cleaned or "@" in cleaned or "http" in cleaned or "github" in cleaned or "linkedin" in cleaned:
                continue
            if re.search(r"\b(resume|curriculum vitae|cv|page|profile|summary|contact|email|phone|address)\b", cleaned, re.IGNORECASE):
                continue
            # A valid name line is typically 1 to 4 words, alphabetic characters
            words = cleaned.split()
            if 1 <= len(words) <= 4 and all(re.match(r"^[A-Za-z\.\'-]+$", w) for w in words):
                return cleaned.title()

        return "Not detected"

    def extract_email(self, text: str) -> str:
        matches = self.email_regex.findall(text)
        return matches[0] if matches else "Not detected"

    def extract_phone(self, text: str) -> str:
        for match in self.phone_regex.finditer(text[:1200]):
            val = match.group(0).strip()
            digits = re.sub(r"\D", "", val)
            if 10 <= len(digits) <= 13:
                # Exclude if it looks like a year range e.g. 20202024
                if len(digits) == 8 and digits.startswith("20") and "20" in digits[2:]:
                    continue
                return val
        return "Not detected"

    def extract_location(self, text: str, lines: List[str]) -> str:
        """Finds common Indian or global tech hubs/cities in header lines."""
        cities = [
            "Bengaluru", "Bangalore", "Hyderabad", "Pune", "Mumbai", "Delhi", "New Delhi",
            "Noida", "Gurugram", "Gurgaon", "Chennai", "Kolkata", "Ahmedabad", "Jaipur",
            "Indore", "Kochi", "Chandigarh", "San Francisco", "New York", "London", "Seattle",
            "Palo Alto", "Menlo Park", "Mountain View", "Sunnyvale", "Austin", "Boston", "Remote"
        ]
        city_pattern = re.compile(r"\b(" + "|".join(cities) + r")\b", re.IGNORECASE)
        for line in lines[:10]:
            match = city_pattern.search(line)
            if match:
                return match.group(0).capitalize()

        match = city_pattern.search(text)
        return match.group(0).capitalize() if match else "Not detected"

    def segment_sections(self, text: str) -> Dict[str, str]:
        """Segments resume text into section blocks based on semantic headings."""
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        sections = {
            "header": [],
            "education": [],
            "experience": [],
            "projects": [],
            "skills": [],
            "certifications": [],
            "summary": [],
            "other": []
        }

        current_sec = "header"

        for line in lines:
            cleaned = line.strip(" -#*:=_~|•\t")
            cleaned_lower = cleaned.lower()

            # Check if this line is a section header
            # Section headers are short, <= 45 chars, <= 5 words, and not bullet points
            matched_sec = None
            if len(cleaned.split()) <= 5 and len(cleaned) <= 45 and not line.startswith(("•", "*", "- ", "– ", "— ")):
                for sec_name, patterns in self.section_headers.items():
                    for pat in patterns:
                        if re.search(pat, cleaned_lower):
                            matched_sec = sec_name
                            break
                    if matched_sec:
                        break

            if matched_sec:
                current_sec = matched_sec
            else:
                sections[current_sec].append(line)

        return {k: "\n".join(v).strip() for k, v in sections.items()}

    def extract_education(self, text: str, edu_section_text: str) -> List[Dict[str, str]]:
        """
        Extracts educational qualifications (degrees, institutions, graduation dates)
        strictly from the education section or explicit degree matches.
        """
        target_text = edu_section_text if edu_section_text.strip() else ""
        edu_list = []
        year_pattern = re.compile(r"\b(20\d{2}|19\d{2})\b")
        date_range_pattern = re.compile(r"\b(?:20\d{2}|19\d{2})\s*(?:-|to|–|—)\s*(?:20\d{2}|19\d{2}|Present|Current)\b", re.IGNORECASE)

        if target_text:
            lines = [l.strip() for l in target_text.split("\n") if l.strip()]
            i = 0
            while i < len(lines):
                line = lines[i]
                degree_found = None

                for pat, canon in self.degree_patterns:
                    m = re.search(pat, line, re.IGNORECASE)
                    if m:
                        degree_found = m.group(0).strip()
                        break

                if degree_found:
                    # Look for years on this line
                    range_match = date_range_pattern.search(line)
                    grad_year = range_match.group(0) if range_match else None
                    if not grad_year:
                        years = year_pattern.findall(line)
                        grad_year = years[-1] if years else None

                    inst = ""
                    # Check if line contains delimiters separating degree from institution
                    if any(sep in line for sep in [" | ", " - ", " – ", " — ", " at "]):
                        parts = [p.strip() for p in re.split(r"\s+[\|\-–—]\s+|\s+at\s+", line) if p.strip()]
                        for part in parts:
                            part_clean = re.sub(date_range_pattern, "", part)
                            part_clean = re.sub(r"\b(20\d{2}|19\d{2})\b", "", part_clean).strip(" -|,:|()")
                            if any(re.search(pat, part, re.IGNORECASE) for pat, _ in self.degree_patterns):
                                degree_found = part_clean
                            elif len(part_clean) > 3 and not inst:
                                inst = part_clean

                    if not inst:
                        remaining_line = line.replace(degree_found, "").strip(" -|,:")
                        if remaining_line:
                            cleaned_rem = re.sub(date_range_pattern, "", remaining_line)
                            cleaned_rem = re.sub(r"\b(20\d{2}|19\d{2})\b", "", cleaned_rem)
                            cleaned_rem = re.sub(r"CGPA.*|Percentage.*|GPA.*|\b\d{1,2}(?:\.\d+)?%?", "", cleaned_rem, flags=re.IGNORECASE).strip(" -|,:|()")
                            if len(cleaned_rem) > 3 and any(ik in cleaned_rem.lower() for ik in self.institution_keywords):
                                inst = cleaned_rem

                    # Check next 1-2 lines for institution or years
                    lookahead = 1
                    while lookahead <= 2 and i + lookahead < len(lines):
                        nxt = lines[i + lookahead]
                        if any(re.search(pat, nxt, re.IGNORECASE) for pat, _ in self.degree_patterns):
                            break
                        
                        if not grad_year:
                            rm = date_range_pattern.search(nxt)
                            if rm:
                                grad_year = rm.group(0)
                            else:
                                ny = year_pattern.findall(nxt)
                                if ny:
                                    grad_year = ny[-1]

                        cleaned_nxt = re.sub(date_range_pattern, "", nxt)
                        cleaned_nxt = re.sub(r"\b(20\d{2}|19\d{2})\b", "", cleaned_nxt)
                        cleaned_nxt = re.sub(r"CGPA.*|Percentage.*|GPA.*|\b\d{1,2}(?:\.\d+)?%?", "", cleaned_nxt, flags=re.IGNORECASE).strip(" -|,:|()")
                        if len(cleaned_nxt) > 3 and (not inst or any(ik in cleaned_nxt.lower() for ik in self.institution_keywords)):
                            inst = cleaned_nxt

                        lookahead += 1

                    # If institution still not found, check previous line
                    if not inst and i > 0:
                        prev_line = lines[i - 1]
                        if not any(re.search(pat, prev_line, re.IGNORECASE) for pat, _ in self.degree_patterns):
                            cleaned_prev = re.sub(date_range_pattern, "", prev_line)
                            cleaned_prev = re.sub(r"\b(20\d{2}|19\d{2})\b", "", cleaned_prev)
                            cleaned_prev = re.sub(r"CGPA.*|Percentage.*|GPA.*", "", cleaned_prev, flags=re.IGNORECASE).strip(" -|,:|()")
                            if len(cleaned_prev) > 3 and any(ik in cleaned_prev.lower() for ik in self.institution_keywords):
                                inst = cleaned_prev

                    if not inst:
                        inst = "University / College"

                    # Clean degree formatting
                    clean_deg = degree_found.strip(" -|,:|()")
                    if clean_deg.count("(") > clean_deg.count(")"):
                        clean_deg += ")"
                    elif clean_deg.count(")") > clean_deg.count("("):
                        clean_deg = clean_deg.rstrip(")")

                    edu_list.append({
                        "degree": clean_deg,
                        "institution": inst,
                        "graduation_year": grad_year or "Not detected"
                    })
                i += 1
        else:
            # Fallback across document lines ONLY when explicit degree patterns match with strict boundaries
            lines = [l.strip() for l in text.split("\n") if l.strip()]
            for line in lines:
                for pat, canon in self.degree_patterns:
                    m = re.search(pat, line, re.IGNORECASE)
                    if m:
                        deg = m.group(0).strip()
                        years = year_pattern.findall(line)
                        rem = line.replace(deg, "").strip(" -|,:")
                        rem = re.sub(r"\b(20\d{2}|19\d{2})\b", "", rem).strip(" -|,:")
                        inst = rem if len(rem) > 3 and any(ik in rem.lower() for ik in self.institution_keywords) else "University / Institute"
                        edu_list.append({
                            "degree": deg,
                            "institution": inst,
                            "graduation_year": years[-1] if years else "Not detected"
                        })
                        break

        # Deduplicate
        unique_edu = []
        seen = set()
        for e in edu_list:
            key = (e["degree"].lower()[:20], e["institution"].lower()[:20])
            if key not in seen:
                seen.add(key)
                unique_edu.append(e)

        return unique_edu

    def extract_experience(self, text: str, exp_section_text: str) -> List[Dict[str, Any]]:
        """
        Extracts professional job experiences (role title, company, dates, responsibilities)
        accurately without confusing with educational degrees.
        """
        target_text = exp_section_text if exp_section_text.strip() else ""
        exp_list = []
        
        date_range_pattern = re.compile(
            r"((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4})\s*(?:-|to|–|—)\s*((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*\d{4}|\d{4}|Present|Current)",
            re.IGNORECASE
        )

        lines = [l.strip() for l in target_text.split("\n") if l.strip()]
        current_exp = None
        i = 0

        while i < len(lines):
            line = lines[i]
            line_lower = line.lower()
            is_bullet = line.startswith(("•", "-", "*", "–", "—")) or (len(line) > 55 and any(line_lower.startswith(v) for v in ["developed", "built", "designed", "implemented", "managed", "led", "created", "responsible", "optimized", "collaborated", "architected", "integrated", "spearheaded"]))

            has_role = any(re.search(r"\b" + re.escape(rk) + r"\b", line_lower) for rk in self.role_keywords)
            date_match = date_range_pattern.search(line)

            # Check if this line is an experience entry header
            if not is_bullet and (has_role or (date_match and len(line.split()) <= 8)):
                is_new_entry = False
                if current_exp is None:
                    is_new_entry = True
                elif has_role:
                    if current_exp["title"] and (current_exp["duration"] != "Not detected" or current_exp["responsibilities"] or current_exp["company"] != "Tech Organization"):
                        is_new_entry = True
                    else:
                        is_new_entry = False
                elif date_match and current_exp["duration"] != "Not detected":
                    is_new_entry = True

                if is_new_entry:
                    if current_exp:
                        exp_list.append(current_exp)
                    
                    duration = date_match.group(0) if date_match else "Not detected"
                    clean_header = line
                    if date_match:
                        clean_header = clean_header.replace(duration, "").strip(" -|,:|()")

                    parts = [p.strip() for p in re.split(r"\|| - | at | – | — ", clean_header) if p.strip()]
                    title = ""
                    company = ""

                    if has_role:
                        for part in parts:
                            if any(re.search(r"\b" + re.escape(rk) + r"\b", part.lower()) for rk in self.role_keywords):
                                if not title:
                                    title = part
                                else:
                                    company = part
                            else:
                                if not company:
                                    company = part
                        if not title and parts:
                            title = parts[0]
                    else:
                        if parts:
                            company = parts[0]

                    current_exp = {
                        "title": title or "",
                        "company": company or "",
                        "duration": duration,
                        "responsibilities": []
                    }
                else:
                    # Enrich existing current_exp
                    if date_match and current_exp["duration"] == "Not detected":
                        current_exp["duration"] = date_match.group(0)
                        rem = line.replace(current_exp["duration"], "").strip(" -|,:|()")
                        if rem and not current_exp["company"]:
                            current_exp["company"] = rem.split("|")[0].split("-")[0].strip()
                    elif not current_exp["company"]:
                        parts = [p.strip() for p in re.split(r"\|| - | at ", line) if p.strip()]
                        if parts:
                            current_exp["company"] = parts[0]
            elif not is_bullet and current_exp and (not current_exp["company"] or current_exp["duration"] == "Not detected"):
                if date_match and current_exp["duration"] == "Not detected":
                    current_exp["duration"] = date_match.group(0)
                    rem = line.replace(current_exp["duration"], "").strip(" -|,:|()")
                    if rem and not current_exp["company"]:
                        current_exp["company"] = rem.split("|")[0].split("-")[0].strip()
                elif not current_exp["company"]:
                    parts = [p.strip() for p in re.split(r"\|| - | at ", line) if p.strip()]
                    current_exp["company"] = parts[0] if parts else line
            elif current_exp:
                # Add responsibility bullet point
                cleaned_line = line.lstrip("•-*–— \t")
                if len(cleaned_line) > 8 and len(current_exp["responsibilities"]) < 5:
                    if not date_range_pattern.match(cleaned_line):
                        current_exp["responsibilities"].append(cleaned_line)

            i += 1

        if current_exp:
            if not current_exp["title"]:
                current_exp["title"] = "Software Professional"
            if not current_exp["company"]:
                current_exp["company"] = "Tech Organization"
            exp_list.append(current_exp)

        # Final filtering pass
        cleaned_exp_list = []
        for exp in exp_list:
            if not exp["title"]:
                exp["title"] = "Software Professional"
            if not exp["company"]:
                exp["company"] = "Tech Organization"
            # Ensure degrees are never parsed as experience
            if any(re.search(pat, exp["title"], re.IGNORECASE) for pat, _ in self.degree_patterns):
                continue
            cleaned_exp_list.append(exp)

        return cleaned_exp_list

    def extract_projects(self, text: str, proj_section_text: str) -> List[Dict[str, Any]]:
        """
        Extracts key software projects, tech stacks, and descriptions.
        """
        target_text = proj_section_text if proj_section_text.strip() else ""
        projects_list = []
        lines = [l.strip() for l in target_text.split("\n") if l.strip()]

        current_proj = None
        i = 0

        while i < len(lines):
            line = lines[i]
            is_bullet = line.startswith(("•", "-", "*", "–", "—"))
            is_tech_line = any(line.lower().startswith(tk) for tk in ["technologies:", "tech stack:", "tools:", "technologies used:", "built with:"])

            if is_tech_line and current_proj:
                # Extract tech stack
                tech_content = re.sub(r"^(?:technologies|tech stack|tools|technologies used|built with)\s*[:\-]\s*", "", line, flags=re.IGNORECASE).strip()
                current_proj["technologies"] = tech_content
            elif not is_bullet and len(line.split()) <= 10 and len(line) <= 80:
                # Project Name Header
                if current_proj:
                    projects_list.append(current_proj)
                    current_proj = None

                name = line
                tech = "Python, Web Technologies"
                if "|" in line:
                    parts = line.split("|", 1)
                    name = parts[0].strip()
                    tech = parts[1].strip()
                elif "(" in line and ")" in line:
                    m = re.search(r"\((.*?)\)", line)
                    if m:
                        tech = m.group(1).strip()
                        name = line.replace(m.group(0), "").strip()

                current_proj = {
                    "name": name.strip(" -:"),
                    "technologies": tech,
                    "description": ""
                }
            elif current_proj:
                cleaned_desc = line.lstrip("•-*–— \t")
                if not current_proj["description"]:
                    current_proj["description"] = cleaned_desc
                else:
                    current_proj["description"] += " " + cleaned_desc

            i += 1

        if current_proj:
            projects_list.append(current_proj)

        return projects_list[:4]

    def extract_certifications(self, text: str, cert_section_text: str) -> List[str]:
        target_text = cert_section_text if cert_section_text.strip() else text
        cert_list = []
        lines = [l.strip() for l in target_text.split("\n") if l.strip()]
        
        cert_keywords = ["certified", "certification", "coursera", "udemy", "hackerrank", "aws", "google", "microsoft", "nptel", "specialization", "credential"]
        for line in lines:
            if any(ck in line.lower() for ck in cert_keywords) and len(line) < 120 and not line.lower().startswith("certifications"):
                cert_list.append(line.lstrip("•-*–— "))

        return cert_list[:5]

    def parse(self, text: str) -> Dict[str, Any]:
        """
        Parses full resume text into structured fields without hallucinating unobserved content.
        """
        if not text or not isinstance(text, str):
            text = ""

        lines = [l.strip() for l in text.split("\n") if l.strip()]
        sections = self.segment_sections(text)
        
        name = self.extract_candidate_name(text, lines)
        email = self.extract_email(text)
        phone = self.extract_phone(text)
        location = self.extract_location(text, lines)
        
        categorized_skills = skill_extractor.extract_skills(text)
        education = self.extract_education(text, sections.get("education", ""))
        experience = self.extract_experience(text, sections.get("experience", ""))
        projects = self.extract_projects(text, sections.get("projects", ""))
        certifications = self.extract_certifications(text, sections.get("certifications", ""))

        return {
            "candidate_name": name,
            "email": email,
            "phone": phone,
            "location": location,
            "skills": categorized_skills,
            "education": education,
            "experience": experience,
            "projects": projects,
            "certifications": certifications,
            "raw_text": text
        }

# Global singleton
resume_parser = ResumeParser()
