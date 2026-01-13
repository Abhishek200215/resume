// ============================================
// PORTFOLIO & RESUME GENERATOR - FINAL FIXED VERSION
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Initializing Portfolio Generator');
    
    // Initialize all components
    initializeTheme();
    initializeNavigation();
    initializeForm();
    initializeTemplates();
    initializeExamples();
    initializePreview();
    initializeModals();
    initializeFooter();
    
    // Load sample data
    setTimeout(loadSampleData, 100);
    
    // Improvement: Load saved form data from localStorage
    loadSavedData();
    
    console.log('Portfolio Generator Initialized Successfully');
});

// ==================== THEME MANAGEMENT ====================
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        document.body.classList.toggle('light-mode');
        
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
}

// ==================== NAVIGATION ====================
function initializeNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileMenuBtn || !mobileMenuOverlay || !navLinks) return;
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
    });
    
    // Close menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', function() {
        navLinks.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
    });
    
    // Close menu when clicking links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
        });
    });
    
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== FORM INITIALIZATION ====================
function initializeForm() {
    console.log('Initializing form...');
    
    // Step navigation
    const steps = document.querySelectorAll('.step');
    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prevStepBtn');
    const nextBtn = document.getElementById('nextStepBtn');
    const generateBtn = document.getElementById('generateBtn');
    const progressFill = document.getElementById('progressFill');
    
    let currentStep = 1;
    
    // Initialize step 1 as active
    goToStep(1);
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentStep > 1) {
                goToStep(currentStep - 1);
            }
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (validateCurrentStep() && currentStep < 5) {
                goToStep(currentStep + 1);
            }
        });
    }
    
    // Generate button
    if (generateBtn) {
        generateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCurrentStep()) {
                showSuccessModal();
            }
        });
    }
    
    // Step click navigation
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.getAttribute('data-step'));
            if (stepNum < currentStep || validateCurrentStep()) {
                goToStep(stepNum);
            }
        });
    });
    
    // Form step function
    function goToStep(step) {
        if (step < 1 || step > 5) return;
        
        currentStep = step;
        
        // Update step indicators
        steps.forEach(s => {
            const stepNum = parseInt(s.getAttribute('data-step'));
            if (stepNum === step) {
                s.classList.add('active');
                s.classList.remove('completed');
            } else if (stepNum < step) {
                s.classList.remove('active');
                s.classList.add('completed');
            } else {
                s.classList.remove('active', 'completed');
            }
        });
        
        // Update progress bar
        const progressPercent = ((step - 1) / 4) * 100;
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        // Show/hide form steps
        formSteps.forEach(formStep => {
            const formStepNum = parseInt(formStep.getAttribute('data-step'));
            if (formStepNum === step) {
                formStep.classList.add('active');
            } else {
                formStep.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        if (prevBtn) prevBtn.style.display = step === 1 ? 'none' : 'flex';
        if (nextBtn) nextBtn.style.display = step === 5 ? 'none' : 'flex';
        if (generateBtn) generateBtn.style.display = step === 5 ? 'flex' : 'none';
        
        // Update preview
        updatePreview();
    }
    
    // Validation function (improved to cover all steps)
    function validateCurrentStep() {
        let isValid = true;
        
        switch(currentStep) {
            case 1:
                const fullName = document.getElementById('fullName');
                const profession = document.getElementById('profession');
                const email = document.getElementById('email');
                
                if (fullName && !fullName.value.trim()) {
                    showFieldError(fullName, 'Full name is required');
                    isValid = false;
                }
                if (profession && !profession.value.trim()) {
                    showFieldError(profession, 'Profession is required');
                    isValid = false;
                }
                if (email) {
                    if (!email.value.trim()) {
                        showFieldError(email, 'Email is required');
                        isValid = false;
                    } else if (!isValidEmail(email.value)) {
                        showFieldError(email, 'Please enter a valid email address');
                        isValid = false;
                    }
                }
                break;
            case 2:
                // Validate education sections
                document.querySelectorAll('#educationSection .section-item').forEach(item => {
                    const degree = item.querySelector('.education-degree');
                    const institution = item.querySelector('.education-institution');
                    if (degree && !degree.value.trim()) {
                        showFieldError(degree, 'Degree is required');
                        isValid = false;
                    }
                    if (institution && !institution.value.trim()) {
                        showFieldError(institution, 'Institution is required');
                        isValid = false;
                    }
                });
                break;
            case 3:
                // Validate experience sections
                document.querySelectorAll('#experienceSection .section-item').forEach(item => {
                    const title = item.querySelector('.experience-title');
                    const company = item.querySelector('.experience-company');
                    if (title && !title.value.trim()) {
                        showFieldError(title, 'Job title is required');
                        isValid = false;
                    }
                    if (company && !company.value.trim()) {
                        showFieldError(company, 'Company is required');
                        isValid = false;
                    }
                });
                break;
            case 4:
                // Validate projects (if added)
                document.querySelectorAll('#projectsSection .section-item').forEach(item => {
                    const name = item.querySelector('.project-name');
                    if (name && !name.value.trim()) {
                        showFieldError(name, 'Project name is required');
                        isValid = false;
                    }
                });
                // Skills and certifications optional, no strict validation
                break;
            case 5:
                // Customization optional
                break;
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.9rem; margin-top: 5px;';
        
        field.parentElement.appendChild(errorDiv);
        field.style.borderColor = '#dc3545';
        
        // Scroll to error
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Remove error after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
                field.style.borderColor = '';
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    // Initialize dynamic sections
    initializeDynamicSections();
    initializeSkills();
    initializeHobbies();
}

// ==================== DYNAMIC SECTIONS ====================
function initializeDynamicSections() {
    // Education
    const addEducationBtn = document.getElementById('addEducationBtn');
    if (addEducationBtn) {
        addEducationBtn.addEventListener('click', function() {
            addEducationSection();
        });
    }
    
    // Experience
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    if (addExperienceBtn) {
        addExperienceBtn.addEventListener('click', function() {
            addExperienceSection();
        });
    }
    
    // Projects
    const addProjectBtn = document.getElementById('addProjectBtn');
    if (addProjectBtn) {
        addProjectBtn.addEventListener('click', function() {
            addProjectSection();
        });
    }
    
    // Certifications
    const addCertificationBtn = document.getElementById('addCertificationBtn');
    if (addCertificationBtn) {
        addCertificationBtn.addEventListener('click', function() {
            addCertificationSection();
        });
    }
}

function addEducationSection() {
    const educationSection = document.getElementById('educationSection');
    if (!educationSection) return;
    
    const newIndex = educationSection.children.length;
    
    const sectionHTML = `
        <div class="section-item">
            <div class="form-grid">
                <div class="input-group">
                    <label>Degree/Qualification</label>
                    <input type="text" class="education-degree" placeholder="Bachelor of Computer Science">
                </div>
                <div class="input-group">
                    <label>Institution</label>
                    <input type="text" class="education-institution" placeholder="University of Technology">
                </div>
                <div class="input-group">
                    <label>Location</label>
                    <input type="text" class="education-location" placeholder="New York, USA">
                </div>
                <div class="input-group">
                    <label>Graduation Year</label>
                    <input type="number" class="education-year" placeholder="2020" min="1950" max="2030">
                </div>
                <div class="input-group full-width">
                    <label>Description/Achievements</label>
                    <textarea class="education-description" placeholder="Relevant coursework, achievements, or honors..." rows="3"></textarea>
                </div>
            </div>
            <button type="button" class="btn-remove-section">
                <i class="fas fa-trash"></i> Remove Education
            </button>
        </div>
    `;
    
    educationSection.insertAdjacentHTML('beforeend', sectionHTML);
    
    // Add event listener to remove button
    const newRemoveBtn = educationSection.lastElementChild.querySelector('.btn-remove-section');
    newRemoveBtn.addEventListener('click', function() {
        const section = this.closest('.section-item');
        if (educationSection.children.length > 1) {
            section.remove();
            updatePreview();
        } else {
            showNotification('Cannot remove the last education section. Clear fields if not needed.', 'error');
        }
    });
    
    updatePreview();
}

function addExperienceSection() {
    const experienceSection = document.getElementById('experienceSection');
    if (!experienceSection) return;
    
    const newIndex = experienceSection.children.length;
    
    const sectionHTML = `
        <div class="section-item">
            <div class="form-grid">
                <div class="input-group">
                    <label>Job Title</label>
                    <input type="text" class="experience-title" placeholder="Frontend Developer">
                </div>
                <div class="input-group">
                    <label>Company</label>
                    <input type="text" class="experience-company" placeholder="Tech Solutions Inc.">
                </div>
                <div class="input-group">
                    <label>Location</label>
                    <input type="text" class="experience-location" placeholder="San Francisco, CA">
                </div>
                <div class="input-group">
                    <label>Start Date</label>
                    <input type="month" class="experience-start">
                </div>
                <div class="input-group">
                    <label>End Date</label>
                    <input type="month" class="experience-end">
                    <div class="checkbox-group">
                        <input type="checkbox" class="experience-current" id="currentWork${newIndex}">
                        <label for="currentWork${newIndex}">Currently Working</label>
                    </div>
                </div>
                <div class="input-group full-width">
                    <label>Responsibilities & Achievements</label>
                    <textarea class="experience-description" placeholder="Describe your responsibilities, achievements, and key contributions..." rows="4"></textarea>
                </div>
            </div>
            <button type="button" class="btn-remove-section">
                <i class="fas fa-trash"></i> Remove Experience
            </button>
        </div>
    `;
    
    experienceSection.insertAdjacentHTML('beforeend', sectionHTML);
    
    // Add remove button listener
    const newRemoveBtn = experienceSection.lastElementChild.querySelector('.btn-remove-section');
    newRemoveBtn.addEventListener('click', function() {
        const section = this.closest('.section-item');
        if (experienceSection.children.length > 1) {
            section.remove();
            updatePreview();
        } else {
            showNotification('Cannot remove the last experience section. Clear fields if not needed.', 'error');
        }
    });
    
    // Add currently working checkbox listener
    const currentCheckbox = document.getElementById(`currentWork${newIndex}`);
    const endDateInput = experienceSection.lastElementChild.querySelector('.experience-end');
    
    if (currentCheckbox && endDateInput) {
        currentCheckbox.addEventListener('change', function() {
            endDateInput.disabled = this.checked;
            if (this.checked) {
                endDateInput.value = '';
            }
            updatePreview();
        });
    }
    
    updatePreview();
}

function addProjectSection() {
    const projectsSection = document.getElementById('projectsSection');
    if (!projectsSection) return;
    
    const sectionHTML = `
        <div class="section-item">
            <div class="form-grid">
                <div class="input-group">
                    <label>Project Name</label>
                    <input type="text" class="project-name" placeholder="E-commerce Website">
                </div>
                <div class="input-group">
                    <label>Project Link/URL</label>
                    <input type="url" class="project-url" placeholder="https://example.com">
                </div>
                <div class="input-group full-width">
                    <label>Description</label>
                    <textarea class="project-description" placeholder="Describe the project, technologies used, and your role..." rows="3"></textarea>
                </div>
            </div>
            <button type="button" class="btn-remove-section">
                <i class="fas fa-trash"></i> Remove Project
            </button>
        </div>
    `;
    
    projectsSection.insertAdjacentHTML('beforeend', sectionHTML);
    
    // Add remove button listener
    const newRemoveBtn = projectsSection.lastElementChild.querySelector('.btn-remove-section');
    newRemoveBtn.addEventListener('click', function() {
        const section = this.closest('.section-item');
        if (projectsSection.children.length > 1) {
            section.remove();
            updatePreview();
        } else {
            showNotification('Cannot remove the last project section. Clear fields if not needed.', 'error');
        }
    });
    
    updatePreview();
}

function addCertificationSection() {
    const certificationsSection = document.getElementById('certificationsSection');
    if (!certificationsSection) return;
    
    const sectionHTML = `
        <div class="section-item">
            <div class="form-grid">
                <div class="input-group">
                    <label>Certification Name</label>
                    <input type="text" class="certification-name" placeholder="AWS Certified Developer">
                </div>
                <div class="input-group">
                    <label>Issuing Organization</label>
                    <input type="text" class="certification-org" placeholder="Amazon Web Services">
                </div>
                <div class="input-group">
                    <label>Issue Date</label>
                    <input type="month" class="certification-date">
                </div>
            </div>
            <button type="button" class="btn-remove-section">
                <i class="fas fa-trash"></i> Remove Certification
            </button>
        </div>
    `;
    
    certificationsSection.insertAdjacentHTML('beforeend', sectionHTML);
    
    // Add remove button listener
    const newRemoveBtn = certificationsSection.lastElementChild.querySelector('.btn-remove-section');
    newRemoveBtn.addEventListener('click', function() {
        const section = this.closest('.section-item');
        if (certificationsSection.children.length > 1) {
            section.remove();
            updatePreview();
        } else {
            showNotification('Cannot remove the last certification section. Clear fields if not needed.', 'error');
        }
    });
    
    updatePreview();
}

// ==================== SKILLS MANAGEMENT ====================
function initializeSkills() {
    const addSkillBtn = document.getElementById('addSkillBtn');
    const skillInput = document.getElementById('skillInput');
    const skillsTags = document.getElementById('skillsTags');
    const skillsLevels = document.getElementById('skillsLevels');
    
    if (!addSkillBtn || !skillInput || !skillsTags || !skillsLevels) return;
    
    let skills = [];
    
    addSkillBtn.addEventListener('click', addSkill);
    
    skillInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    });
    
    function addSkill() {
        const skill = skillInput.value.trim();
        if (!skill || skills.includes(skill)) {
            if (skills.includes(skill)) showNotification('Skill already added', 'error');
            return;
        }
        
        skills.push(skill);
        
        // Add tag
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.innerHTML = `${skill} <span class="remove-tag">×</span>`;
        skillsTags.appendChild(tag);
        
        tag.querySelector('.remove-tag').addEventListener('click', () => {
            tag.remove();
            const levelToRemove = skillsLevels.querySelector(`[data-skill="${skill}"]`);
            if (levelToRemove) levelToRemove.remove();
            skills = skills.filter(s => s !== skill);
            updatePreview();
        });
        
        // Add level slider
        const levelDiv = document.createElement('div');
        levelDiv.className = 'skill-level';
        levelDiv.dataset.skill = skill;
        levelDiv.innerHTML = `
            <label>${skill}</label>
            <input type="range" min="1" max="5" value="3" class="skill-range">
            <span class="skill-value">3/5</span>
        `;
        const range = levelDiv.querySelector('.skill-range');
        range.addEventListener('input', () => {
            levelDiv.querySelector('.skill-value').textContent = `${range.value}/5`;
            updatePreview();
        });
        skillsLevels.appendChild(levelDiv);
        
        skillInput.value = '';
        updatePreview();
    }
}

// ==================== HOBBIES MANAGEMENT ====================
function initializeHobbies() {
    const addHobbyBtn = document.getElementById('addHobbyBtn');
    const hobbyInput = document.getElementById('hobbyInput');
    const hobbiesTags = document.getElementById('hobbiesTags');
    
    if (!addHobbyBtn || !hobbyInput || !hobbiesTags) return;
    
    let hobbies = [];
    
    addHobbyBtn.addEventListener('click', addHobby);
    
    hobbyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHobby();
        }
    });
    
    function addHobby() {
        const hobby = hobbyInput.value.trim();
        if (!hobby || hobbies.includes(hobby)) {
            if (hobbies.includes(hobby)) showNotification('Hobby already added', 'error');
            return;
        }
        
        hobbies.push(hobby);
        
        const tag = document.createElement('span');
        tag.className = 'hobby-tag';
        tag.innerHTML = `${hobby} <span class="remove-tag">×</span>`;
        hobbiesTags.appendChild(tag);
        
        tag.querySelector('.remove-tag').addEventListener('click', () => {
            tag.remove();
            hobbies = hobbies.filter(h => h !== hobby);
            updatePreview();
        });
        
        hobbyInput.value = '';
        updatePreview();
    }
}

// ==================== TEMPLATES ====================
function initializeTemplates() {
    // Dynamically load sample templates into grid
    loadTemplates();
    
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (e.target.classList.contains('use-template-btn') || e.target.closest('.use-template-btn')) {
                const btn = e.target.classList.contains('use-template-btn') ? e.target : e.target.closest('.use-template-btn');
                const templateId = btn.getAttribute('data-template');
                selectTemplate(templateId);
            }
        });
    });
    
    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter templates
            document.querySelectorAll('.template-card').forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Template selection function
    function selectTemplate(templateId) {
        const templateSelect = document.getElementById('templateSelect');
        if (templateSelect) {
            templateSelect.value = templateId;
            showNotification(`"${templateId.charAt(0).toUpperCase() + templateId.slice(1)}" template selected!`);
            updatePreview();
        }
    }
}

function loadTemplates() {
    const grid = document.querySelector('.templates-grid');
    if (!grid) return;
    
    const templates = [
        {id: 'professional', category: 'professional', name: 'Professional Clean', desc: 'Clean and professional layout for corporate jobs', features: ['ATS Friendly', 'Responsive']},
        {id: 'modern', category: 'professional', name: 'Modern Edge', desc: 'Sleek design with modern elements', features: ['Custom Colors', 'Two-Column Option']},
        {id: 'creative', category: 'creative', name: 'Creative Flow', desc: 'Vibrant template for designers and artists', features: ['Bold Accents', 'Image Support']},
        {id: 'minimal', category: 'minimal', name: 'Minimalist', desc: 'Simple and elegant minimal design', features: ['Fast Load', 'Easy Read']},
        {id: 'executive', category: 'executive', name: 'Executive Pro', desc: 'Premium layout for high-level positions', features: ['Charts', 'Linked Sections']}
    ];
    
    templates.forEach(t => {
        const cardHTML = `
            <div class="template-card" data-category="${t.category}">
                <div class="template-preview" style="background: linear-gradient(135deg, #4a6fa5, #166088);"></div>
                <div class="template-info">
                    <h4>${t.name}</h4>
                    <p>${t.desc}</p>
                    <div class="template-features">
                        ${t.features.map(f => `<span class="template-feature">${f}</span>`).join('')}
                    </div>
                    <button class="btn-template use-template-btn" data-template="${t.id}">Use Template</button>
                </div>
            </div>
        `;
        grid.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// ==================== EXAMPLES ====================
function initializeExamples() {
    const exampleButtons = document.querySelectorAll('.btn-template[data-example]');
    
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const example = this.getAttribute('data-example');
            loadExample(example);
        });
    });
}

function loadExample(example) {
    // Load more complete data for examples
    switch(example) {
        case 'developer':
            setFieldValue('fullName', 'John Smith');
            setFieldValue('profession', 'Full Stack Developer');
            setFieldValue('email', 'john.smith@example.com');
            setFieldValue('phone', '+1 (234) 567-8900');
            setFieldValue('summary', 'Experienced full-stack developer with expertise in JavaScript, React, Node.js, and cloud platforms. Passionate about creating efficient, scalable web applications.');
            // Add sample education
            document.querySelector('.education-degree').value = 'Bachelor of Computer Science';
            document.querySelector('.education-institution').value = 'University of Technology';
            document.querySelector('.education-year').value = '2020';
            // Add sample experience
            document.querySelector('.experience-title').value = 'Frontend Developer';
            document.querySelector('.experience-company').value = 'Tech Solutions Inc.';
            document.querySelector('.experience-start').value = '2018-01';
            document.querySelector('.experience-end').value = '2022-12';
            break;
        case 'designer':
            setFieldValue('fullName', 'Sarah Johnson');
            setFieldValue('profession', 'Graphic Designer');
            setFieldValue('email', 'sarah.johnson@example.com');
            setFieldValue('phone', '+1 (987) 654-3210');
            setFieldValue('summary', 'Creative graphic designer with 8+ years of experience in branding, UI/UX design, and digital marketing. Skilled in Adobe Creative Suite and modern design tools.');
            // Add sample project
            document.querySelector('.project-name').value = 'Brand Identity Project';
            document.querySelector('.project-url').value = 'https://example.com';
            break;
        case 'marketing':
            setFieldValue('fullName', 'Michael Chen');
            setFieldValue('profession', 'Digital Marketing Specialist');
            setFieldValue('email', 'michael.chen@example.com');
            setFieldValue('phone', '+1 (555) 123-7890');
            setFieldValue('summary', 'Results-driven marketing professional with expertise in SEO, social media marketing, and content strategy. Proven track record of increasing brand visibility and revenue.');
            // Add sample certification
            document.querySelector('.certification-name').value = 'Google Analytics Certified';
            document.querySelector('.certification-org').value = 'Google';
            document.querySelector('.certification-date').value = '2023-01';
            break;
    }
    
    showNotification(`${example.charAt(0).toUpperCase() + example.slice(1)} example loaded!`);
    updatePreview();
}

function setFieldValue(id, value) {
    const field = document.getElementById(id);
    if (field) field.value = value;
}

// ==================== PREVIEW ====================
function initializePreview() {
    const refreshPreviewBtn = document.getElementById('refreshPreviewBtn');
    const togglePreviewMode = document.getElementById('togglePreviewMode');
    const downloadHTMLBtn = document.getElementById('downloadHTMLBtn');
    const downloadPDFBtn = document.getElementById('downloadPDFBtn');
    const sharePortfolioBtn = document.getElementById('sharePortfolioBtn');
    
    let previewMode = 'desktop';
    
    // Refresh preview
    if (refreshPreviewBtn) {
        refreshPreviewBtn.addEventListener('click', updatePreview);
    }
    
    // Toggle preview mode
    if (togglePreviewMode) {
        togglePreviewMode.addEventListener('click', function() {
            const deviceFrame = document.querySelector('.device-frame');
            if (!deviceFrame) return;
            
            if (previewMode === 'desktop') {
                previewMode = 'mobile';
                deviceFrame.style.width = '375px';
                deviceFrame.style.margin = '0 auto';
                this.innerHTML = '<i class="fas fa-desktop"></i> Desktop';
            } else {
                previewMode = 'desktop';
                deviceFrame.style.width = '100%';
                deviceFrame.style.margin = '0';
                this.innerHTML = '<i class="fas fa-mobile-alt"></i> Mobile';
            }
            updatePreview();
        });
    }
    
    // Download buttons
    if (downloadHTMLBtn) {
        downloadHTMLBtn.addEventListener('click', downloadHTML);
    }
    
    if (downloadPDFBtn) {
        downloadPDFBtn.addEventListener('click', downloadPDF);
    }
    
    // Share button copies link to clipboard
    if (sharePortfolioBtn) {
        sharePortfolioBtn.addEventListener('click', function() {
            const url = window.location.href;
            navigator.clipboard.writeText(url).then(() => {
                showNotification('Link copied to clipboard! Share with others.');
            }).catch(() => {
                showNotification('Failed to copy link.', 'error');
            });
        });
    }
    
    // Initial preview update
    updatePreview();
    
    // Update preview on form changes
    const form = document.getElementById('portfolioForm');
    if (form) {
        form.addEventListener('input', debounce(updatePreview, 300));
        form.addEventListener('change', updatePreview);
    }
}

function updatePreview() {
    console.log('Updating preview...');
    
    const previewContent = document.getElementById('previewContent');
    const previewSections = document.getElementById('previewSections');
    const previewWords = document.getElementById('previewWords');
    const previewTemplate = document.getElementById('previewTemplate');
    
    if (!previewContent) return;
    
    // Get form data
    const formData = {
        fullName: getFieldValue('fullName') || 'Your Name',
        profession: getFieldValue('profession') || 'Your Profession',
        email: getFieldValue('email') || 'email@example.com',
        phone: getFieldValue('phone') || '',
        address: getFieldValue('address') || '',
        summary: getFieldValue('summary') || '',
        linkedin: getFieldValue('linkedin') || '',
        github: getFieldValue('github') || '',
        website: getFieldValue('website') || '',
        twitter: getFieldValue('twitter') || ''
    };
    
    // Get customization options
    const template = getFieldValue('templateSelect') || 'professional';
    const fontFamily = getFieldValue('fontFamily') || "'Poppins', sans-serif";
    const templateColor = getFieldValue('templateColor') || '#4a6fa5';
    const textColor = getFieldValue('textColor') || '#333333';
    const accentColor = getFieldValue('accentColor') || '#ff7e5f';
    const backgroundColor = getFieldValue('backgroundColor') || '#ffffff';
    const layoutStyle = getFieldValue('layoutStyle') || 'single';
    const showPhoto = document.getElementById('showPhoto')?.checked ?? true;
    const showSocial = document.getElementById('showSocial')?.checked ?? true;
    const showSkillsChart = document.getElementById('showSkillsChart')?.checked ?? true;
    const showReferences = document.getElementById('showReferences')?.checked ?? true;
    const showHobbies = document.getElementById('showHobbies')?.checked ?? true;
    
    // Generate preview HTML
    let html = `
        <div class="generated-portfolio template-${template} layout-${layoutStyle}">
            <div class="portfolio-header">
                ${showPhoto ? '<div class="portfolio-avatar"><i class="fas fa-user"></i></div>' : ''}
                <h1 class="portfolio-name">${formData.fullName}</h1>
                <h2 class="portfolio-title">${formData.profession}</h2>
                
                <div class="portfolio-contact">
                    ${formData.email ? `<div><i class="fas fa-envelope"></i> ${formData.email}</div>` : ''}
                    ${formData.phone ? `<div><i class="fas fa-phone"></i> ${formData.phone}</div>` : ''}
                    ${formData.address ? `<div><i class="fas fa-map-marker-alt"></i> ${formData.address}</div>` : ''}
                </div>
            </div>
    `;
    
    // Add summary if present
    if (formData.summary) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-user"></i> Professional Summary</h3>
                <p>${formData.summary}</p>
            </div>
        `;
    }
    
    // Add education section if any education exists
    const educationItems = document.querySelectorAll('.education-degree');
    if (educationItems.length > 0 && educationItems[0].value.trim()) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-graduation-cap"></i> Education</h3>
        `;
        
        educationItems.forEach((degreeInput, index) => {
            const degree = degreeInput.value.trim();
            const institution = document.querySelectorAll('.education-institution')[index]?.value.trim() || '';
            const location = document.querySelectorAll('.education-location')[index]?.value.trim() || '';
            const year = document.querySelectorAll('.education-year')[index]?.value || '';
            const description = document.querySelectorAll('.education-description')[index]?.value.trim() || '';
            
            if (degree || institution) {
                html += `
                    <div class="education-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${degree || 'Degree'}</div>
                                <div class="item-subtitle">${institution || 'Institution'} ${location ? `, ${location}` : ''}</div>
                            </div>
                            ${year ? `<div class="item-date">${year}</div>` : ''}
                        </div>
                        ${description ? `<p>${description}</p>` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Add experience section
    const experienceItems = document.querySelectorAll('.experience-title');
    if (experienceItems.length > 0 && experienceItems[0].value.trim()) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-briefcase"></i> Experience</h3>
        `;
        
        experienceItems.forEach((titleInput, index) => {
            const title = titleInput.value.trim();
            const company = document.querySelectorAll('.experience-company')[index]?.value.trim() || '';
            const location = document.querySelectorAll('.experience-location')[index]?.value.trim() || '';
            const start = document.querySelectorAll('.experience-start')[index]?.value || '';
            const end = document.querySelectorAll('.experience-end')[index]?.value || '';
            const current = document.querySelectorAll('.experience-current')[index]?.checked || false;
            const description = document.querySelectorAll('.experience-description')[index]?.value.trim() || '';
            
            if (title || company) {
                html += `
                    <div class="experience-item">
                        <div class="item-header">
                            <div>
                                <div class="item-title">${title || 'Job Title'}</div>
                                <div class="item-subtitle">${company || 'Company'} ${location ? `, ${location}` : ''}</div>
                            </div>
                            <div class="item-date">${start} - ${current ? 'Present' : end}</div>
                        </div>
                        ${description ? `<p>${description.replace(/\n/g, '<br>')}</p>` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Add skills section
    const skillTags = document.querySelectorAll('#skillsTags .skill-tag');
    if (skillTags.length > 0) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-code"></i> Skills</h3>
        `;
        
        if (showSkillsChart) {
            html += '<div class="skills-progress">';
            skillTags.forEach((tag, index) => {
                const skill = tag.textContent.replace('×', '').trim();
                const range = document.querySelectorAll('.skill-range')[index]?.value || 3;
                html += `
                    <div class="skill-item">
                        <span>${skill}</span>
                        <div class="progress">
                            <div style="width: ${range * 20}%"></div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        } else {
            html += `
                <div class="skills-list">
                    ${Array.from(skillTags).map(tag => 
                        `<span class="skill-tag">${tag.textContent.replace('×', '').trim()}</span>`
                    ).join('')}
                </div>
            `;
        }
        
        html += `</div>`;
    }
    
    // Add projects section
    const projectItems = document.querySelectorAll('.project-name');
    if (projectItems.length > 0 && projectItems[0].value.trim()) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-project-diagram"></i> Projects</h3>
        `;
        
        projectItems.forEach((nameInput, index) => {
            const name = nameInput.value.trim();
            const url = document.querySelectorAll('.project-url')[index]?.value.trim() || '';
            const description = document.querySelectorAll('.project-description')[index]?.value.trim() || '';
            
            if (name) {
                html += `
                    <div class="project-item">
                        <div class="item-header">
                            <div class="item-title">${name}</div>
                            ${url ? `<a href="${url}" target="_blank"><i class="fas fa-link"></i> View Project</a>` : ''}
                        </div>
                        ${description ? `<p>${description}</p>` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Add certifications section
    const certificationItems = document.querySelectorAll('.certification-name');
    if (certificationItems.length > 0 && certificationItems[0].value.trim()) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-certificate"></i> Certifications</h3>
        `;
        
        certificationItems.forEach((nameInput, index) => {
            const name = nameInput.value.trim();
            const org = document.querySelectorAll('.certification-org')[index]?.value.trim() || '';
            const date = document.querySelectorAll('.certification-date')[index]?.value || '';
            
            if (name) {
                html += `
                    <div class="certification-item">
                        <div class="item-header">
                            <div class="item-title">${name}</div>
                            <div class="item-subtitle">${org}</div>
                        </div>
                        ${date ? `<div class="item-date">${date}</div>` : ''}
                    </div>
                `;
            }
        });
        
        html += `</div>`;
    }
    
    // Add hobbies if shown and present
    const hobbyTags = document.querySelectorAll('#hobbiesTags .hobby-tag');
    if (showHobbies && hobbyTags.length > 0) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-heart"></i> Hobbies & Interests</h3>
                <div class="hobbies-list">
                    ${Array.from(hobbyTags).map(tag => 
                        `<span class="hobby-tag">${tag.textContent.replace('×', '').trim()}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    // Add references if shown
    if (showReferences) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-users"></i> References</h3>
                <p>Available upon request.</p>
            </div>
        `;
    }
    
    // Add social links if shown
    if (showSocial && (formData.linkedin || formData.github || formData.website || formData.twitter)) {
        html += `
            <div class="portfolio-section">
                <h3><i class="fas fa-share-alt"></i> Connect With Me</h3>
                <div class="social-links">
                    ${formData.linkedin ? `<a href="${formData.linkedin}" target="_blank"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                    ${formData.github ? `<a href="${formData.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>` : ''}
                    ${formData.website ? `<a href="${formData.website}" target="_blank"><i class="fas fa-globe"></i> Website</a>` : ''}
                    ${formData.twitter ? `<a href="${formData.twitter}" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>` : ''}
                </div>
            </div>
        `;
    }
    
    html += `</div>`;
    
    // Update preview content
    previewContent.innerHTML = html;
    
    // Apply customizations
    previewContent.style.fontFamily = fontFamily;
    previewContent.style.color = textColor;
    previewContent.style.backgroundColor = backgroundColor;
    previewContent.style.setProperty('--primary-color', templateColor);
    previewContent.style.setProperty('--accent-color', accentColor);
    
    // Update stats
    if (previewSections) {
        const sections = previewContent.querySelectorAll('.portfolio-section').length + 1;
        previewSections.textContent = sections;
    }
    
    if (previewWords) {
        const text = previewContent.textContent || '';
        const words = text.trim().split(/\s+/).length;
        previewWords.textContent = words;
    }
    
    if (previewTemplate) {
        const templateSelect = document.getElementById('templateSelect');
        previewTemplate.textContent = templateSelect ? templateSelect.options[templateSelect.selectedIndex].text : 'Professional';
    }
}

function getFieldValue(id) {
    const field = document.getElementById(id);
    return field ? field.value : '';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== HTML DOWNLOAD ====================
function downloadHTML() {
    const previewContent = document.getElementById('previewContent');
    if (!previewContent) return;
    
    // Get form data
    const formData = {
        fullName: getFieldValue('fullName') || 'Your Name',
        profession: getFieldValue('profession') || 'Your Profession',
        email: getFieldValue('email') || 'email@example.com',
        phone: getFieldValue('phone') || '',
        address: getFieldValue('address') || '',
        summary: getFieldValue('summary') || ''
    };
    
    // Get customization options
    const template = getFieldValue('templateSelect') || 'professional';
    const primaryColor = getFieldValue('templateColor') || '#4a6fa5';
    const accentColor = getFieldValue('accentColor') || '#ff7e5f';
    const fontFamily = getFieldValue('fontFamily') || "'Poppins', sans-serif";
    const backgroundColor = getFieldValue('backgroundColor') || '#ffffff';
    const textColor = getFieldValue('textColor') || '#333333';
    const layoutStyle = getFieldValue('layoutStyle') || 'single';
    
    // Include navigation?
    const includeNav = document.getElementById('includeNavigation')?.checked ?? true;
    const navStyle = document.getElementById('navStyle')?.value || 'standard';
    
    // Get navigation items
    const navItems = getNavigationItems();
    
    // Generate HTML
    const htmlContent = generateCompleteHTML(formData, template, primaryColor, accentColor, 
                                             fontFamily, backgroundColor, textColor, 
                                             layoutStyle, includeNav, navStyle, navItems);
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('HTML portfolio downloaded!');
}

function generateCompleteHTML(formData, template, primaryColor, accentColor, fontFamily, 
                             backgroundColor, textColor, layoutStyle, includeNav, navStyle, navItems) {
    
    const portfolioContent = document.getElementById('previewContent').innerHTML;
    
    // Navigation HTML
    let navigationHTML = '';
    if (includeNav) {
        navigationHTML = `
        <nav class="portfolio-navbar ${navStyle}">
            <div class="nav-container">
                <a href="#" class="portfolio-logo">
                    <i class="fas fa-file-alt"></i>
                    ${formData.fullName}
                </a>
                <button class="mobile-menu-btn">
                    <i class="fas fa-bars"></i>
                </button>
                <ul class="nav-links">
                    ${navItems.map(item => `
                    <li><a href="#${item.id}"><i class="${item.icon}"></i> ${item.label}</a></li>
                    `).join('')}
                </ul>
            </div>
        </nav>`;
    }
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formData.fullName} - Portfolio</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=${fontFamily.includes('Poppins') ? 'Poppins' : 'Roboto'}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        :root {
            --primary-color: ${primaryColor};
            --accent-color: ${accentColor};
            --bg-color: ${backgroundColor};
            --text-color: ${textColor};
            --text-secondary: #666666;
            --border-color: #e0e0e0;
        }
        
        body {
            font-family: ${fontFamily};
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            padding: 20px;
        }
        
        ${includeNav ? `
        .portfolio-navbar {
            background-color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px 0;
            margin-bottom: 30px;
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .portfolio-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-color);
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 30px;
        }
        
        .nav-links a {
            color: var(--text-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: var(--primary-color);
        }
        
        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-color);
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .nav-links {
                display: none;
            }
            .mobile-menu-btn {
                display: block;
            }
        }
        ` : ''}
        
        .generated-portfolio {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 20px rgba(0,0,0,0.1);
        }
        
        .portfolio-header {
            background: linear-gradient(135deg, var(--primary-color), ${primaryColor}99);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        
        .portfolio-avatar {
            width: 120px;
            height: 120px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3rem;
        }
        
        .portfolio-name {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        
        .portfolio-title {
            font-size: 1.3rem;
            opacity: 0.9;
            margin-bottom: 20px;
        }
        
        .portfolio-contact {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
        }
        
        .portfolio-section {
            padding: 30px;
            border-bottom: 1px solid var(--border-color);
        }
        
        .portfolio-section:last-child {
            border-bottom: none;
        }
        
        .portfolio-section h3 {
            color: var(--primary-color);
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid var(--border-color);
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        
        .item-title {
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .item-subtitle {
            color: var(--text-secondary);
        }
        
        .item-date {
            color: var(--primary-color);
            font-weight: 600;
        }
        
        .skills-list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 10px;
        }
        
        .skill-tag {
            background: var(--primary-color);
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .social-links {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 10px;
        }
        
        .social-links a {
            color: var(--primary-color);
            text-decoration: none;
            padding: 8px 15px;
            border: 1px solid var(--border-color);
            border-radius: 5px;
            transition: all 0.3s;
        }
        
        .social-links a:hover {
            background-color: rgba(74, 111, 165, 0.1);
        }
        
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            
            .portfolio-name {
                font-size: 2rem;
            }
            
            .portfolio-section {
                padding: 20px;
            }
            
            .item-header {
                flex-direction: column;
                gap: 5px;
            }
        }
    </style>
</head>
<body>
    ${navigationHTML}
    
    <main>
        ${portfolioContent}
    </main>
    
    <footer style="text-align: center; padding: 30px 20px; color: var(--text-secondary); margin-top: 40px;">
        <p>Generated with Free Resume Generator | ${new Date().getFullYear()}</p>
    </footer>
    
    ${includeNav ? `
    <script>
        document.querySelector('.mobile-menu-btn')?.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    </script>
    ` : ''}
</body>
</html>`;
}

function getNavigationItems() {
    // Default navigation items
    return [
        { label: 'Home', id: 'home', icon: 'fas fa-home' },
        { label: 'About', id: 'about', icon: 'fas fa-user' },
        { label: 'Experience', id: 'experience', icon: 'fas fa-briefcase' },
        { label: 'Projects', id: 'projects', icon: 'fas fa-project-diagram' },
        { label: 'Contact', id: 'contact', icon: 'fas fa-envelope' }
    ];
}

// ==================== PDF DOWNLOAD ====================
async function downloadPDF() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Get the preview content
        const previewContent = document.getElementById('previewContent');
        if (!previewContent) {
            throw new Error('Preview content not found');
        }
        
        // Create a clone to avoid modifying the original
        const contentClone = previewContent.cloneNode(true);
        
        // Apply PDF-specific styles
        contentClone.style.cssText = `
            width: 190mm !important;
            padding: 20px !important;
            background: white !important;
            color: black !important;
            font-size: 12px !important;
        `;
        
        // Create a temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.cssText = `
            position: absolute;
            left: -10000px;
            top: 0;
            width: 210mm;
            background: white;
        `;
        tempContainer.appendChild(contentClone);
        document.body.appendChild(tempContainer);
        
        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Capture the content
        const canvas = await html2canvas(contentClone, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            width: contentClone.scrollWidth,
            height: contentClone.scrollHeight
        });
        
        // Clean up
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
        const pdfHeight = pdf.internal.pageSize.getHeight() - 20;
        
        // Calculate image dimensions
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        
        // Save the PDF
        const fileName = `${getFieldValue('fullName') || 'portfolio'}-resume.pdf`;
        pdf.save(fileName);
        
        showNotification('PDF downloaded successfully!');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showNotification('Failed to generate PDF. Please try again or use HTML download.', 'error');
        
        // Fallback: Simple text PDF
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const previewContent = document.getElementById('previewContent');
            
            // Simple text extraction as fallback
            const text = previewContent.innerText;
            pdf.setFontSize(11);
            
            // Split text into lines
            const lines = pdf.splitTextToSize(text, 180);
            let y = 20;
            
            for (let i = 0; i < lines.length; i++) {
                if (y > 280) { // New page if near bottom
                    pdf.addPage();
                    y = 20;
                }
                pdf.text(10, y, lines[i]);
                y += 7;
            }
            
            const fileName = `${getFieldValue('fullName') || 'portfolio'}-resume.pdf`;
            pdf.save(fileName);
            showNotification('PDF downloaded (text version).', 'info');
            
        } catch (fallbackError) {
            console.error('Fallback PDF error:', fallbackError);
            showNotification('PDF generation failed completely. Please use HTML download.', 'error');
        }
        
    } finally {
        if (loadingSpinner) loadingSpinner.style.display = 'none';
    }
}

// ==================== MODALS ====================
function initializeModals() {
    const successModal = document.getElementById('successModal');
    
    if (!successModal) {
        console.warn('successModal not found');
        return;
    }
    
    const closeModal = successModal.querySelector('.close-modal');
    const continueEditing = document.getElementById('continueEditing');
    const createAnother = document.getElementById('createAnother');
    
    // Download buttons in modal
    const downloadPDFFinal = document.getElementById('downloadPDFFinal');
    const downloadHTMLFinal = document.getElementById('downloadHTMLFinal');
    const downloadDOCX = document.getElementById('downloadDOCX');
    
    // Close modal buttons
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    if (continueEditing) {
        continueEditing.addEventListener('click', function() {
            successModal.style.display = 'none';
        });
    }
    
    if (createAnother) {
        createAnother.addEventListener('click', resetForm);
    }
    
    // Download buttons
    if (downloadPDFFinal) {
        downloadPDFFinal.addEventListener('click', function() {
            downloadPDF();
            successModal.style.display = 'none';
        });
    }
    
    if (downloadHTMLFinal) {
        downloadHTMLFinal.addEventListener('click', function() {
            downloadHTML();
            successModal.style.display = 'none';
        });
    }
    
    if (downloadDOCX) {
        downloadDOCX.addEventListener('click', function() {
            showNotification('DOCX download coming soon! Use HTML or PDF for now.');
        });
    }
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === successModal) {
            successModal.style.display = 'none';
        }
    });
}

function showSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) {
        successModal.style.display = 'flex';
        showNotification('Portfolio generated successfully!');
    }
}

function resetForm() {
    if (confirm('Are you sure you want to start over? All current data will be lost.')) {
        const form = document.getElementById('portfolioForm');
        if (form) form.reset();
        
        // Clear dynamic sections
        const dynamicSections = document.querySelectorAll('.dynamic-section');
        dynamicSections.forEach(section => {
            const items = section.querySelectorAll('.section-item');
            for (let i = items.length - 1; i > 0; i--) {
                items[i].remove();
            }
            // Reset first item fields
            items[0].querySelectorAll('input, textarea').forEach(field => field.value = '');
        });
        
        // Clear skills and hobbies
        const skillsTags = document.getElementById('skillsTags');
        const skillsLevels = document.getElementById('skillsLevels');
        const hobbiesTags = document.getElementById('hobbiesTags');
        
        if (skillsTags) skillsTags.innerHTML = '';
        if (skillsLevels) skillsLevels.innerHTML = '';
        if (hobbiesTags) hobbiesTags.innerHTML = '';
        
        // Reset preview
        updatePreview();
        
        // Clear localStorage
        localStorage.removeItem('formData');
        
        // Close modal
        const successModal = document.getElementById('successModal');
        if (successModal) successModal.style.display = 'none';
        
        showNotification('Form reset successfully!');
    }
}

// ==================== FOOTER ====================
function initializeFooter() {
    const socialButtons = document.querySelectorAll('.social-btn');
    
    socialButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('facebook') ? 'Facebook' :
                           this.classList.contains('twitter') ? 'Twitter' :
                           this.classList.contains('linkedin') ? 'LinkedIn' : 'WhatsApp';
            
            showNotification(`Sharing on ${platform}...`);
            
            // Open share dialogs
            let shareUrl = window.location.href;
            if (platform === 'Facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
            if (platform === 'Twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check out this free resume generator!`, '_blank');
            if (platform === 'LinkedIn') window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}`, '_blank');
            if (platform === 'WhatsApp') window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, '_blank');
        });
    });
}

// ==================== UTILITY FUNCTIONS ====================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#dc3545' : '#28a745'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Add animation styles
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function loadSampleData() {
    // Only load if form is empty
    const fullName = document.getElementById('fullName');
    if (fullName && !fullName.value) {
        fullName.value = 'Alex Johnson';
        
        const profession = document.getElementById('profession');
        if (profession) profession.value = 'Full Stack Developer';
        
        const email = document.getElementById('email');
        if (email) email.value = 'alex.johnson@example.com';
        
        const summary = document.getElementById('summary');
        if (summary) summary.value = 'Passionate full-stack developer with 5+ years of experience building web applications. Specialized in React, Node.js, and cloud technologies.';
        
        updatePreview();
    }
}

// Auto-save form data to localStorage
function saveFormData() {
    const form = document.getElementById('portfolioForm');
    if (!form) return;
    
    const data = {};
    form.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.type === 'checkbox') {
            data[field.id] = field.checked;
        } else {
            data[field.id] = field.value;
        }
    });
    
    localStorage.setItem('formData', JSON.stringify(data));
}

function loadSavedData() {
    const savedData = localStorage.getItem('formData');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    const form = document.getElementById('portfolioForm');
    if (!form) return;
    
    form.querySelectorAll('input, textarea, select').forEach(field => {
        if (field.id in data) {
            if (field.type === 'checkbox') {
                field.checked = data[field.id];
            } else {
                field.value = data[field.id];
            }
        }
    });
    
    updatePreview();
}

// Call save on changes
document.getElementById('portfolioForm')?.addEventListener('input', debounce(saveFormData, 1000));